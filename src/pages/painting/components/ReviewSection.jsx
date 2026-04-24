import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'

const REVIEWS = [
  {
    id: 1,
    name: '小枫子妈妈',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100&auto=format&fit=crop',
    stars: 5,
    text: '宝贝画完超级开心！蝴蝶图案太精致了，颜色很鲜艳，玩了一下午都没掉色，强烈推荐！',
    design: '梦幻蝴蝶',
  },
  {
    id: 2,
    name: '萝卜爸爸比',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    stars: 5,
    text: '第一次带女儿来体验，完全超出预期！画师很有耐心，孩子全程配合，独角兽真的太美了。',
    design: '星空独角兽',
  },
  {
    id: 3,
    name: 'Coco小公主',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    stars: 5,
    text: '已经来了三次了！每次图案都不一样，女儿最喜欢白花仙子，下次要试试蝴蝶款！',
    design: '白花仙子',
  },
]

const ReviewSection = () => {
  return (
    <View style={{ paddingTop: '4.3vw', paddingBottom: '4.3vw' }}>
      {/* 标题 */}
      <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 5.3vw', marginBottom: '3.2vw',
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.6vw' }}>
          <Text style={{ fontSize: '17px' }}>⭐</Text>
          <Text style={{ fontSize: '17px', fontWeight: '800', color: 'rgba(30,15,40,1)' }}>真实用户评价</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.1vw' }}>
          <Text style={{ fontSize: '12px' }}>⭐</Text>
          <Text style={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(30,15,40,1)' }}>4.9</Text>
          <Text style={{ fontSize: '11px', color: 'rgba(148,120,148,1)' }}>/ 5.0</Text>
        </View>
      </View>

      {/* 评论卡片横向滚动 */}
      <ScrollView scrollX style={{ whiteSpace: 'nowrap' }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: '3.2vw', padding: '0 5.3vw 3.2vw' }}>
          {REVIEWS.map(r => (
            <View
              key={r.id}
              style={{
                flexShrink: 0, width: '64vw', borderRadius: '5.3vw',
                padding: '4.3vw', background: 'white',
                boxShadow: '0 4px 16px rgba(180,100,160,0.08)',
                border: '1px solid rgba(240,220,240,0.6)',
              }}
            >
              <Text style={{ fontSize: '18px', opacity: 0.35 }}>❝</Text>
              <Text style={{
                display: 'block', fontSize: '12.5px', color: 'rgba(30,15,40,0.85)',
                lineHeight: '1.6', marginBottom: '3.2vw', marginTop: '2.1vw',
              }} numberOfLines={3}>{r.text}</Text>
              {/* 星星 */}
              <View style={{ display: 'flex', flexDirection: 'row', gap: '1.1vw', marginBottom: '3.2vw' }}>
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Text key={i} style={{ fontSize: '11px' }}>⭐</Text>
                ))}
              </View>
              {/* 用户信息 */}
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2.7vw' }}>
                <Image
                  src={r.avatar} mode='aspectFill'
                  style={{ width: '8.5vw', height: '8.5vw', borderRadius: '50%' }}
                />
                <View>
                  <Text style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(30,15,40,1)' }}>{r.name}</Text>
                  <Text style={{ display: 'block', fontSize: '10px', color: 'rgba(148,120,148,1)', marginTop: '0.5vw' }}>
                    体验了 · {r.design}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default ReviewSection
