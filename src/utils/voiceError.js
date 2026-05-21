const QUOTA_PATTERNS = [
  '额度',
  '余额',
  '欠费',
  '不足',
  '用量',
  '调用量',
  '次数',
  '上限',
  '超限',
  '有效期',
  'quota',
  'insufficient',
  'balance',
  'limit exceeded',
  'exceed',
  'overrun',
]

let lastQuotaToastAt = 0

export const isVoiceQuotaError = (error) => {
  const raw = [
    error?.message,
    error?.errMsg,
    error?.reason,
    error?.data,
    typeof error === 'string' ? error : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return QUOTA_PATTERNS.some((pattern) => raw.includes(pattern.toLowerCase()))
}

export const voiceQuotaMessage = '语音服务额度不足，建议先用文字对话'

export const showVoiceQuotaToast = (Taro) => {
  const now = Date.now()
  if (now - lastQuotaToastAt < 2500) return
  lastQuotaToastAt = now
  Taro.showToast({ title: voiceQuotaMessage, icon: 'none', duration: 2000 })
}

export const toVoiceErrorMessage = (error, fallback = '语音服务暂时不可用，建议先用文字对话') => {
  if (isVoiceQuotaError(error)) return voiceQuotaMessage
  return error?.message || error?.errMsg || fallback
}
