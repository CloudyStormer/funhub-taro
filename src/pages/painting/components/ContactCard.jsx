import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

const ContactCard = () => {
  const makeCall = () => {
    Taro.makePhoneCall({ phoneNumber: '13800008888' })
  }

  return (
    <View style={{ padding: '0 4.3vw 4.3vw' }}>
      <View style={{
        background: 'white', borderRadius: '6.4vw', padding: '5.3vw',
        border: '1px solid rgba(240,220,240,0.8)',
        boxShadow: '0 4px 20px rgba(180,100,160,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* 装饰光晕 */}
        <View style={{
          position: 'absolute', top: '-8vw', right: '-8vw', width: '32vw', height: '32vw',
          borderRadius: '50%', background: 'rgba(253,230,138,0.2)',
        }} />
        <View style={{
          position: 'absolute', bottom: '-8vw', left: '-8vw', width: '28vw', height: '28vw',
          borderRadius: '50%', background: 'rgba(192,132,252,0.1)',
        }} />

        {/* 标题 */}
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2.1vw', marginBottom: '4.3vw', position: 'relative' }}>
          <View style={{
            width: '11.7vw', height: '11.7vw', borderRadius: '3.7vw',
            background: 'rgba(252,231,243,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: '5.9vw' }}>✨</Text>
          </View>
          <View>
            <Text style={{ display: 'block', fontSize: '17px', fontWeight: '800', color: 'rgba(30,15,40,1)' }}>联系我们</Text>
            <Text style={{ display: 'block', fontSize: '12px', color: 'rgba(148,120,148,1)', marginTop: '1.1vw' }}>
              随时为小公主预约魔法彩绘
            </Text>
          </View>
        </View>

        {/* 联系方式列表 */}
        <View style={{ display: 'flex', flexDirection: 'column', gap: '2.7vw', position: 'relative' }}>
          {/* 电话 */}
          <View
            onClick={makeCall}
            style={{
              display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3.2vw',
              padding: '3.7vw', borderRadius: '4.3vw',
              border: '1px solid rgba(252,210,232,1)',
              background: 'rgba(255,240,248,0.7)',
            }}
          >
            <View style={{
              width: '10.7vw', height: '10.7vw', borderRadius: '3.2vw', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(236,72,153,1), rgba(251,113,133,1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
            }}>
              <Text style={{ fontSize: '17px' }}>📞</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ display: 'block', fontSize: '10px', color: 'rgba(148,120,148,1)', marginBottom: '0.8vw' }}>预约电话</Text>
              <Text style={{ fontSize: '15px', fontWeight: '800', color: 'rgba(30,15,40,1)', letterSpacing: '0.05em' }}>
                138-0000-8888
              </Text>
            </View>
            <Text style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(236,72,153,1)', flexShrink: 0 }}>立即拨打</Text>
          </View>

          {/* 微信 */}
          <View style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3.2vw',
            padding: '3.7vw', borderRadius: '4.3vw',
            border: '1px solid rgba(220,200,252,1)',
            background: 'rgba(248,240,255,0.7)',
          }}>
            <View style={{
              width: '10.7vw', height: '10.7vw', borderRadius: '3.2vw', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(192,132,252,1), rgba(167,139,250,1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(192,132,252,0.3)',
            }}>
              <Text style={{ fontSize: '17px' }}>💬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ display: 'block', fontSize: '10px', color: 'rgba(148,120,148,1)', marginBottom: '0.8vw' }}>微信号</Text>
              <Text style={{ fontSize: '15px', fontWeight: '800', color: 'rgba(30,15,40,1)' }}>MagicPaint_Kids</Text>
            </View>
            <Text style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(192,132,252,1)', flexShrink: 0 }}>扫码添加</Text>
          </View>

          {/* 地址 */}
          <View style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3.2vw',
            padding: '3.7vw', borderRadius: '4.3vw',
            border: '1px solid rgba(200,230,255,1)',
            background: 'rgba(235,245,255,0.7)',
          }}>
            <View style={{
              width: '10.7vw', height: '10.7vw', borderRadius: '3.2vw', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(96,165,250,1), rgba(59,130,246,1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(96,165,250,0.3)',
            }}>
              <Text style={{ fontSize: '17px' }}>📍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ display: 'block', fontSize: '10px', color: 'rgba(148,120,148,1)', marginBottom: '0.8vw' }}>门店地址</Text>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(30,15,40,1)' }}>魔法城校贸物中心 2F</Text>
            </View>
          </View>
        </View>

        {/* 营业时间 */}
        <View style={{
          marginTop: '4.3vw', display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center', gap: '1.6vw', position: 'relative',
        }}>
          <Text style={{ fontSize: '12px' }}>🕙</Text>
          <Text style={{ fontSize: '11px', color: 'rgba(148,120,148,1)' }}>营业时间：每天 10:00 - 20:00</Text>
        </View>
      </View>
    </View>
  )
}

export default ContactCard
