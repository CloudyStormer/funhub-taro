import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Fitness() {
  return (
    <View className='placeholder'>
      <View className='placeholder__icon-wrap' style={{ background: 'rgba(210,156,56,0.12)' }}>
        <Text className='placeholder__icon'>💪</Text>
      </View>
      <Text className='placeholder__title'>修身健体</Text>
      <Text className='placeholder__desc'>动静相宜，调理气息。{'\n'}健身模块正在筹备中...</Text>
    </View>
  )
}
