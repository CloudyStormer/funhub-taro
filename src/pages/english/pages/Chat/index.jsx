import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import styles from './index.module.scss'

const API_BASE = 'https://www.hgshouse.com/api'

/** 获取或生成持久 userId（存 Storage） */
const getUserId = () => {
  let uid = Taro.getStorageSync('chat_user_id')
  if (!uid) {
    uid = 'u_' + Date.now().toString(36)
    Taro.setStorageSync('chat_user_id', uid)
  }
  return uid
}

const makeTime = () => {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const Chat = ({ onBack, sceneTitle = 'Business English', level = 'B1' }) => {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      text: "Hello! I'm your AI English tutor. What would you like to practice today?",
      sender: 'ai',
      time: makeTime(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [lastMsgId, setLastMsgId] = useState('msg-init-1')
  const userIdRef = useRef(getUserId())

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last) setLastMsgId(`msg-${last.id}`)
  }, [messages])

  const handleSend = async (text) => {
    if (!text?.trim() || isLoading) return

    const uid = Date.now().toString()
    const userMsg = { id: uid, text: text.trim(), sender: 'user', time: makeTime() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const result = await new Promise((resolve, reject) => {
        Taro.request({
          url: `${API_BASE}/ai/chat`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: {
            user_id: userIdRef.current,
            message: text.trim(),
            level,
          },
          success: resolve,
          fail: reject,
        })
      })

      if (result.statusCode === 200 && result.data?.reply) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          text: result.data.reply,
          sender: 'ai',
          time: makeTime(),
        }
        setMessages(prev => [...prev, aiMsg])
      } else {
        throw new Error(`HTTP ${result.statusCode}`)
      }
    } catch (err) {
      console.error('[Chat] API error:', err)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none', duration: 2000 })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className={styles.page}>
      {/* Header */}
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={onBack}>
          <Text className={styles.backIcon}>←</Text>
        </View>
        <View className={styles.headerCenter}>
          <View className={styles.titleRow}>
            <View className={styles.onlineDot} />
            <Text className={styles.title}>English AI Tutor</Text>
          </View>
          <Text className={styles.subtitle}>Powered by DeepSeek</Text>
        </View>
        <View className={styles.settingsBtn}>
          <Text style={{ fontSize: '18px' }}>⚙️</Text>
        </View>
      </View>

      {/* Message List */}
      <ScrollView scrollY className={styles.msgArea} scrollIntoView={lastMsgId}>
        <View className={styles.dateSep}>
          <Text className={styles.dateText}>Today</Text>
        </View>

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* 打字中动画 */}
        {isLoading && (
          <View className={styles.typingRow}>
            <View className={styles.typingAvatar}>
              <Text style={{ fontSize: '14px' }}>🤖</Text>
            </View>
            <View className={styles.typingBubble}>
              <View className={styles.dot} style={{ animationDelay: '0s' }} />
              <View className={styles.dot} style={{ animationDelay: '0.2s' }} />
              <View className={styles.dot} style={{ animationDelay: '0.4s' }} />
            </View>
          </View>
        )}

        <View id={lastMsgId} style={{ height: '8px' }} />
      </ScrollView>

      {/* Input */}
      <ChatInput onSendMessage={handleSend} />
    </View>
  )
}

export default Chat
