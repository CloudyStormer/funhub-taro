import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import ModuleCard from '../../components/ModuleCard'
import './index.scss'

export default function Home() {
  return (
    <View className='home'>
      {/* 背景光晕 */}
      <View className='home__glow home__glow--1' />
      <View className='home__glow home__glow--2' />
      <View className='home__glow home__glow--3' />

      {/* 主体内容 */}
      <View className='home__scroll'>

        {/* 头部 */}
        <View className='home__header'>
          <View className='home__header-glow' />
          <Image
            className='home__logo logo-drop-bounce'
            src='/assets/logo.png'
            mode='widthFix'
          />
          <Text className='home__tagline'>探索生活里的七十二变</Text>
        </View>

        {/* 卡片区 */}
        <View className='home__grid'>
          {/* 职场英语 — 全宽 */}
          <ModuleCard
            title='职场英语'
            subtitle='看世界 🥨'
            emoji='📖'
            url='/pages/english/index'
            bgColor='rgba(0,194,184,0.1)'
            iconBgColor='rgba(79,161,152,1)'
            decorationEmoji='🎡'
            glowVariant='teal'
            isFeatured
          />

          {/* 第二行：糖果彩绘 + 右侧双卡 */}
          <View className='home__grid-row'>
            <ModuleCard
              title='糖果彩绘'
              subtitle='色彩与甜蜜'
              emoji='🎨'
              url='/pages/painting/index'
              bgColor='rgba(255,220,225,0.4)'
              iconBgColor='rgba(240,110,130,1)'
              decorationEmoji='🍬'
              glowVariant='pink'
              isFeatured
            />
            <View className='home__grid-col'>
              <ModuleCard
                title='修身健体'
                subtitle='元气满满'
                emoji='💪'
                url='/pages/fitness/index'
                bgColor='rgba(210,156,56,0.15)'
                iconBgColor='rgba(210,156,56,1)'
                isUnderConstruction
              />
              <ModuleCard
                title='津门风物'
                subtitle='美食文旅'
                emoji='📍'
                url='/pages/tianjin/index'
                bgColor='rgba(230,57,40,0.1)'
                iconBgColor='rgba(230,57,40,1)'
                isUnderConstruction
              />
            </View>
          </View>
        </View>

        {/* 底部标语 */}
        <View className='home__footer'>
          <View className='home__footer-pill'>
            <Text className='home__footer-text'>🐒 翻个筋斗云，发现新乐趣</Text>
          </View>
        </View>

      </View>
    </View>
  )
}
