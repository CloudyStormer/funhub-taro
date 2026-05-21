import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
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

const makeWechatTime = (iso) => {
  const date = iso ? new Date(iso) : new Date()
  if (Number.isNaN(date.getTime())) return makeTime()
  const now = new Date()
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const clock = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  if (dateStart === nowStart) return clock
  if (dateStart === nowStart - 86400000) return `昨天 ${clock}`
  return `${date.getMonth() + 1}月${date.getDate()}日 ${clock}`
}

const shouldShowMessageTime = (messages, index) => {
  if (index === 0) return true
  const current = new Date(messages[index]?.createdAt || 0).getTime()
  const previous = new Date(messages[index - 1]?.createdAt || 0).getTime()
  if (!current || !previous) return false
  return current - previous >= 5 * 60 * 1000
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
  voiceClone: {
    trainText: `${API_BASE}${AIME_PREFIX}/voice-clone/train-text`,
    train: `${API_BASE}${AIME_PREFIX}/voice-clone/train`,
    result: `${API_BASE}${AIME_PREFIX}/voice-clone/result`,
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

const uploadVoiceCloneAudio = ({ filePath, textId, textSegId }) =>
  new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: paths.voiceClone.train,
      filePath,
      name: 'audio',
      formData: {
        textId,
        textSegId,
        format: 'mp3',
        resourceName: 'aime-daily-voice',
      },
      timeout: 60000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(res.data))
          } catch (err) {
            reject(err)
          }
        } else {
          let detail = ''
          try {
            const body = JSON.parse(res.data || '{}')
            detail = body?.detail || body?.message || ''
          } catch (err) {
            detail = res.data || ''
          }
          reject(new Error(detail || `HTTP ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(err?.errMsg || 'uploadFile failed'))
      },
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
      { id: 'training-hello', text: '训练模式已打开。你可以告诉我哪些话要保留，哪些回答要避开。', sender: 'ai', time: makeTime(), createdAt: new Date().toISOString() },
    ]
  }
  return [
    { id: 'daily-hello', text: '我一直都在。你慢慢说，我认真听。', sender: 'ai', time: makeTime(), createdAt: new Date().toISOString() },
  ]
}

const openAimeRoute = (url) => {
  stopSpeaking()
  Taro.navigateTo({ url })
}

const getVoiceSegmentId = (segment, index = 0) => (
  segment?.textSegId || segment?.segId || segment?.id || segment?.text_seg_id || index + 1
)

const getVoiceSegmentText = (segment) => (
  segment?.text || segment?.content || segment?.segText || segment?.textSeg || segment?.txt || ''
)

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

      <View className='aime-entry aime-entry--voice' onClick={() => openAimeRoute('/pages/aime/voice/index')}>
        <Text className='aime-entry-icon'>声</Text>
        <View className='aime-entry-copy'>
          <Text className='aime-entry-title'>声音训练</Text>
          <Text className='aime-entry-desc'>按讯飞一句话复刻文本录一段音，训练成功后“我在这儿”直接用这个声音。</Text>
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

export const VoiceCloneScreen = () => {
  const [trainText, setTrainText] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadingText, setLoadingText] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordSec, setRecordSec] = useState(0)
  const [audioPath, setAudioPath] = useState('')
  const [task, setTask] = useState(null)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(false)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)

  const segments = Array.isArray(trainText?.textSegs) ? trainText.textSegs : []
  const activeSegment = segments[selectedIndex] || segments[0] || null
  const activeTextId = trainText?.textId || 5001
  const activeTextSegId = getVoiceSegmentId(activeSegment, selectedIndex)
  const activeText = getVoiceSegmentText(activeSegment)

  const clearRecordTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const loadTrainText = useCallback(async () => {
    setLoadingText(true)
    try {
      const data = await requestJson({ url: `${paths.voiceClone.trainText}?textId=5001`, method: 'GET' })
      setTrainText(data)
      setSelectedIndex(0)
    } catch (err) {
      console.error('[AimeVoice] train text error:', err)
      Taro.showToast({ title: '训练文本没拉到，稍后再试', icon: 'none', duration: 2000 })
    } finally {
      setLoadingText(false)
    }
  }, [])

  const stopRecord = useCallback(() => {
    if (!recording) return
    try {
      recorderRef.current?.stop()
    } catch (err) {
      console.error('[AimeVoice] stop record error:', err)
      setRecording(false)
      clearRecordTimer()
    }
  }, [recording])

  useEffect(() => {
    const recorder = Taro.getRecorderManager()
    recorderRef.current = recorder
    recorder.onStop((res) => {
      clearRecordTimer()
      setRecording(false)
      setRecordSec(Math.max(1, Math.round((res.duration || 0) / 1000)))
      setAudioPath(res.tempFilePath || '')
      setTask(null)
      setResult(null)
    })
    recorder.onError((err) => {
      console.error('[AimeVoice] recorder error:', err)
      clearRecordTimer()
      setRecording(false)
      Taro.showToast({ title: '录音失败，重新试一下', icon: 'none', duration: 2000 })
    })
    loadTrainText()
    return () => {
      clearRecordTimer()
      try {
        recorder.stop()
      } catch (err) {
        // ignore cleanup stop failures
      }
    }
  }, [loadTrainText])

  useDidHide(stopRecord)
  useUnload(stopRecord)

  const startRecord = async () => {
    if (recording) return
    if (!activeText) {
      Taro.showToast({ title: '先等训练文本加载出来', icon: 'none', duration: 2000 })
      return
    }

    try {
      await Taro.authorize({ scope: 'scope.record' })
    } catch (err) {
      Taro.showModal({
        title: '需要麦克风权限',
        content: '打开麦克风权限后才能录制复刻声音。',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) Taro.openSetting()
        },
      })
      return
    }

    setAudioPath('')
    setTask(null)
    setResult(null)
    setRecordSec(0)
    setRecording(true)
    clearRecordTimer()
    timerRef.current = setInterval(() => setRecordSec((value) => value + 1), 1000)
    recorderRef.current?.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3',
    })
  }

  const submitTraining = async () => {
    if (submitting) return
    if (!audioPath) {
      Taro.showToast({ title: '先录一段声音', icon: 'none', duration: 2000 })
      return
    }
    setSubmitting(true)
    try {
      const data = await uploadVoiceCloneAudio({
        filePath: audioPath,
        textId: activeTextId,
        textSegId: activeTextSegId,
      })
      setTask(data)
      setResult(null)
      Taro.showToast({ title: '已提交训练', icon: 'none', duration: 2000 })
    } catch (err) {
      console.error('[AimeVoice] submit error:', err)
      Taro.showToast({ title: (err?.message || err?.errMsg || '提交失败，稍后再试').slice(0, 30), icon: 'none', duration: 3000 })
    } finally {
      setSubmitting(false)
    }
  }

  const checkResult = async () => {
    if (checking) return
    const taskId = task?.taskId || result?.taskId
    if (!taskId) {
      Taro.showToast({ title: '还没有训练任务', icon: 'none', duration: 2000 })
      return
    }
    setChecking(true)
    try {
      const data = await requestJson({
        url: `${paths.voiceClone.result}?taskId=${encodeURIComponent(taskId)}`,
        method: 'GET',
      })
      setResult(data)
      if (data.assetId) {
        Taro.showToast({ title: '声音训练完成', icon: 'success', duration: 2000 })
      } else if (data.failedDesc) {
        Taro.showToast({ title: '训练失败，重新录一次', icon: 'none', duration: 2000 })
      } else {
        Taro.showToast({ title: '还在训练中', icon: 'none', duration: 2000 })
      }
    } catch (err) {
      console.error('[AimeVoice] result error:', err)
      Taro.showToast({ title: '查询失败，稍后再试', icon: 'none', duration: 2000 })
    } finally {
      setChecking(false)
    }
  }

  return (
    <View className='aime-page aime-voice'>
      <View className='aime-voice-head'>
        <Text className='aime-kicker'>Voice Clone</Text>
        <Text className='aime-title'>声音训练</Text>
        <Text className='aime-subtitle'>照着文本自然读一遍，训练成功后“我在这儿”的回复会使用这个复刻声音。</Text>
      </View>

      <ScrollView className='aime-voice-scroll' scrollY enhanced showScrollbar={false}>
        <View className='aime-voice-card'>
          <View className='aime-voice-card-head'>
            <Text className='aime-voice-label'>训练文本</Text>
            <Text className='aime-voice-refresh' onClick={loadTrainText}>{loadingText ? '加载中' : '刷新'}</Text>
          </View>
          {segments.length > 1 && (
            <View className='aime-voice-segments'>
              {segments.map((segment, index) => (
                <View
                  key={getVoiceSegmentId(segment, index)}
                  className={`aime-voice-segment ${index === selectedIndex ? 'aime-voice-segment--active' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <Text>{index + 1}</Text>
                </View>
              ))}
            </View>
          )}
          <Text className='aime-voice-text'>{activeText || '正在加载讯飞训练文本...'}</Text>
        </View>

        <View className='aime-voice-card'>
          <Text className='aime-voice-label'>录音</Text>
          <Text className='aime-voice-hint'>尽量安静、自然、完整地读上面的文本，录完后提交训练。</Text>
          <View className='aime-voice-meter'>
            <Text>{recording ? `录音中 ${recordSec}s` : audioPath ? `已录制 ${recordSec}s` : '还没有录音'}</Text>
          </View>
          <View className='aime-voice-actions'>
            <View className={`aime-voice-action ${recording ? 'aime-voice-action--danger' : ''}`} onClick={recording ? stopRecord : startRecord}>
              <Text>{recording ? '停止录音' : '开始录音'}</Text>
            </View>
            <View className={`aime-voice-action aime-voice-action--primary ${(!audioPath || submitting) ? 'aime-voice-action--disabled' : ''}`} onClick={submitTraining}>
              <Text>{submitting ? '提交中' : '提交训练'}</Text>
            </View>
          </View>
        </View>

        {(task || result) && (
          <View className='aime-voice-card'>
            <Text className='aime-voice-label'>训练任务</Text>
            <Text className='aime-voice-info'>任务ID：{task?.taskId || result?.taskId}</Text>
            {result?.trainStatus !== undefined && <Text className='aime-voice-info'>状态：{result.trainStatus}</Text>}
            {result?.assetId && <Text className='aime-voice-success'>已生成音色：{result.assetId}</Text>}
            {result?.failedDesc && <Text className='aime-voice-error'>{result.failedDesc}</Text>}
            <View className={`aime-voice-action aime-voice-action--primary ${checking ? 'aime-voice-action--disabled' : ''}`} onClick={checkResult}>
              <Text>{checking ? '查询中' : '查询训练结果'}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

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
      </View>
    </View>
  )
}

const AimeTimeDivider = ({ value }) => (
  <View className='aime-time-divider'>
    <Text>{value}</Text>
  </View>
)

export const ChatScreen = ({ mode }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [hasMoreHistory, setHasMoreHistory] = useState(false)
  const [scrollIntoView, setScrollIntoView] = useState('')
  const timerRef = useRef(null)
  const streamingRef = useRef(null)
  const loadingRef = useRef(false)
  const loadingOlderRef = useRef(false)
  const isTraining = mode === 'training'

  const clearTypewriter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const scrollToBottom = useCallback(() => {
    setScrollIntoView('aime-chat-bottom')
    setTimeout(() => setScrollIntoView(''), 260)
    setTimeout(() => setScrollIntoView('aime-chat-bottom'), 320)
    setTimeout(() => setScrollIntoView(''), 560)
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
    const createdAt = reply.createdAt || new Date().toISOString()
    setMessages((prev) => [...prev, { id, text: '', sender: 'ai', time: makeTime(createdAt), createdAt, streaming: true }])

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
    } catch (err) {
      console.error('[Aime] history error:', err)
      setMessages(fallbackMessages(mode))
    } finally {
      setLoading(false)
      loadingRef.current = false
      setTimeout(scrollToBottom, 80)
    }
  }, [mode, scrollToBottom])

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
        scrollIntoView={scrollIntoView}
        upperThreshold={80}
        onScrollToUpper={loadOlderHistory}
      >
        {loadingOlder && (
          <View className='aime-history-loading'>
            <Text>正在找更早的对话...</Text>
          </View>
        )}
        {messages.map((message, index) => (
          <Fragment key={message.id}>
            {shouldShowMessageTime(messages, index) && <AimeTimeDivider value={makeWechatTime(message.createdAt)} />}
            <ChatMessage message={message} mode={mode} onStop={interrupt} />
          </Fragment>
        ))}
        {loading && (
          <View className='aime-thinking'>
            <View className='aime-thinking-bubble'>
              <View />
              <View />
              <View />
            </View>
          </View>
        )}
        <View id='aime-chat-bottom' className='aime-bottom-space' />
      </ScrollView>

      <ChatInput
        onSendMessage={sendMessage}
        onSendImage={sendImage}
        onInterrupt={interrupt}
        onInputFocus={scrollToBottom}
        onVoicePressStart={scrollToBottom}
      />
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
