import React, { useState } from 'react'
import { View, Text, Input, Picker } from '@tarojs/components'

const DESIGN_OPTIONS = ['梦幻蝴蝶', '星空独角兽', '白花仙子', '粉色精灵', '到店沟通']

const BookingForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [designIdx, setDesignIdx] = useState(0)

  const handleSubmit = () => {
    if (!name || !phone || !date) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName(''); setPhone(''); setDate(''); setDesignIdx(0)
    }, 3000)
  }

  const inputStyle = {
    width: '100%', background: 'rgba(248,240,252,1)',
    border: '1px solid rgba(220,200,232,1)',
    borderRadius: '3.7vw', padding: '2.7vw 3.7vw',
    fontSize: '14px', color: 'rgba(30,15,40,1)',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: '600',
    color: 'rgba(148,120,148,1)', marginBottom: '1.6vw',
  }

  return (
    <View style={{ padding: '0 4.3vw 4.3vw' }} id='booking-section'>
      <View style={{
        background: 'white', borderRadius: '6.4vw', padding: '5.3vw',
        border: '1px solid rgba(240,220,240,0.8)',
        boxShadow: '0 4px 20px rgba(180,100,160,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* 装饰光晕 */}
        <View style={{
          position: 'absolute', top: '-8vw', right: '-8vw', width: '32vw', height: '32vw',
          borderRadius: '50%', background: 'rgba(253,230,138,0.18)',
        }} />
        <View style={{
          position: 'absolute', bottom: '-8vw', left: '-8vw', width: '28vw', height: '28vw',
          borderRadius: '50%', background: 'rgba(192,132,252,0.08)',
        }} />

        {/* 标题 */}
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3.2vw', marginBottom: '5.3vw', position: 'relative' }}>
          <View style={{
            width: '11.7vw', height: '11.7vw', borderRadius: '3.7vw',
            background: 'rgba(252,231,243,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: '5.9vw' }}>📅</Text>
          </View>
          <View>
            <Text style={{ display: 'block', fontSize: '17px', fontWeight: '800', color: 'rgba(30,15,40,1)' }}>在线预约</Text>
            <Text style={{ display: 'block', fontSize: '12px', color: 'rgba(148,120,148,1)', marginTop: '1.1vw' }}>
              提前预约，为宝宝保留专属时间
            </Text>
          </View>
        </View>

        {submitted ? (
          /* 提交成功 */
          <View style={{
            padding: '10.7vw 0', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <View style={{
              width: '17.1vw', height: '17.1vw', borderRadius: '50%',
              background: 'rgba(209,250,229,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '4.3vw',
            }}>
              <Text style={{ fontSize: '9.6vw' }}>✅</Text>
            </View>
            <Text style={{ fontSize: '17px', fontWeight: '800', color: 'rgba(30,15,40,1)' }}>预约提交成功！</Text>
            <Text style={{ display: 'block', fontSize: '13px', color: 'rgba(148,120,148,1)', marginTop: '2.1vw', textAlign: 'center' }}>
              我们会尽快联系您确认细节{'\n'}期待与小公主的见面 ✨
            </Text>
          </View>
        ) : (
          /* 表单 */
          <View style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '3.7vw' }}>
            <View>
              <Text style={labelStyle}>宝贝昵称</Text>
              <Input
                type='text' placeholder='例如：小果果'
                placeholderStyle='color: rgba(180,150,180,1)'
                value={name} onInput={(e) => setName(e.detail.value)}
                style={inputStyle}
              />
            </View>
            <View>
              <Text style={labelStyle}>联系电话</Text>
              <Input
                type='number' placeholder='您的手机号码'
                placeholderStyle='color: rgba(180,150,180,1)'
                value={phone} onInput={(e) => setPhone(e.detail.value)}
                style={inputStyle}
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: '3.2vw' }}>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>预约日期</Text>
                <Picker
                  mode='date'
                  value={date || '2025-01-01'}
                  onChange={(e) => setDate(e.detail.value)}
                >
                  <View style={{ ...inputStyle, color: date ? 'rgba(30,15,40,1)' : 'rgba(180,150,180,1)' }}>
                    <Text style={{ fontSize: '14px', color: date ? 'rgba(30,15,40,1)' : 'rgba(180,150,180,1)' }}>
                      {date || '选择日期'}
                    </Text>
                  </View>
                </Picker>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>心仪图案</Text>
                <Picker
                  mode='selector'
                  range={DESIGN_OPTIONS}
                  value={designIdx}
                  onChange={(e) => setDesignIdx(e.detail.value)}
                >
                  <View style={inputStyle}>
                    <Text style={{ fontSize: '14px', color: 'rgba(30,15,40,1)' }}>
                      {DESIGN_OPTIONS[designIdx]}
                    </Text>
                  </View>
                </Picker>
              </View>
            </View>
            <View
              onClick={handleSubmit}
              style={{
                marginTop: '1.1vw', padding: '3.7vw', borderRadius: '3.7vw',
                background: 'linear-gradient(135deg, rgba(236,72,153,1), rgba(192,132,252,1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(236,72,153,0.28)',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>提交预约 ✨</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default BookingForm
