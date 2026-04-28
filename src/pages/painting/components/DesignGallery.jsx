import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'

const CATEGORIES = ['全部', '蝴蝶', '独角兽', '花草', '超级英雄']

const DESIGNS = [
  {
    id: 1, name: '梦幻蝴蝶', category: '蝴蝶',
    tags: ['超人气', '甜美'], price: '¥68', likes: 328,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(244,114,182,0.75)',
  },
  {
    id: 2, name: '星空独角兽', category: '独角兽',
    tags: ['魔法', '闪亮'], price: '¥88', likes: 512,
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(192,132,252,0.75)',
  },
  {
    id: 3, name: '白花仙子', category: '花草',
    tags: ['气质', '清新'], price: '¥78', likes: 241,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(52,211,153,0.75)',
  },
  {
    id: 4, name: '粉色精灵', category: '蝴蝶',
    tags: ['可爱', '粉色'], price: '¥68', likes: 189,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
    gradientFrom: 'rgba(251,146,60,0.75)',
  },
]

const DesignGallery = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [likedIds, setLikedIds] = useState([])

  const filtered = activeCategory === '全部' ? DESIGNS : DESIGNS.filter(d => d.category === activeCategory)

  const toggleLike = (id) => {
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <View style={{ paddingTop: '2.1vw', paddingBottom: '2.1vw' }}>
      {/* 标题栏 */}
      <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 5.3vw', marginBottom: '3.2vw',
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.6vw' }}>
          <Text style={{ fontSize: '17px' }}>✨</Text>
          <Text style={{ fontSize: '17px', fontWeight: '800', color: 'rgba(30,15,40,1)' }}>热门魔法图案</Text>
        </View>
        <Text style={{ fontSize: '12px', color: 'rgba(148,120,148,1)' }}>共 {DESIGNS.length} 款</Text>
      </View>

      {/* 分类 tab */}
      <ScrollView scrollX style={{ whiteSpace: 'nowrap', marginBottom: '4.3vw' }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: '2.1vw', padding: '0 5.3vw 1.1vw' }}>
          {CATEGORIES.map(cat => (
            <View
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0, padding: '1.6vw 3.7vw', borderRadius: '999px',
                fontSize: '12px', fontWeight: '600',
                background: activeCategory === cat ? 'rgba(236,72,153,1)' : 'rgba(248,240,252,1)',
                color: activeCategory === cat ? 'white' : 'rgba(148,120,148,1)',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(236,72,153,0.25)' : 'none',
              }}
            >
              <Text style={{
                color: activeCategory === cat ? 'white' : 'rgba(148,120,148,1)',
                fontSize: '12px', fontWeight: '600',
              }}>{cat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 设计卡片横向滚动 */}
      <ScrollView scrollX style={{ whiteSpace: 'nowrap' }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: '3.7vw', padding: '0 5.3vw 3.2vw' }}>
          {filtered.map(design => {
            const isLiked = likedIds.includes(design.id)
            return (
              <View
                key={design.id}
                style={{
                  flexShrink: 0, width: '52vw', borderRadius: '8vw',
                  overflow: 'hidden', background: 'white',
                  boxShadow: '0 4px 16px rgba(180,100,160,0.1)',
                  border: '1px solid rgba(240,220,240,0.6)',
                }}
              >
                {/* 图片区 */}
                <View style={{ position: 'relative', width: '100%', height: '37.3vw' }}>
                  <Image src={design.image} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                  <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: `linear-gradient(to top, ${design.gradientFrom}, transparent)`,
                    opacity: 0.65,
                  }} />
                  {/* 标签 */}
                  <View style={{
                    position: 'absolute', bottom: '2.7vw', left: '2.7vw',
                    display: 'flex', flexDirection: 'row', gap: '1.1vw',
                  }}>
                    {design.tags.map((tag, idx) => (
                      <View key={idx} style={{
                        padding: '0.5vw 2.1vw', borderRadius: '999px',
                        background: 'rgba(255,255,255,0.22)',
                        border: '1px solid rgba(255,255,255,0.35)',
                      }}>
                        <Text style={{ fontSize: '10px', color: 'white', fontWeight: '600' }}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  {/* 收藏按钮 */}
                  <View
                    onClick={() => toggleLike(design.id)}
                    style={{
                      position: 'absolute', top: '2.7vw', right: '2.7vw',
                      width: '7.5vw', height: '7.5vw', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    <Text style={{ fontSize: '14px' }}>{isLiked ? '❤️' : '🤍'}</Text>
                  </View>
                </View>
                {/* 信息区 */}
                <View style={{ padding: '2.7vw 3.7vw 3.2vw' }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1vw' }}>
                    <Text style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(30,15,40,1)' }}>{design.name}</Text>
                    <Text style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(236,72,153,1)' }}>
                      {/* {design.price} */}
                      开心无价❤️
                    </Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.1vw' }}>
                    <Text style={{ fontSize: '11px' }}>❤️</Text>
                    <Text style={{ fontSize: '11px', color: 'rgba(148,120,148,1)' }}>
                      {/* {design.likes + (likedIds.includes(design.id) ? 1 : 0)} 喜欢 */}
                      好多好多人喜欢
                    </Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default DesignGallery
