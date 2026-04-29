import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'

const CDN = 'https://www.hgshouse.com/resource/painting'

const CATEGORIES = [
  {
    key: 'aisha', label: '艾莎',
    images: ['aisha01.jpg', 'aisha02.jpg'],
  },
  {
    key: 'dujiaoshou', label: '独角兽',
    images: ['dujiaoshou01.jpg', 'dujiaoshou02.jpg'],
  },
  {
    key: 'danzhuang', label: '淡妆',
    images: [
      'danzhuang01.jpg', 'danzhuang02.jpg', 'danzhuang03.jpg', 'danzhuang04.jpg',
      'danzhuang05.jpg', 'danzhuang06.jpg', 'danzhuang07.jpg', 'danzhuang08.jpg',
    ],
  },
  {
    key: 'shouhui', label: '手绘',
    images: ['shouhui01.jpg', 'shouhui02.jpg', 'shouhui03.jpg', 'shouhui04.jpg'],
  },
  {
    key: 'zhoubian', label: '周边',
    images: ['zhoubian01.jpg', 'zhoubian02.jpg', 'zhoubian03.jpg'],
  },
]

const DesignGallery = () => {
  const [activeKey, setActiveKey] = useState('aisha')

  const current = CATEGORIES.find(c => c.key === activeKey)

  return (
    <View style={{ paddingTop: '4.3vw', paddingBottom: '2.1vw' }}>
      {/* 标题 */}
      <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        padding: '0 5.3vw', marginBottom: '3.2vw',
      }}>
        <Text style={{ fontSize: '17px' }}>✨</Text>
        <Text style={{ fontSize: '17px', fontWeight: '800', color: 'rgba(30,15,40,1)', marginLeft: '1.6vw' }}>
          热门魔法图案
        </Text>
      </View>

      {/* 分类 tab */}
      <ScrollView scrollX style={{ whiteSpace: 'nowrap', marginBottom: '4.3vw' }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: '2.1vw', padding: '0 5.3vw 1.1vw' }}>
          {CATEGORIES.map(cat => {
            const isActive = cat.key === activeKey
            return (
              <View
                key={cat.key}
                onClick={() => setActiveKey(cat.key)}
                style={{
                  flexShrink: 0, padding: '1.6vw 4.3vw', borderRadius: '999px',
                  background: isActive ? 'rgba(236,72,153,1)' : 'rgba(248,240,252,1)',
                  boxShadow: isActive ? '0 4px 12px rgba(236,72,153,0.25)' : 'none',
                }}
              >
                <Text style={{
                  fontSize: '13px', fontWeight: '600',
                  color: isActive ? 'white' : 'rgba(148,120,148,1)',
                }}>{cat.label}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* 当前分类图片横向滚动 */}
      <ScrollView scrollX style={{ whiteSpace: 'nowrap' }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: '3.2vw', padding: '0 5.3vw 3.2vw' }}>
          {current.images.map((img, idx) => (
            <View
              key={idx}
              style={{
                flexShrink: 0, width: '48vw', borderRadius: '5.3vw',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(180,100,160,0.12)',
                border: '1px solid rgba(240,220,240,0.6)',
              }}
            >
              <Image
                src={`${CDN}/${img}`}
                mode='widthFix'
                style={{ width: '100%', display: 'block' }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignGallery
