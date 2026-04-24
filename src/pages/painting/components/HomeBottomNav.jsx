import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

const TABS = [
  { key: 'home',    label: '首页',  emoji: '🏠' },
  { key: 'gallery', label: '图案',  emoji: '🎨' },
  { key: 'booking', label: '预约',  emoji: '📅' },
  { key: 'profile', label: '我的',  emoji: '👤' },
]

const HomeBottomNav = ({ activeTab = 'home', onTabChange = () => {} }) => {
  const handleTab = (tab) => {
    onTabChange(tab)
    if (tab === 'booking') {
      Taro.pageScrollTo({ selector: '#booking-section', duration: 300 })
    }
    if (tab === 'gallery') {
      Taro.pageScrollTo({ scrollTop: 320, duration: 300 })
    }
  }

  return (
    <View style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: '68px',
      background: 'rgba(255,255,255,0.95)',
      borderTop: '1px solid rgba(240,220,240,0.8)',
      boxShadow: '0 -4px 24px rgba(236,72,153,0.06)',
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      padding: '0 2.1vw', zIndex: 100,
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.key
        return (
          <View
            key={tab.key}
            onClick={() => handleTab(tab.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '1.1vw',
              padding: '1.6vw 0',
            }}
          >
            <Text style={{ fontSize: isActive ? '22px' : '20px' }}>{tab.emoji}</Text>
            <Text style={{
              fontSize: '10px', fontWeight: '600',
              color: isActive ? 'rgba(236,72,153,1)' : 'rgba(148,120,148,1)',
            }}>{tab.label}</Text>
            {isActive && (
              <View style={{
                position: 'absolute', bottom: '6px',
                width: '16px', height: '3px', borderRadius: '999px',
                background: 'rgba(236,72,153,1)',
              }} />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default HomeBottomNav
