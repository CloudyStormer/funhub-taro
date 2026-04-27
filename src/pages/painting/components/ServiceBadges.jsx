import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'

const badges = [
  { emoji: '🛡️', label: '安全无毒', sub: '放心游玩', color: 'rgba(52,211,153,1)', bg: 'rgba(209,250,229,0.6)' },
  { emoji: '💧', label: '水性颜料', sub: '轻松卸妆', color: 'rgba(96,165,250,1)', bg: 'rgba(219,234,254,0.6)' },
  { emoji: '⏰', label: '持久4-6h', sub: '全天不花妆', color: 'rgba(251,146,60,1)', bg: 'rgba(255,237,213,0.6)' },
  { emoji: '🏆', label: '专业画师', sub: '10年经验', color: 'rgba(236,72,153,1)', bg: 'rgba(252,231,243,0.6)' },
]

const ServiceBadges = () => {
  return (
    <View style={{ padding: '4.3vw 4.3vw 4.3vw' }}>
      <ScrollView scrollX style={{ whiteSpace: 'nowrap' }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: '2.7vw', paddingBottom: '1.1vw' }}>
          {badges.map((b, i) => (
            <View
              key={i}
              style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '1.6vw',
                padding: '3.2vw 3.2vw 2.7vw',
                borderRadius: '5.3vw', minWidth: '20.8vw',
                background: b.bg,
                border: '1px solid rgba(255,255,255,0.8)',
              }}
            >
              <View style={{
                width: '9.6vw', height: '9.6vw', borderRadius: '3.2vw',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.7)',
              }}>
                <Text style={{ fontSize: '4.8vw' }}>{b.emoji}</Text>
              </View>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(30,20,40,1)' }}>{b.label}</Text>
              <Text style={{ fontSize: '10px', color: 'rgba(130,100,130,1)' }}>{b.sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default ServiceBadges
