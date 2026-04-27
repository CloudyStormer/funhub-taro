import React from 'react'
import { View, Text } from '@tarojs/components'

const ContactFooter = () => {
  return (
    <View style={{ padding: '2.1vw 5.3vw 10.7vw', textAlign: 'center' }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '3.2vw' }}>
        <View style={{ flex: 1, height: '1px', background: 'rgba(220,200,230,0.5)' }} />
        <Text style={{ fontSize: '13px', margin: '0 2.7vw', opacity: 0.45 }}>✨</Text>
        <View style={{ flex: 1, height: '1px', background: 'rgba(220,200,230,0.5)' }} />
      </View>
      <Text style={{ display: 'block', fontSize: '11px', color: 'rgba(148,120,148,1)' }}>
        Laugh like a child.
      </Text>
      <Text style={{ display: 'block', fontSize: '10px', color: 'rgba(148,120,148,0.6)', marginTop: '1.6vw' }}>
        让每一个孩子都成为小公主 ✨
      </Text>
    </View>
  )
}

export default ContactFooter
