import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const ModuleCard = ({
  title = '模块名称',
  subtitle = '副标题',
  emoji = '✨',
  url = '',
  bgColor = 'rgba(255,255,255,0.85)',
  iconBgColor = 'rgba(79,161,152,1)',
  decorationEmoji = '',
  glowVariant = 'teal',
  isFeatured = false,
  isUnderConstruction = false,
}) => {
  const handleTap = () => {
    if (!isUnderConstruction && url) {
      Taro.navigateTo({ url })
    }
  }

  if (isUnderConstruction) {
    return (
      <View className='module-card module-card--construction'>
        <View className='module-card__icon-wrap' style={{ background: iconBgColor }}>
          <Text className='module-card__icon'>{emoji}</Text>
        </View>
        <View className='module-card__body'>
          <Text className='module-card__title'>{title}</Text>
          <Text className='module-card__subtitle'>{subtitle}</Text>
        </View>
        <View className='module-card__overlay'>
          <Text className='module-card__overlay-icon'>🏗️</Text>
          <Text className='module-card__overlay-text'>建造中</Text>
        </View>
      </View>
    )
  }

  if (isFeatured) {
    return (
      <View
        className={`module-card module-card--featured module-card--glow-${glowVariant}`}
        style={{ background: bgColor, borderColor: iconBgColor }}
        onClick={handleTap}
      >
        <View className='module-card__badge' style={{ background: iconBgColor }}>
          <View className='module-card__badge-dot' />
          <Text className='module-card__badge-text'>已开张</Text>
        </View>
        {decorationEmoji !== '' && (
          <Text className='module-card__deco'>{decorationEmoji}</Text>
        )}
        <View className='module-card__icon-wrap module-card__icon-wrap--featured' style={{ background: iconBgColor }}>
          <Text className='module-card__icon'>{emoji}</Text>
        </View>
        <View className='module-card__body'>
          <Text className='module-card__title'>{title}</Text>
          <Text className='module-card__subtitle'>{subtitle}</Text>
        </View>
      </View>
    )
  }

  return (
    <View
      className='module-card'
      style={{ background: bgColor }}
      onClick={handleTap}
    >
      {decorationEmoji !== '' && (
        <Text className='module-card__deco'>{decorationEmoji}</Text>
      )}
      <View className='module-card__icon-wrap' style={{ background: iconBgColor }}>
        <Text className='module-card__icon'>{emoji}</Text>
      </View>
      <View className='module-card__body'>
        <Text className='module-card__title'>{title}</Text>
        <Text className='module-card__subtitle'>{subtitle}</Text>
      </View>
    </View>
  )
}

export default ModuleCard
