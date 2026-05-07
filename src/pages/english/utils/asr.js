/**
 * 百度语音识别 (一句话识别)
 * 申请地址: https://console.bce.baidu.com/ai/#/ai/speech/app/list
 * 需要在微信后台 request 合法域名中添加:
 *   - https://aip.baidubce.com
 *   - https://vop.baidu.com
 */
import Taro from '@tarojs/taro'

const BAIDU_API_KEY    = 'kcUIVjDL5APTizsTXS1zV9gG'
const BAIDU_SECRET_KEY = 'hFtFtjKNOE3tv5nPbcr32m2iwKYXzEL0'

let _token = null
let _tokenExpiry = 0

/** 获取 access_token（带本地缓存） */
const getToken = () =>
  new Promise((resolve, reject) => {
    if (_token && Date.now() < _tokenExpiry) return resolve(_token)
    Taro.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
      success: (res) => {
        if (res.data?.access_token) {
          _token = res.data.access_token
          _tokenExpiry = Date.now() + (res.data.expires_in - 300) * 1000
          resolve(_token)
        } else {
          reject(new Error('Token失败:' + JSON.stringify(res.data)))
        }
      },
      fail: (err) => reject(new Error('Token网络错误:' + err.errMsg)),
    })
  })

/**
 * 将录音文件转为文字
 * @param {string} filePath  RecorderManager onStop 返回的 tempFilePath
 * @returns {Promise<string>} 识别出的文字
 */
export const transcribeAudio = async (filePath) => {
  // 1. 读取文件为 ArrayBuffer
  const fileData = await new Promise((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      filePath,
      success: (res) => resolve(res.data),
      fail: (err) => reject(new Error('读取文件失败:' + err.errMsg)),
    })
  })

  // 2. base64 编码
  const base64Audio = Taro.arrayBufferToBase64(fileData)

  // 3. 获取 token
  const token = await getToken()

  // 4. 调用识别接口
  const result = await new Promise((resolve, reject) => {
    Taro.request({
      url: 'https://vop.baidu.com/server_api',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        format: 'pcm',
        rate: 16000,
        channel: 1,
        cuid: 'funhub-taro-client',
        token,
        len: fileData.byteLength,
        speech: base64Audio,
        dev_pid: 1737,   // 1737=英语
      },
      success: (res) => {
        if (res.data?.err_no === 0) {
          resolve(res.data.result[0] ?? '')
        } else {
          reject(new Error(`ASR错误${res.data?.err_no}:${res.data?.err_msg}`))
        }
      },
      fail: (err) => reject(new Error('ASR网络错误:' + err.errMsg)),
    })
  })

  return result
}
