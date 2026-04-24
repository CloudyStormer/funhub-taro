import React, { useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop',
    tag: '✨ 超人气',
    title: '梦幻蝴蝶',
    subtitle: '为小公主画上奇幻彩妆',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=900&auto=format&fit=crop',
    tag: '🔮 魔法',
    title: '星空独角兽',
    subtitle: '点亮洒满每一刻',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=900&auto=format&fit=crop',
    tag: '🌿 清新',
    title: '白花仙子',
    subtitle: '环保水性，安心彩绘',
  },
]

const HeroSection = ({ onBooking }) => {
  const [current, setCurrent] = useState(0)

  return (
    <View style={{ position: 'relative', width: '100%', height: '90vw', overflow: 'hidden' }}>
      {/* Top header — 覆盖在 Swiper 上方 */}
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '5.3vw 5.3vw 0',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', zIndex: 20,
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.6vw' }}>
          <View style={{
            width: '7.5vw', height: '7.5vw', borderRadius: '3.2vw',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <Text style={{ fontSize: '14px' }}>✨</Text>
          </View>
          <Text style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', letterSpacing: '0.05em' }}>魔法脸绘</Text>
        </View>
        <View style={{
          padding: '1.1vw 3.2vw', borderRadius: '999px',
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <Text style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>已服务 5000+ 家庭</Text>
        </View>
      </View>

      <Swiper
        autoplay
        interval={3200}
        circular
        onChange={(e) => setCurrent(e.detail.current)}
        style={{ width: '100%', height: '90vw' }}
      >
        {slides.map(s => (
          <SwiperItem key={s.id}>
            <View style={{ position: 'relative', width: '100%', height: '90vw' }}>
              <Image src={s.image} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
              {/* 渐变遮罩 */}
              <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(30,0,30,0.75) 0%, rgba(80,0,60,0.18) 50%, transparent 100%)',
              }} />
              {/* 文字内容 */}
              <View style={{ position: 'absolute', bottom: '7.5vw', left: '5.3vw', right: '5.3vw' }}>
                <Text style={{
                  display: 'inline-block', fontSize: '11px', fontWeight: 'bold', color: 'white',
                  background: 'rgba(236,72,153,0.55)', padding: '2px 10px', borderRadius: '999px',
                  marginBottom: '8px',
                }}>{s.tag}</Text>
                <Text style={{
                  display: 'block', fontSize: '28px', fontWeight: '800',
                  color: 'white', marginBottom: '4px',
                }}>{s.title}</Text>
                <Text style={{ display: 'block', fontSize: '13px', color: 'rgba(255,230,245,0.9)', marginBottom: '4.3vw' }}>
                  {s.subtitle}
                </Text>
                <View
                  onClick={onBooking}
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: 'rgba(236,72,153,1)',
                    padding: '2.7vw 6.4vw', borderRadius: '999px',
                    boxShadow: '0 6px 20px rgba(236,72,153,0.35)',
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>立即预约彩绘 ✨</Text>
                </View>
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      {/* 自定义指示点 */}
      <View style={{
        position: 'absolute', bottom: '3.2vw', left: 0, right: 0,
        display: 'flex', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', gap: '1.6vw', zIndex: 20,
      }}>
        {slides.map((_, i) => (
          <View key={i} style={{
            height: '1.6vw', borderRadius: '999px',
            width: i === current ? '5.3vw' : '1.6vw',
            background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
          }} />
        ))}
      </View>
    </View>
  )
}

export default HeroSection
