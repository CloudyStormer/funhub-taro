import Taro from '@tarojs/taro'
import { isVoiceQuotaError, showVoiceQuotaToast } from '../../../utils/voiceError'

const TTS_URL = 'https://api.hgshouse.com/aimebridge/tts'

let audioContext = null

export const stopSpeaking = () => {
  if (audioContext) {
    try {
      audioContext.stop()
      audioContext.destroy()
    } catch (_) {}
    audioContext = null
  }
}

const cleanText = (text = '') =>
  text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const playBuffer = (arrayBuffer, opts = {}) => {
  const tempPath = `${wx.env.USER_DATA_PATH}/aime_tts_${Date.now()}.mp3`

  Taro.getFileSystemManager().writeFile({
    filePath: tempPath,
    data: arrayBuffer,
    fail: (err) => {
      console.error('[Aime TTS] write file failed:', err.errMsg)
      opts.onPlay?.()
    },
    success: () => {
      try {
        Taro.setInnerAudioOption({ obeyMuteSwitch: false })
      } catch (_) {}

      audioContext = Taro.createInnerAudioContext()
      audioContext.obeyMuteSwitch = false
      audioContext.playbackRate = 1.08
      audioContext.src = tempPath

      audioContext.onCanplay(() => {
        try {
          audioContext.play()
        } catch (err) {
          console.error('[Aime TTS] play failed:', err)
          opts.onPlay?.()
        }
      })
      audioContext.onPlay(() => opts.onPlay?.())
      audioContext.onError((err) => {
        console.error('[Aime TTS] audio error:', err.errCode, err.errMsg)
        opts.onPlay?.()
      })
      audioContext.onEnded(() => {
        try {
          audioContext.destroy()
        } catch (_) {}
        audioContext = null
      })
    },
  })
}

const decodeArrayBuffer = (arrayBuffer) => {
  if (!arrayBuffer) return ''
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode.apply(null, bytes.slice(i, i + 8192))
  }
  try {
    return decodeURIComponent(escape(binary))
  } catch (_) {
    return binary
  }
}

const isProbablyTextError = (arrayBuffer) => {
  const text = decodeArrayBuffer(arrayBuffer).trim()
  if (!text) return false
  return text.startsWith('{') || text.startsWith('<') || /error|quota|额度|余额|不足|欠费/i.test(text)
}

const handleTtsUnavailable = (error, opts = {}) => {
  if (isVoiceQuotaError(error)) {
    showVoiceQuotaToast(Taro)
    opts.onUnavailable?.(error)
  }
  opts.onPlay?.()
}

export const speakText = (text, opts = {}) => {
  const finalText = cleanText(text)
  if (!finalText) {
    opts.onPlay?.()
    return
  }

  stopSpeaking()

  Taro.request({
    url: TTS_URL,
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    responseType: 'arraybuffer',
    timeout: 25000,
    data: { text: finalText, scene: opts.scene || 'default' },
    success: (res) => {
      if (res.statusCode === 200 && res.data && !isProbablyTextError(res.data)) {
        playBuffer(res.data, opts)
      } else {
        const bodyText = decodeArrayBuffer(res.data)
        const error = new Error(bodyText || `TTS HTTP ${res.statusCode}`)
        console.error('[Aime TTS] api status:', res.statusCode, bodyText)
        handleTtsUnavailable(error, opts)
      }
    },
    fail: (err) => {
      console.error('[Aime TTS] request failed:', err.errMsg)
      handleTtsUnavailable(err, opts)
    },
  })
}
