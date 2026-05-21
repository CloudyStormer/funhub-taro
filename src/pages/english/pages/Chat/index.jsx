import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import ChatMessage from './ChatMessage'
import ChatInput from '../../../../components/ChatInput'
import { speakText, stopSpeaking } from '../../utils/tts'
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
  const [scrollTop, setScrollTop] = useState(0)

  const sessionIdRef   = useRef('')
  const userIdRef      = useRef(getUserId())
  const typeTimerRef   = useRef(null)
  const streamingRef   = useRef(null)
  const isLoadingRef   = useRef(false)   // ← 用 ref 供 useCallback 闭包读取，避免陈旧值
  const wordsStr       = words.map(w => w.word || w).join(',')

  // 只在 messages 变化时滚底（不依赖 isLoading，避免触发 ChatInput 重渲染）
  useEffect(() => {
    const t = setTimeout(() => setScrollTop(v => v + 99999), 60)
    return () => clearTimeout(t)
  }, [messages])

  useEffect(() => {
    callApi('')
    return () => clearTypewriter()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 打字机控制 ── */

  const clearTypewriter = () => {
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current)
      typeTimerRef.current = null
    }
  }

  /** 立刻把当前正在打字的消息显示完整，然后清除状态 */
  const flushTypewriter = () => {
    clearTypewriter()
    if (streamingRef.current) {
      const { msgId, fullText } = streamingRef.current
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, text: fullText, streaming: false } : m
      ))
      streamingRef.current = null
    }
  }

  /** 按下语音按钮 / 点击气泡时：停止TTS + 中断打字机（引用稳定，传给子组件） */
  const handleInterrupt = useCallback(() => {
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current)
      typeTimerRef.current = null
    }
    if (streamingRef.current) {
      const { msgId, fullText } = streamingRef.current
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, text: fullText, streaming: false } : m
      ))
      streamingRef.current = null
    }
    stopSpeaking()
  }, []) // 只访问 ref 和稳定的 setMessages，deps 为空

  /** 打字机动画：逐字填充消息 */
  const typewriter = (fullText, msgId) => {
    clearTypewriter()
    streamingRef.current = { msgId, fullText }

    const chars = Array.from(fullText)
    const delay = Math.min(120, Math.max(30, 7000 / chars.length))
    let i = 0

    typeTimerRef.current = setInterval(() => {
      i++
      const partial = chars.slice(0, i).join('')
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, text: partial, streaming: i < chars.length } : m
      ))
      if (i >= chars.length) {
        clearTypewriter()
        streamingRef.current = null
      }
    }, delay)
  }

  /* ── API 调用 ── */

  const callApi = async (text) => {
    isLoadingRef.current = true
    setIsLoading(true)
    try {
      const result = await new Promise((resolve, reject) => {
        Taro.request({
          url:    `${API_BASE}/ai/topic-agent-chat`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: {
            user_id:    userIdRef.current,
            session_id: sessionIdRef.current,
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
        if (result.data.session_id) {
          sessionIdRef.current = result.data.session_id
        }

        const reply = result.data.reply
        const msgId = Date.now().toString()

        // 插入空气泡（显示光标，等待打字机）
        setMessages(prev => [...prev, {
          id: msgId, text: '', streaming: true, sender: 'ai', time: makeTime(),
        }])

        // 打字机只在音频真正开始播放时才启动
        let typewriterStarted = false
        const startTypewriter = () => {
          if (typewriterStarted) return
          typewriterStarted = true
          typewriter(reply, msgId)
        }

        // TTS：音频 onPlay 时触发打字机
        speakText(reply, { onPlay: startTypewriter })

        // 保险 fallback：2s 后如果 TTS 还没 onPlay（网络慢/失败），强制开始打字
        setTimeout(startTypewriter, 2000)

      } else {
        throw new Error(`HTTP ${result.statusCode}`)
      }
    } catch (err) {
      console.error('[Chat] API error:', err)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none', duration: 2000 })
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }

  /* ── 发送消息（useCallback：引用稳定，避免 ChatInput 因 handleSend 变化而重渲染） ── */
  const handleSend = useCallback(async (text) => {
    if (!text?.trim() || isLoadingRef.current) return

    flushTypewriter()
    stopSpeaking()

    setMessages(prev => [...prev, {
      id: Date.now().toString(), text: text.trim(), sender: 'user', time: makeTime(),
    }])
    await callApi(text.trim())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        scrollTop={scrollTop}
      >
        <View className={styles.dateSep}>
          <Text className={styles.dateText}>Today</Text>
        </View>

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} onStop={handleInterrupt} />
        ))}

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

        <View style={{ height: '24px' }} />
      </ScrollView>

      <ChatInput onSendMessage={handleSend} onInterrupt={handleInterrupt} />
    </View>
  )
}

export default Chat
