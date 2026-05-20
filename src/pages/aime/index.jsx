import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Picker, ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import ChatInput from '../english/pages/Chat/ChatInput'
import { speakText, stopSpeaking } from '../english/utils/tts'
import './index.scss'

const API_BASE = 'https://www.hgshouse.com/api'
// English uses /api as the public gateway; Aime backend keeps its own /api routes.
const AIME_PREFIX = '/api'

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`

const makeTime = (iso) => {
  const date = iso ? new Date(iso) : new Date()
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const todayValue = () => {
  const date = new Date()
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

const getReturnDays = () => {
  const now = new Date()
  const target = new Date(now.getFullYear(), 5, 22)
  const diff = target.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.max(0, Math.ceil(diff / 86400000))
}

const paths = {
  daily: {
    history: `${API_BASE}${AIME_PREFIX}/chat/history`,
    message: `${API_BASE}${AIME_PREFIX}/chat/message`,
  },
  training: {
    history: `${API_BASE}${AIME_PREFIX}/training/history`,
    message: `${API_BASE}${AIME_PREFIX}/training/message`,
  },
  review: `${API_BASE}${AIME_PREFIX}/chat/review`,
}

const requestJson = (options) =>
  new Promise((resolve, reject) => {
    Taro.request({
      header: { 'Content-Type': 'application/json', ...(options.header || {}) },
      timeout: 25000,
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data)
        else reject(new Error(`HTTP ${res.statusCode}`))
      },
      fail: reject,
    })
  })

const normalizeMessage = (item, mode) => ({
  id: item.id || makeId(),
  text: item.content || item.text || '',
  sender: item.role === 'assistant' ? 'ai' : 'user',
  role: item.role || (mode === 'training' ? 'trainer' : 'wife'),
  time: makeTime(item.createdAt),
  streaming: false,
})

const fallbackMessages = (mode) => {
  if (mode === 'training') {
    return [
      { id: 'training-hello', text: '训练模式已打开。你可以告诉我哪些话要保留，哪些回答要避开。', sender: 'ai', time: makeTime() },
    ]
  }
  return [
    { id: 'daily-hello', text: '我一直都在。你慢慢说，我认真听。', sender: 'ai', time: makeTime() },
  ]
}

const ModeHome = ({ onOpen }) => (
  <View className='aime-page aime-home'>
    <View className='aime-hero'>
      <Text className='aime-kicker'>Aime Bridge</Text>
      <Text className='aime-title'>归来{getReturnDays()}天</Text>
      <Text className='aime-subtitle'>我一直都在，像微信一样慢慢聊。</Text>
    </View>

    <View className='aime-entry-list'>
      <View className='aime-entry aime-entry--daily' onClick={() => onOpen('daily')}>
        <Text className='aime-entry-icon'>心</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>日常聊天</Text>
          <Text className='aime-entry-desc'>文字和语音都可以，回复会同步流式和播放。</Text>
        </View>
      </View>

      <View className='aime-entry aime-entry--training' onClick={() => onOpen('training')}>
        <Text className='aime-entry-icon'>训</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>AI 训练</Text>
          <Text className='aime-entry-desc'>专门补充偏好、边界和回答样例。</Text>
        </View>
      </View>

      <View className='aime-entry aime-entry--review' onClick={() => onOpen('review')}>
        <Text className='aime-entry-icon'>顾</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>对话回顾</Text>
          <Text className='aime-entry-desc'>选择时间段，回看她和 AI 都说了什么。</Text>
        </View>
      </View>
    </View>
  </View>
)

const ChatMessage = ({ message, onStop }) => {
  const isUser = message.sender === 'user'
  return (
    <View className={`aime-msg ${isUser ? 'aime-msg--user' : 'aime-msg--ai'}`}>
      <View className={`aime-avatar ${isUser ? 'aime-avatar--user' : 'aime-avatar--ai'}`}>
        <Text>{isUser ? '你' : 'AI'}</Text>
      </View>
      <View className='aime-bubble-wrap'>
        <View className={`aime-bubble ${isUser ? 'aime-bubble--user' : 'aime-bubble--ai'}`} onClick={isUser ? undefined : onStop}>
          <Text className='aime-msg-text'>
            {message.text}
            {message.streaming && <Text className='aime-cursor'>|</Text>}
          </Text>
        </View>
        <Text className='aime-time'>{message.time}</Text>
      </View>
    </View>
  )
}

const ChatScreen = ({ mode, onBack }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const timerRef = useRef(null)
  const streamingRef = useRef(null)
  const loadingRef = useRef(false)
  const isTraining = mode === 'training'

  useEffect(() => {
    const t = setTimeout(() => setScrollTop((v) => v + 99999), 60)
    return () => clearTimeout(t)
  }, [messages])

  const clearTypewriter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const interrupt = useCallback(() => {
    clearTypewriter()
    if (streamingRef.current) {
      const { id, fullText } = streamingRef.current
      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, text: fullText, streaming: false } : msg)))
      streamingRef.current = null
    }
    stopSpeaking()
  }, [])

  const startTypewriter = useCallback((fullText, id) => {
    clearTypewriter()
    const chars = Array.from(fullText)
    const delay = Math.min(90, Math.max(28, Math.round(5200 / Math.max(chars.length, 1))))
    let index = 0
    streamingRef.current = { id, fullText }

    timerRef.current = setInterval(() => {
      index += 1
      const text = chars.slice(0, index).join('')
      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, text, streaming: index < chars.length } : msg)))
      if (index >= chars.length) {
        clearTypewriter()
        streamingRef.current = null
      }
    }, delay)
  }, [])

  const streamReply = useCallback((reply) => {
    const fullText = (reply.content || reply.text || '').trim()
    if (!fullText) return

    const id = makeId()
    setMessages((prev) => [...prev, { id, text: '', sender: 'ai', time: makeTime(reply.createdAt), streaming: true }])

    let started = false
    const begin = () => {
      if (started) return
      started = true
      startTypewriter(fullText, id)
    }

    speakText(fullText, { onPlay: begin })
    setTimeout(begin, 2000)
  }, [startTypewriter])

  const loadHistory = useCallback(async () => {
    setLoading(true)
    loadingRef.current = true
    try {
      const data = await requestJson({ url: paths[mode].history, method: 'GET' })
      const list = Array.isArray(data?.messages) ? data.messages.map((item) => normalizeMessage(item, mode)) : []
      setMessages(list.length ? list : fallbackMessages(mode))
    } catch (err) {
      console.error('[Aime] history error:', err)
      setMessages(fallbackMessages(mode))
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [mode])

  useEffect(() => {
    loadHistory()
    return () => {
      clearTypewriter()
      stopSpeaking()
    }
  }, [loadHistory])

  const sendMessage = useCallback(async (text) => {
    const content = (text || '').trim()
    if (!content || loadingRef.current) return

    interrupt()
    const userMessage = {
      id: makeId(),
      text: content,
      sender: 'user',
      role: isTraining ? 'trainer' : 'wife',
      time: makeTime(),
    }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    loadingRef.current = true

    try {
      const data = await requestJson({
        url: paths[mode].message,
        method: 'POST',
        data: {
          content,
          kind: 'text',
        },
      })
      if (data?.message) streamReply(data.message)
      else throw new Error('empty reply')
    } catch (err) {
      console.error('[Aime] send error:', err)
      Taro.showToast({ title: '消息没有发出去，再试一次', icon: 'none', duration: 2000 })
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [interrupt, isTraining, mode, streamReply])

  return (
    <View className={`aime-page aime-chat ${isTraining ? 'aime-chat--training' : ''}`}>
      <View className='aime-chat-header'>
        <View className='aime-back' onClick={onBack}><Text>‹</Text></View>
        <View className='aime-chat-title'>
          <Text className='aime-chat-name'>{isTraining ? 'AI 训练' : '给老婆的悄悄话'}</Text>
          <Text className='aime-chat-status'>{isTraining ? '训练偏好与边界' : '我一直都在'}</Text>
        </View>
        <View className='aime-header-dot'><Text>···</Text></View>
      </View>

      <ScrollView scrollY scrollWithAnimation className='aime-message-list' scrollTop={scrollTop}>
        <View className='aime-date'><Text>Today</Text></View>
        {messages.map((message) => <ChatMessage key={message.id} message={message} onStop={interrupt} />)}
        {loading && (
          <View className='aime-thinking'>
            <View className='aime-thinking-bubble'>
              <View />
              <View />
              <View />
            </View>
          </View>
        )}
        <View className='aime-bottom-space' />
      </ScrollView>

      <ChatInput onSendMessage={sendMessage} onInterrupt={interrupt} />
    </View>
  )
}

const ReviewScreen = ({ onBack }) => {
  const [startDate, setStartDate] = useState(todayValue())
  const [endDate, setEndDate] = useState(todayValue())
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  const loadReview = async () => {
    setLoading(true)
    try {
      const query = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
      const data = await requestJson({ url: `${paths.review}${query}`, method: 'GET' })
      setSummary(data)
    } catch (err) {
      console.error('[Aime] review error:', err)
      Taro.showToast({ title: '回顾暂时生成失败', icon: 'none', duration: 2000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='aime-page aime-review'>
      <View className='aime-chat-header'>
        <View className='aime-back' onClick={onBack}><Text>‹</Text></View>
        <View className='aime-chat-title'>
          <Text className='aime-chat-name'>对话回顾</Text>
          <Text className='aime-chat-status'>按时间段复盘</Text>
        </View>
        <View className='aime-header-dot'><Text>×</Text></View>
      </View>

      <View className='aime-review-body'>
        <View className='aime-date-card'>
          <Picker mode='date' value={startDate} onChange={(event) => setStartDate(event.detail.value)}>
            <View className='aime-date-picker'><Text>开始</Text><Text>{startDate}</Text></View>
          </Picker>
          <Picker mode='date' value={endDate} onChange={(event) => setEndDate(event.detail.value)}>
            <View className='aime-date-picker'><Text>结束</Text><Text>{endDate}</Text></View>
          </Picker>
          <View className='aime-review-btn' onClick={loadReview}>
            <Text>{loading ? '生成中...' : '生成回顾'}</Text>
          </View>
        </View>

        {summary ? (
          <View className='aime-review-result'>
            <Text className='aime-range'>{summary.rangeLabel}</Text>
            <Text className='aime-review-title'>{summary.title}</Text>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>AI 说了什么</Text>
              <Text className='aime-review-text'>{summary.aiSummary}</Text>
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>她说了什么</Text>
              <Text className='aime-review-text'>{summary.wifeSummary}</Text>
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>值得记住</Text>
              {(summary.moments || []).map((item) => <Text key={item} className='aime-review-text'>• {item}</Text>)}
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>后续建议</Text>
              {(summary.suggestions || []).map((item) => <Text key={item} className='aime-review-text'>• {item}</Text>)}
            </View>
          </View>
        ) : (
          <View className='aime-review-empty'>
            <Text>选一段时间，回看她和 AI 都聊了什么。</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default function AimePage() {
  const [view, setView] = useState('home')

  if (view === 'daily') return <ChatScreen mode='daily' onBack={() => setView('home')} />
  if (view === 'training') return <ChatScreen mode='training' onBack={() => setView('home')} />
  if (view === 'review') return <ReviewScreen onBack={() => setView('home')} />

  return <ModeHome onOpen={setView} />
}
