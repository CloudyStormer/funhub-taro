/**
 * 百度语音识别 (一句话识别)
 * 申请地址: https://console.bce.baidu.com/ai/#/ai/speech/app/list
 * 需要在微信后台 request 合法域名中添加:
 *   - https://aip.baidubce.com
 *   - https://vop.baidu.com
 */
import Taro from '@tarojs/taro'

const BAIDU_API_KEY    = 'YOUR_API_KEY'     // ← 填入你的 API Key
const BAIDU_SECRET_KEY = 'YOUR_SECRET_KEY'  // ← 填入你的 Secret Key

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
          reject(new Error('百度 Token 获取失败'))
        }
      },
      fail: reject,
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
      fail: reject,
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
        format: 'amr',   // RecorderManager 使用 amr 格式
        rate: 8000,
        channel: 1,
        token,
        len: fileData.byteLength,
        speech: base64Audio,
        dev_pid: 1537,   // 1537=普通话, 1737=英语
      },
      success: (res) => {
        if (res.data?.err_no === 0) {
          resolve(res.data.result[0] ?? '')
        } else {
          reject(new Error(res.data?.err_msg ?? '语音识别失败'))
        }
      },
      fail: reject,
    })
  })

  return result
}
