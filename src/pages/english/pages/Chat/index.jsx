import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { speakText } from '../../utils/tts'
import styles from './index.module.scss'

const API_BASE = 'https://www.hgshouse.com/api'

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

const Chat = ({ onBack, sceneTitle = '商务英语', words = [], level = 'B1' }) => {
  const [messages, setMessages]   = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastMsgId, setLastMsgId] = useState('msg-bottom')
  const [scrollTop, setScrollTop] = useState(0)
  const sessionIdRef = useRef('')
  const userIdRef    = useRef(getUserId())
  const wordsStr     = words.map(w => w.word || w).join(',')

  useEffect(() => {
    const timer = setTimeout(() => {
      const last = messages[messages.length - 1]
      if (last) {
        setLastMsgId(`msg-${last.id}`)
      }
      setScrollTop(prev => prev + 100000)
    }, 80)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollTop(prev => prev + 100000)
      setLastMsgId('msg-bottom')
    }, 140)
    return () => clearTimeout(timer)
  }, [messages.length, isLoading])

  // 进入对话后立即发一次空消息，让 AI 开场白
  useEffect(() => {
    callApi('')
  }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  const callApi = async (text) => {
    setIsLoading(true)
    try {
      const result = await new Promise((resolve, reject) => {
        Taro.request({
          url:    `${API_BASE}/ai/topic-agent-chat`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: {
            user_id:    userIdRef.current,
            session_id: sessionIdRef.current,  // 首次为空字符串，服务端自动建会话
            type:       sceneTitle,
            words:      wordsStr,
            message:    text,
            level,
          },
          success: resolve,
          fail:    reject,
        })
      })

      if (result.statusCode === 200 && result.data?.reply) {
        // 保存 session_id，后续复用
        if (result.data.session_id) {
          sessionIdRef.current = result.data.session_id
        }
        const aiMsg = {
          id:     Date.now().toString(),
          text:   result.data.reply,
          sender: 'ai',
          time:   makeTime(),
        }
        setMessages(prev => [...prev, aiMsg])
        // AI 回复后自动朗读
        speakText(result.data.reply)
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

  const handleSend = async (text) => {
    if (!text?.trim() || isLoading) return
    const userMsg = { id: Date.now().toString(), text: text.trim(), sender: 'user', time: makeTime() }
    setMessages(prev => [...prev, userMsg])
    await callApi(text.trim())
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
            <Text className={styles.title}>{sceneTitle || 'AI Tutor'}</Text>
          </View>
          <Text className={styles.subtitle}>Powered by DeepSeek</Text>
        </View>
        <View className={styles.settingsBtn}>
          <Text style={{ fontSize: '18px' }}>⚙️</Text>
        </View>
      </View>

      {/* Message List */}
      <ScrollView
        scrollY
        scrollWithAnimation
        className={styles.msgArea}
        scrollIntoView={lastMsgId}
        scrollTop={scrollTop}
      >
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

        <View id='msg-bottom' style={{ height: '24px' }} />
      </ScrollView>

      {/* Input */}
      <ChatInput onSendMessage={handleSend} />
    </View>
  )
}

export default Chat
