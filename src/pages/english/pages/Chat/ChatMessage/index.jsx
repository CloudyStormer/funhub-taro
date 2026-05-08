import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user'

  return (
    <View id={`msg-${message.id}`} className={`${styles.row} ${isUser ? styles.rowUser : styles.rowAi}`}>
      {/* Avatar */}
      <View className={`${styles.avatar} ${isUser ? styles.avatarUser : styles.avatarAi}`}>
        <Text style={{ fontSize: '14px' }}>{isUser ? '👤' : '🤖'}</Text>
      </View>

      {/* Bubble + timestamp */}
      <View className={styles.bubbleWrap}>
        <View className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi}`}>
          {message.isAudio ? (
            <View className={styles.audioMsg}>
              <Text className={`${styles.audioIcon} ${isUser ? styles.audioIconUser : ''}`}>🔊</Text>
              <View className={`${styles.waveBar} ${isUser ? styles.waveBarUser : ''}`} />
              <Text className={`${styles.audioDur} ${isUser ? styles.audioDurUser : ''}`}>
                {message.audioDuration}s
              </Text>
            </View>
          ) : (
            <Text className={`${styles.msgText} ${isUser ? styles.msgTextUser : styles.msgTextAi}`}>
              {message.text}
            </Text>
          )}
        </View>
        <Text className={`${styles.time} ${isUser ? styles.timeUser : ''}`}>
          {message.time}
        </Text>
      </View>
    </View>
  )
}

export default ChatMessage
