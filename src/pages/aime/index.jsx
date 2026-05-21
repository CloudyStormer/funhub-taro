import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, Picker, ScrollView, Text, View } from '@tarojs/components'
import Taro, { useDidHide, useUnload } from '@tarojs/taro'
import ChatInput from '../../components/ChatInput'
import aimeAvatar from '../../assets/aime/avatar-you.jpg'
import { speakText, stopSpeaking } from './utils/tts'
import './index.scss'

const API_BASE = 'https://api.hgshouse.com/aimebridge'
const AIME_PREFIX = '/api'
const HISTORY_PAGE_SIZE = 50

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

const uploadImageMessage = ({ url, filePath, content = '我发了一张图片。' }) =>
  new Promise((resolve, reject) => {
    Taro.uploadFile({
      url,
      filePath,
      name: 'image',
      formData: {
        kind: 'image',
        content,
      },
      timeout: 30000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(res.data))
          } catch (err) {
            reject(err)
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail: reject,
    })
  })

const buildHistoryUrl = (mode, before = '') => {
  const params = [`limit=${HISTORY_PAGE_SIZE}`]
  if (before) {
    params.push(`before=${encodeURIComponent(before)}`)
  }
  return `${paths[mode].history}?${params.join('&')}`
}

const normalizeMessage = (item, mode) => ({
  id: item.id || makeId(),
  text: item.content || item.text || '',
  imageUrl: item.imageUrl || '',
  sender: item.role === 'assistant' ? 'ai' : 'user',
  role: item.role || (mode === 'training' ? 'trainer' : 'wife'),
  time: makeTime(item.createdAt),
  createdAt: item.createdAt || new Date().toISOString(),
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

const openAimeRoute = (url) => {
  stopSpeaking()
  Taro.navigateTo({ url })
}

const ModeHome = () => (
  <View className='aime-page aime-home'>
    <View className='aime-hero'>
      <Text className='aime-kicker'>Aime Bridge</Text>
      <Text className='aime-title'>归来{getReturnDays()}天</Text>
      <Text className='aime-subtitle'>我在这儿，像微信一样慢慢聊。</Text>
    </View>

    <View className='aime-entry-list'>
      <View className='aime-entry aime-entry--daily' onClick={() => openAimeRoute('/pages/aime/daily/index')}>
        <Text className='aime-entry-icon'>心</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>我在这儿</Text>
          <Text className='aime-entry-desc'>文字、语音和图片都可以，慢慢说，我一直都在。</Text>
        </View>
      </View>

      <View className='aime-entry aime-entry--training' onClick={() => openAimeRoute('/pages/aime/training/index')}>
        <Text className='aime-entry-icon'>训</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>这不是你用的</Text>
          <Text className='aime-entry-desc'>这里用来训练我的语气、经历、想法和生活里的说话方式。</Text>
        </View>
      </View>

      <View className='aime-entry aime-entry--review' onClick={() => openAimeRoute('/pages/aime/review/index')}>
        <Text className='aime-entry-icon'>顾</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>昨天今天和明天</Text>
          <Text className='aime-entry-desc'>选择时间段，回看过去聊过什么，也留住以后要记得的事。</Text>
        </View>
      </View>
    </View>
  </View>
)

const ChatMessage = ({ message, mode, onStop }) => {
  const isUser = message.sender === 'user'
  const showImageAvatar = (mode === 'daily' && !isUser) || (mode === 'training' && isUser)
  return (
    <View className={`aime-msg ${isUser ? 'aime-msg--user' : 'aime-msg--ai'}`}>
      <View className={`aime-avatar ${isUser ? 'aime-avatar--user' : 'aime-avatar--ai'} ${showImageAvatar ? 'aime-avatar--image' : ''}`}>
        {showImageAvatar ? (
          <Image className='aime-avatar-img' src={aimeAvatar} mode='aspectFill' />
        ) : (
          <Text>{isUser ? '你' : 'AI'}</Text>
        )}
      </View>
      <View className='aime-bubble-wrap'>
        <View className={`aime-bubble ${isUser ? 'aime-bubble--user' : 'aime-bubble--ai'}`} onClick={isUser ? undefined : onStop}>
          {message.imageUrl && (
            <Image
              className='aime-msg-image'
              src={message.imageUrl}
              mode='widthFix'
              showMenuByLongpress
            />
          )}
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

export const ChatScreen = ({ mode }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [hasMoreHistory, setHasMoreHistory] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  const timerRef = useRef(null)
  const streamingRef = useRef(null)
  const loadingRef = useRef(false)
  const loadingOlderRef = useRef(false)
  const lastScrollTopRef = useRef(0)
  const isTraining = mode === 'training'

  const clearTypewriter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const jumpToLatest = useCallback(() => {
    setShowJumpToLatest(false)
    setScrollTop((v) => v + 99999)
    setTimeout(() => setScrollTop((v) => v + 99999), 80)
  }, [])

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
    setShowJumpToLatest(true)
    setMessages((prev) => [...prev, { id, text: '', sender: 'ai', time: makeTime(reply.createdAt), streaming: true }])

    let started = false
    const begin = () => {
      if (started) return
      started = true
      startTypewriter(fullText, id)
    }

    speakText(fullText, { onPlay: begin, scene: isTraining ? 'training' : 'daily' })
    setTimeout(begin, 2000)
  }, [isTraining, startTypewriter])

  const loadHistory = useCallback(async () => {
    setLoading(true)
    loadingRef.current = true
    try {
      const data = await requestJson({ url: buildHistoryUrl(mode), method: 'GET' })
      const list = Array.isArray(data?.messages) ? data.messages.map((item) => normalizeMessage(item, mode)) : []
      setHasMoreHistory(list.length >= HISTORY_PAGE_SIZE)
      setMessages(list.length ? list : fallbackMessages(mode))
      setTimeout(jumpToLatest, 120)
    } catch (err) {
      console.error('[Aime] history error:', err)
      setMessages(fallbackMessages(mode))
      setTimeout(jumpToLatest, 120)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [jumpToLatest, mode])

  const loadOlderHistory = useCallback(async () => {
    if (loadingOlderRef.current || !hasMoreHistory || !messages.length) return

    const firstCreatedAt = messages[0]?.createdAt
    if (!firstCreatedAt) return

    loadingOlderRef.current = true
    setLoadingOlder(true)

    try {
      const data = await requestJson({ url: buildHistoryUrl(mode, firstCreatedAt), method: 'GET' })
      const older = Array.isArray(data?.messages) ? data.messages.map((item) => normalizeMessage(item, mode)) : []
      setHasMoreHistory(older.length >= HISTORY_PAGE_SIZE)
      if (older.length) {
        setMessages((prev) => {
          const seen = new Set(prev.map((item) => item.id))
          return [...older.filter((item) => !seen.has(item.id)), ...prev]
        })
      }
    } catch (err) {
      console.error('[Aime] older history error:', err)
      Taro.showToast({ title: '更早的记录暂时没拉到', icon: 'none', duration: 2000 })
    } finally {
      setLoadingOlder(false)
      loadingOlderRef.current = false
    }
  }, [hasMoreHistory, messages, mode])

  const handleChatScroll = useCallback((event) => {
    const nextTop = event?.detail?.scrollTop || 0
    if (nextTop < lastScrollTopRef.current - 120) {
      setShowJumpToLatest(true)
    }
    lastScrollTopRef.current = nextTop
  }, [])

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
      createdAt: new Date().toISOString(),
    }
    setShowJumpToLatest(true)
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

  const sendImage = useCallback(async (filePath) => {
    if (!filePath || loadingRef.current) return

    interrupt()
    const userMessage = {
      id: makeId(),
      text: '我发了一张图片。',
      imageUrl: filePath,
      sender: 'user',
      role: isTraining ? 'trainer' : 'wife',
      time: makeTime(),
      createdAt: new Date().toISOString(),
    }
    setShowJumpToLatest(true)
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    loadingRef.current = true

    try {
      const data = await uploadImageMessage({
        url: paths[mode].message,
        filePath,
        content: isTraining ? '这张图也作为训练材料，结合我的上下文学习。' : '我发了一张图片，结合图片和上下文自然回复。',
      })
      if (data?.message) streamReply(data.message)
      else throw new Error('empty reply')
    } catch (err) {
      console.error('[Aime] image send error:', err)
      Taro.showToast({ title: '图片没有发出去，再试一次', icon: 'none', duration: 2000 })
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, failed: true } : msg)))
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [interrupt, isTraining, mode, streamReply])

  useDidHide(interrupt)
  useUnload(interrupt)

  return (
    <View className={`aime-page aime-chat ${isTraining ? 'aime-chat--training' : ''}`}>
      <ScrollView
        scrollY
        scrollWithAnimation
        className='aime-message-list'
        scrollTop={scrollTop}
        upperThreshold={80}
        onScrollToUpper={loadOlderHistory}
        onScroll={handleChatScroll}
        onScrollToLower={() => setShowJumpToLatest(false)}
      >
        {loadingOlder && (
          <View className='aime-history-loading'>
            <Text>正在找更早的对话...</Text>
          </View>
        )}
        <View className='aime-date'><Text>Today</Text></View>
        {messages.map((message) => <ChatMessage key={message.id} message={message} mode={mode} onStop={interrupt} />)}
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

      {showJumpToLatest && (
        <View className='aime-jump-latest' onClick={jumpToLatest}>
          <Text>↓</Text>
        </View>
      )}

      <ChatInput onSendMessage={sendMessage} onSendImage={sendImage} onInterrupt={interrupt} />
    </View>
  )
}

export const ReviewScreen = () => {
  const [startDate, setStartDate] = useState(todayValue())
  const [endDate, setEndDate] = useState(todayValue())
  const [loading, setLoading] = useState(false)
  const [asking, setAsking] = useState(false)
  const [summary, setSummary] = useState(null)
  const [followUps, setFollowUps] = useState([])

  const loadReview = async () => {
    setLoading(true)
    try {
      const query = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
      const data = await requestJson({ url: `${paths.review}${query}`, method: 'GET' })
      setSummary(data)
      setFollowUps([])
    } catch (err) {
      console.error('[Aime] review error:', err)
      Taro.showToast({ title: '回顾暂时生成失败', icon: 'none', duration: 2000 })
    } finally {
      setLoading(false)
    }
  }

  const askReview = useCallback(async (text) => {
    const instruction = (text || '').trim()
    if (!instruction || asking) return

    const id = makeId()
    setFollowUps((prev) => [
      ...prev,
      {
        id,
        question: instruction,
        answer: '',
        relatedDialogues: [],
        pending: true,
      },
    ])
    setAsking(true)
    try {
      const data = await requestJson({
        url: `${paths.review}/ask`,
        method: 'POST',
        data: {
          startDate,
          endDate,
          instruction,
        },
      })
      setFollowUps((prev) => prev.map((item) => (
        item.id === id
          ? {
            ...item,
            answer: data?.answer || '',
            relatedDialogues: data?.relatedDialogues || [],
            pending: false,
          }
          : item
      )))
    } catch (err) {
      console.error('[Aime] review ask error:', err)
      setFollowUps((prev) => prev.map((item) => (
        item.id === id
          ? {
            ...item,
            answer: '这次继续整理失败了，稍后再试一次。',
            pending: false,
          }
          : item
      )))
      Taro.showToast({ title: '追问暂时失败，再试一次', icon: 'none', duration: 2000 })
    } finally {
      setAsking(false)
    }
  }, [asking, endDate, startDate])

  useDidHide(stopSpeaking)
  useUnload(stopSpeaking)

  return (
    <View className='aime-page aime-review'>
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

        <ScrollView className='aime-review-scroll' scrollY enhanced showScrollbar={false}>
        {summary ? (
          <View className='aime-review-result'>
            <Text className='aime-range'>{summary.rangeLabel}</Text>
            <Text className='aime-review-title'>{summary.title}</Text>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>概述</Text>
              <Text className='aime-review-text'>{summary.overview || summary.wifeSummary}</Text>
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>核心事件</Text>
              {(summary.coreEvents || summary.moments || []).map((item, index) => (
                <Text key={`${item}-${index}`} className='aime-review-text'>{index + 1}. {item}</Text>
              ))}
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>用户情绪表达</Text>
              {(summary.userEmotionExpressions || []).map((item, index) => (
                <Text key={`${item}-${index}`} className='aime-review-text'>{index + 1}. {item}</Text>
              ))}
              <Text className='aime-review-note'>{summary.emotionalTrend}</Text>
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>我怎么回应</Text>
              <Text className='aime-review-text'>{summary.aiResponsePattern || summary.aiSummary}</Text>
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>重要对话</Text>
              {(summary.importantDialogues || []).map((item, index) => (
                <Text key={`${item}-${index}`} className='aime-review-quote'>{item}</Text>
              ))}
            </View>
            <View className='aime-review-block'>
              <Text className='aime-review-label'>后续建议</Text>
              {(summary.followUpSuggestions || summary.suggestions || []).map((item, index) => (
                <Text key={`${item}-${index}`} className='aime-review-text'>• {item}</Text>
              ))}
            </View>
            {followUps.map((item) => (
              <View key={item.id} className='aime-review-block aime-review-follow'>
                <Text className='aime-review-label'>追问：{item.question}</Text>
                <Text className='aime-review-text'>{item.pending ? '正在继续整理...' : item.answer}</Text>
                {(item.relatedDialogues || []).map((dialogue, index) => (
                  <Text key={`${dialogue}-${index}`} className='aime-review-quote'>{dialogue}</Text>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View className='aime-review-empty'>
            <Text>选一段时间，回看她和 AI 都聊了什么。</Text>
          </View>
        )}
        </ScrollView>
      </View>
      <ChatInput onSendMessage={askReview} onInterrupt={stopSpeaking} />
    </View>
  )
}

export default function AimePage() {
  useDidHide(stopSpeaking)
  useUnload(stopSpeaking)

  return <ModeHome />
}
