/**
 * 讯飞语音识别 (IAT - 语音听写)
 * 支持中英文自动识别
 * 申请地址: https://console.xfyun.cn/services/iat
 * 需要在微信后台 socket 合法域名中添加:
 *   wss://iat-api.xfyun.cn
 */
import Taro from '@tarojs/taro'
import CryptoJS from 'crypto-js'

const APP_ID     = 'fb74bf2a'                               // ← 讯飞 APPID
const API_KEY    = 'a1ddd25040f6bd8a802a593289054510'       // ← 讯飞 APIKey
const API_SECRET = 'YmUwZGRlZWRhMDU3ZjFkNjI4NjFlOGFj'     // ← 讯飞 APISecret

const CHUNK_SIZE = 1280  // 每帧 1280 字节 (40ms @ 16kHz)

/** 生成带鉴权的 WebSocket URL */
const buildAuthUrl = () => {
  const date = new Date().toUTCString()
  const host = 'iat-api.xfyun.cn'
  const path = '/v2/iat'
  const signOrigin = `host: ${host}\ndate: ${date}\nPOST ${path} HTTP/1.1`
  const signature  = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signOrigin, API_SECRET)
  )
  const authOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(authOrigin)
  )
  return `wss://${host}${path}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${host}`
}

/**
 * 将录音文件转为文字（中英文均可识别）
 * @param {string} filePath  RecorderManager onStop 返回的 tempFilePath
 * @returns {Promise<string>} 识别出的文字
 */
export const transcribeAudio = (filePath) =>
  new Promise((resolve, reject) => {
    // 1. 读取文件
    Taro.getFileSystemManager().readFile({
      filePath,
      fail: (err) => reject(new Error('读取文件失败:' + err.errMsg)),
      success: ({ data: buffer }) => {
        const url = buildAuthUrl()
        const ws  = Taro.connectSocket({ url, complete: () => {} })

        let finalText = ''
        let resolved  = false

        const done = (text, err) => {
          if (resolved) return
          resolved = true
          try { ws.close() } catch (_) {}
          err ? reject(err) : resolve(text)
        }

        ws.onError((e) =>
          done(null, new Error('WS错误:' + (e.errMsg || JSON.stringify(e))))
        )

        ws.onOpen(() => {
          let offset = 0
          const total = buffer.byteLength

          const sendNext = () => {
            if (offset > total) return
            const end      = Math.min(offset + CHUNK_SIZE, total)
            const isFirst  = offset === 0
            const isLast   = end >= total
            const chunk    = buffer.slice(offset, end)
            const audio    = Taro.arrayBufferToBase64(chunk)

            const frame = {
              data: {
                status:   isFirst ? 0 : isLast ? 2 : 1,
                format:   'audio/L16;rate=16000',
                encoding: 'raw',
                audio,
              },
            }

            // 第一帧附带参数
            if (isFirst) {
              frame.common   = { app_id: APP_ID }
              frame.business = {
                language:  'zh_cn',   // zh_cn 自动识别中英混合
                domain:    'iat',
                accent:    'mandarin',
                vad_eos:   10000,
                dwa:       'wpgs',    // 动态修正，提升准确率
              }
            }

            ws.send({ data: JSON.stringify(frame) })
            offset = end
            if (!isLast) setTimeout(sendNext, 40)
          }

          sendNext()
        })

        ws.onMessage(({ data: raw }) => {
          let res
          try { res = JSON.parse(raw) } catch (_) { return }

          if (res.code !== 0) {
            done(null, new Error(`讯飞错误${res.code}:${res.message}`))
            return
          }

          // 累积识别结果
          const ws_list = res.data?.result?.ws || []
          const piece   = ws_list
            .map(w => w.cw?.map(c => c.w).join('') ?? '')
            .join('')

          if (res.data?.result?.pgs === 'rpl') {
            // rpl: 替换模式，覆盖上一段
            finalText = finalText.slice(0, -finalText.split('').pop()?.length || 0)
          }
          finalText += piece

          if (res.data?.status === 2) {
            done(finalText.trim() || '')
          }
        })
      },
    })
  })
