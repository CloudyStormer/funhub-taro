/**
 * 讯飞 TTS (Text-To-Speech) — WebSocket v2
 * 需要在微信后台 socket 合法域名中添加: wss://tts-api.xfyun.cn
 */
import Taro from '@tarojs/taro'
import CryptoJS from 'crypto-js'

const APP_ID     = 'fb74bf2a'
const API_KEY    = 'a1ddd25040f6bd8a802a593289054510'
const API_SECRET = 'YmUwZGRlZWRhMDU3ZjFkNjI4NjFlOGFj'
const AUDIO_CDN  = 'https://tts01-huabei.iflyos.cn'

const buildAuthUrl = () => {
  const date       = new Date().toUTCString()
  const host       = 'tts-api.xfyun.cn'
  const path       = '/v2/tts'
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

// 当前播放的 InnerAudioContext / SocketTask
let _ctx = null
let _task = null

const isEnglishDominant = (text = '') => {
  const englishCount = (text.match(/[A-Za-z]/g) || []).length
  const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  return englishCount > chineseCount
}

const pickVoiceName = (text = '') => {
  if (isEnglishDominant(text)) return 'x2_catherine'
  return 'x4_lingxiaolu_en'
}

/** 停止当前正在播放的语音 */
export const stopSpeaking = () => {
  if (_task) {
    try { _task.close() } catch (_) {}
    _task = null
  }
  if (_ctx) {
    try { _ctx.stop(); _ctx.destroy() } catch (_) {}
    _ctx = null
  }
}

/**
 * 合成并播放文字（fire-and-forget）
 * @param {string} text  要朗读的文字
 */
export const speakText = (text) => {
  if (!text?.trim()) return
  stopSpeaking()

  const voiceName = pickVoiceName(text)
  console.log('[TTS] 开始合成:', text.slice(0, 30) + '...', 'voice=', voiceName)

  const chunks     = []
  let   settled    = false
  const timeoutId  = setTimeout(() => {
    if (!settled) {
      settled = true
      console.warn('[TTS] 超时')
      stopSpeaking()
    }
  }, 12000)

  const task = wx.connectSocket({ url: buildAuthUrl() })
  _task = task

  task.onError((e) => {
    clearTimeout(timeoutId)
    console.error('[TTS] WS错误:', e.errMsg || e)
  })

  task.onClose(() => {
    clearTimeout(timeoutId)
    if (_task === task) _task = null
  })

  task.onMessage(({ data: raw }) => {
    let res
    try { res = JSON.parse(raw) } catch (_) { return }

    if (res.code !== 0) {
      clearTimeout(timeoutId)
      console.error('[TTS] 讯飞错误:', res.code, res.message)
      stopSpeaking()
      return
    }

    if (res.data?.audio) chunks.push(res.data.audio)

    if (res.data?.status === 2) {
      clearTimeout(timeoutId)
      settled = true
      const base64Audio = chunks.join('')
      const tempPath    = `${Taro.env.USER_DATA_PATH}/tts_${Date.now()}.mp3`

      Taro.getFileSystemManager().writeFile({
        filePath: tempPath,
        data:     base64Audio,
        encoding: 'base64',
        fail:  (e) => console.error('[TTS] 写文件失败:', e.errMsg),
        success: () => {
          _ctx         = Taro.createInnerAudioContext()
          _ctx.autoplay = true
          _ctx.obeyMuteSwitch = false
          _ctx.useWebAudioImplement = true
          _ctx.src     = tempPath
          _ctx.onError((e) => console.error('[TTS] 播放失败:', e.errMsg))
          _ctx.onEnded(() => { _ctx = null })
          _ctx.play()
          console.log('[TTS] 开始播放')
        },
      })

      try { task.close() } catch (_) {}
      if (_task === task) _task = null
    }
  })

  task.onOpen(() => {
    const textB64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
    task.send({
      data: JSON.stringify({
        common:   { app_id: APP_ID },
        business: {
          aue:    'lame',        // MP3 格式
          auf:    'audio/L16;rate=16000',
          sfl:    1,
          tte:    'UTF8',
          vcn:    voiceName,
          reg:    '0',
          rdn:    '0',
          ent:    'intp65',
          speed:  42,
          pitch:  50,
          volume: 80,
          bgs:    0,
        },
        data: { status: 2, text: textB64 },
      }),
    })
  })
}
