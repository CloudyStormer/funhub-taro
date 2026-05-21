/**
 * 讯飞语音识别 (IAT - 语音听写)
 * 支持中英文自动识别
 * 申请地址: https://console.xfyun.cn/services/iat
 * 需要在微信后台 socket 合法域名中添加:
 *   wss://iat-api.xfyun.cn
 */
import Taro from '@tarojs/taro'
import CryptoJS from 'crypto-js'
import { isVoiceQuotaError, voiceQuotaMessage } from '../../../utils/voiceError'

const APP_ID     = 'fb74bf2a'
const API_KEY    = 'a1ddd25040f6bd8a802a593289054510'
const API_SECRET = 'YmUwZGRlZWRhMDU3ZjFkNjI4NjFlOGFj'

const CHUNK_SIZE    = 1280   // 每帧 1280 字节 (40ms @ 16kHz)
const SEND_INTERVAL = 5      // 文件上传不需要实时速率，5ms 发一帧（8x 加速）
const TIMEOUT_MS    = 20000  // 20s 超时兜底（长句需要更多时间）

/** 生成带鉴权的 WebSocket URL（WebSocket 握手是 GET） */
const buildAuthUrl = () => {
  const date       = new Date().toUTCString()
  const host       = 'iat-api.xfyun.cn'
  const path       = '/v2/iat'
  const signOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
  const signature  = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signOrigin, API_SECRET)
  )
  const authOrigin    = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(authOrigin)
  )
  return `wss://${host}${path}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${host}`
}

/**
 * 将录音文件转为文字（中英文均可识别）
 * 使用全局 Socket 事件（兼容 Taro connectSocket 的返回方式）
 * @param {string} filePath  RecorderManager onStop 返回的 tempFilePath
 * @returns {Promise<string>} 识别出的文字
 */
export const transcribeAudio = (filePath) =>
  new Promise((resolve, reject) => {
    console.log('[ASR] 开始读取录音文件:', filePath)

    Taro.getFileSystemManager().readFile({
      filePath,
      fail: (err) => {
        console.error('[ASR] 读取文件失败:', err)
        reject(new Error('读取文件失败:' + err.errMsg))
      },
      success: ({ data: buffer }) => {
        console.log('[ASR] 文件读取成功, 大小:', buffer.byteLength, 'bytes')

        const segments = {}
        let   resolved = false
        let   timeoutId

        const done = (text, err) => {
          if (resolved) return
          resolved = true
          clearTimeout(timeoutId)
          try { Taro.closeSocket() } catch (_) {}
          if (err) {
            console.error('[ASR] 识别失败:', err.message)
            reject(err)
          } else {
            console.log('[ASR] 识别完成:', text)
            resolve(text)
          }
        }

        // 超时兜底
        timeoutId = setTimeout(() => {
          console.warn('[ASR] 超时，强制返回已收到结果')
          const text = Object.keys(segments)
            .sort((a, b) => Number(a) - Number(b))
            .map(k => segments[k]).join('')
          done(text.trim() || '')
        }, TIMEOUT_MS)

        // ── 全局事件监听（Taro/微信均支持）──
        Taro.onSocketError((e) => {
          console.error('[ASR] WS 错误:', e)
          done(null, new Error('WS错误:' + (e.errMsg || JSON.stringify(e))))
        })

        Taro.onSocketClose((e) => {
          console.warn('[ASR] WS 关闭 code:', e?.code, 'reason:', e?.reason)
          if (!resolved) {
            const text = Object.keys(segments)
              .sort((a, b) => Number(a) - Number(b))
              .map(k => segments[k]).join('')
            if (text.trim()) done(text.trim())
            else done(null, new Error(`连接关闭(${e?.code}): ${e?.reason || '无结果'}`))
          }
        })

        Taro.onSocketMessage(({ data: raw }) => {
          let res
          try { res = JSON.parse(raw) } catch (_) { return }
          console.log('[ASR] 收到消息 code:', res.code, 'data.status:', res.data?.status)

          if (res.code !== 0) {
            const message = `讯飞错误 ${res.code}: ${res.message || ''}`
            done(null, new Error(isVoiceQuotaError(message) ? voiceQuotaMessage : message))
            return
          }

          if (res.data?.result) {
            const { ws: wsList = [], sn, pgs, rg } = res.data.result
            const piece = wsList.map(w => w.cw?.map(c => c.w).join('') ?? '').join('')
            if (pgs === 'rpl' && rg) {
              for (let i = rg[0]; i <= rg[1]; i++) delete segments[i]
            }
            if (sn !== undefined) segments[sn] = piece
            console.log('[ASR] 片段 sn=', sn, 'text=', piece)
          }

          if (res.data?.status === 2) {
            const finalText = Object.keys(segments)
              .sort((a, b) => Number(a) - Number(b))
              .map(k => segments[k]).join('')
            done(finalText.trim() || '')
          }
        })

        Taro.onSocketOpen(() => {
          console.log('[ASR] WS 已连接，开始发送音频帧')
          const total  = buffer.byteLength
          let   offset = 0

          const sendFrame = (status, audioB64) => {
            const frame = {
              data: { status, format: 'audio/L16;rate=16000', encoding: 'raw', audio: audioB64 },
            }
            if (status === 0) {
              frame.common   = { app_id: APP_ID }
              frame.business = {
                language: 'zh_cn',
                domain:   'iat',
                accent:   'mandarin',
                vad_eos:  8000,   // 8s 静音才判断结束，避免长句被提前截断
                dwa:      'wpgs',
              }
            }
            Taro.sendSocketMessage({ data: JSON.stringify(frame) })
          }

          const sendNext = () => {
            const end     = Math.min(offset + CHUNK_SIZE, total)
            const isFirst = offset === 0
            const isEnd   = end >= total
            const chunk   = buffer.slice(offset, end)
            const audio   = Taro.arrayBufferToBase64(chunk)
            const status  = isFirst ? 0 : (isEnd ? 2 : 1)

            sendFrame(status, audio)
            console.log(`[ASR] 发帧 status=${status} ${offset}->${end}/${total}`)
            offset = end

            if (!isEnd) {
              setTimeout(sendNext, SEND_INTERVAL)
            } else if (isFirst) {
              // 单帧：发完 status=0 后还需补一个 status=2
              console.log('[ASR] 单帧，补发 status=2')
              setTimeout(() => sendFrame(2, ''), 40)
            }
          }

          sendNext()
        })

        // ── 建立连接 ──
        console.log('[ASR] 连接 WebSocket...')
        Taro.connectSocket({ url: buildAuthUrl() })
      },
    })
  })
