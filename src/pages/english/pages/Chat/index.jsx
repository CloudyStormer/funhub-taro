import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import styles from './index.module.scss'

const makeTime = (offsetMin = 0) => {
  const d = new Date(Date.now() - offsetMin * 60 * 1000)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const initialMessages = [
  {
    id: '1',
    text: "Hello! I'm your AI English tutor. We're going to practice the vocabulary from your selected scene. Ready to begin?",
    sender: 'ai',
    time: makeTime(5),
  },
  {
    id: '2',
    text: "Hi! I'm ready. Let's start!",
    sender: 'user',
    time: makeTime(4),
  },
  {
    id: '3',
    text: "Excellent! I'll play the role of your business partner. Let's start:\n\n\"Good morning! Shall we begin the negotiation?\"",
    sender: 'ai',
    time: makeTime(3),
  },
]

const AI_REPLIES = [
  "That's great! Your vocabulary usage is accurate. Try to use 'leverage' in your next sentence.",
  "Well done! Just a small tip — 'would like' sounds more polite than 'want' in formal contexts.",
  "Excellent pronunciation! Let's move on to the next scenario.",
  "Perfect sentence structure! Now try to expand on that thought.",
  "Great effort! Keep practicing and your fluency will improve quickly.",
]

const Chat = ({ onBack, sceneTitle = 'Business English' }) => {
  const [messages, setMessages] = useState(initialMessages)
  const [lastMsgId, setLastMsgId] = useState('msg-3')

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last) setLastMsgId(`msg-${last.id}`)
  }, [messages])

  const handleSend = (text, isAudio, duration) => {
    const now = makeTime()
    const uid = Date.now().toString()

    const userMsg = { id: uid, text, sender: 'user', time: now, isAudio, audioDuration: duration }
    setMessages(prev => [...prev, userMsg])

    setTimeout(() => {
      const reply = isAudio
        ? "Great effort with your pronunciation! I could hear your message clearly. Let's continue!"
        : AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)]
      const aiMsg = { id: (Date.now() + 1).toString(), text: reply, sender: 'ai', time: makeTime() }
      setMessages(prev => [...prev, aiMsg])
    }, 1500)
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
          <Text className={styles.subtitle}>Always listening</Text>
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

        <View id={lastMsgId} style={{ height: '8px' }} />
      </ScrollView>

      {/* Input */}
      <ChatInput onSendMessage={handleSend} />
    </View>
  )
}

export default Chat
