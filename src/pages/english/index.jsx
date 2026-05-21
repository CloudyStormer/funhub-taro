import React from 'react'
import { useDidHide, useUnload } from '@tarojs/taro'
import Frame from './pages/Frame'
import { stopSpeaking } from './utils/tts'

export default function English() {
  useDidHide(stopSpeaking)
  useUnload(stopSpeaking)

  return <Frame />
}
