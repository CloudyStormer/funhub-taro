/**
 * TTS — 调用后端 /tts 接口，由后端连接讯飞合成 MP3 后返回
 * 小程序只需发 HTTP 请求，无需 socket 白名单
 */
import Taro from '@tarojs/taro'

const TTS_URL = 'https://www.hgshouse.com/api/tts'

// 当前播放的 InnerAudioContext
let _ctx = null

/** 停止当前正在播放的语音 */
export const stopSpeaking = () => {
  if (_ctx) {
    try { _ctx.stop(); _ctx.destroy() } catch (_) {}
    _ctx = null
  }
}

const cleanText = (text = '') =>
  text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const playBuffer = (arrayBuffer) => {
  const tempPath = `${wx.env.USER_DATA_PATH}/tts_${Date.now()}.mp3`
  Taro.getFileSystemManager().writeFile({
    filePath: tempPath,
    data: arrayBuffer,
    fail: (e) => console.error('[TTS] 写文件失败:', e.errMsg),
    success: () => {
      try {
        Taro.setInnerAudioOption({ obeyMuteSwitch: false })
      } catch (_) {}

      _ctx = Taro.createInnerAudioContext()
      _ctx.obeyMuteSwitch = false
      _ctx.src = tempPath

      _ctx.onCanplay(() => {
        try { _ctx.play() } catch (e) {
          console.error('[TTS] play 失败:', e)
        }
      })
      _ctx.onPlay(() => console.log('[TTS] 开始播放'))
      _ctx.onError((e) => console.error('[TTS] 播放失败 errCode:', e.errCode, e.errMsg))
      _ctx.onEnded(() => {
        try { _ctx.destroy() } catch (_) {}
        _ctx = null
      })
    },
  })
}

/**
 * 合成并播放文字（fire-and-forget）
 * @param {string} text  要朗读的文字
 */
export const speakText = (text) => {
  const finalText = cleanText(text)
  if (!finalText) return
  stopSpeaking()

  console.log('[TTS] 请求合成:', finalText.slice(0, 40) + '...')

  Taro.request({
    url: TTS_URL,
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    responseType: 'arraybuffer',
    data: { text: finalText },
    success: (res) => {
      if (res.statusCode === 200 && res.data) {
        console.log('[TTS] 收到音频，大小:', res.data.byteLength, 'bytes')
        playBuffer(res.data)
      } else {
        console.error('[TTS] 接口返回异常:', res.statusCode)
        Taro.showToast({ title: '语音播报失败', icon: 'none', duration: 1500 })
      }
    },
    fail: (e) => {
      console.error('[TTS] 请求失败:', e.errMsg)
      Taro.showToast({ title: '语音播报失败', icon: 'none', duration: 1500 })
    },
  })
}
