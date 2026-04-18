import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default function Tianjin() {
  return (
    <View className='placeholder'>
      <View className='placeholder__icon-wrap' style={{ background: 'rgba(230,57,40,0.10)' }}>
        <Text className='placeholder__icon'>📍</Text>
      </View>
      <Text className='placeholder__title'>津门风物</Text>
      <Text className='placeholder__desc'>煎饼果子，相声快板。{'\n'}天津文旅模块正在筹备中...</Text>
    </View>
  )
}
