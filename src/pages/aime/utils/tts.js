import Taro from '@tarojs/taro'

const TTS_URL = 'https://www.hgshouse.com/aimebridge/tts'

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
    data: { text: finalText },
    success: (res) => {
      if (res.statusCode === 200 && res.data) {
        playBuffer(res.data, opts)
      } else {
        console.error('[Aime TTS] api status:', res.statusCode)
        opts.onPlay?.()
      }
    },
    fail: (err) => {
      console.error('[Aime TTS] request failed:', err.errMsg)
      opts.onPlay?.()
    },
  })
}
