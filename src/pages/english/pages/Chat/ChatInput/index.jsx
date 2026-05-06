import React, { useState, useRef, useEffect } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { transcribeAudio } from '../../../utils/asr'
import styles from './index.module.scss'

const CANCEL_THRESHOLD = 80

// RecorderManager 为单例，组件外初始化一次
const recManager = Taro.getRecorderManager()

const ChatInput = ({ onSendMessage = () => {} }) => {
  const [mode, setMode]                   = useState('keyboard')
  const [inputText, setInputText]         = useState('')
  const [isRecording, setIsRecording]     = useState(false)
  const [isCancelling, setIsCancelling]   = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordSec, setRecordSec]         = useState(0)
  const [errMsg, setErrMsg]               = useState('')

  const timerRef    = useRef(null)
  const pressStartY = useRef(0)
  const isPressed   = useRef(false)
  const cancelRef   = useRef(false)   // 同步副本，供 onStop 回调使用

  /* ── 录音计时 ── */
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordSec(p => p + 1), 1000)
    } else {
      clearInterval(timerRef.current)
      setRecordSec(0)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  /* ── RecorderManager 事件绑定（组件挂载时一次） ── */
  useEffect(() => {
    recManager.onStart(() => {
      setIsRecording(true)
      setErrMsg('')
    })

    recManager.onStop(async ({ tempFilePath }) => {
      setIsRecording(false)

      if (cancelRef.current) {
        cancelRef.current = false
        return
      }

      if (!tempFilePath) {
        setErrMsg('录音文件丢失')
        return
      }

      // 转写中
      setIsTranscribing(true)
      try {
        const text = await transcribeAudio(tempFilePath)
        if (text?.trim()) {
          onSendMessage(text.trim(), false)   // 转译后当普通文本发送
        } else {
          setErrMsg('未识别到内容')
        }
      } catch (e) {
        console.error('ASR error', e)
        setErrMsg('识别失败，请重试')
      } finally {
        setIsTranscribing(false)
      }
    })

    recManager.onError((err) => {
      setIsRecording(false)
      setIsTranscribing(false)
      setErrMsg(err.errMsg || '录音出错')
    })
  }, [])

  /* ── 格式化秒数 ── */
  const fmt = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  /* ── 文字发送 ── */
  const handleSendText = () => {
    if (!inputText.trim()) return
    onSendMessage(inputText.trim())
    setInputText('')
  }

  /* ── 按住开始录音 ── */
  const onTouchStart = (e) => {
    isPressed.current   = true
    cancelRef.current   = false
    pressStartY.current = e.touches[0].clientY
    setIsCancelling(false)
    recManager.start({
      duration:       60000,
      format:         'amr',   // 百度 ASR 支持 amr + 8000Hz
      sampleRate:     8000,
      numberOfChannels: 1,
      encodeBitRate:  18000,
    })
  }

  /* ── 滑动判断取消 ── */
  const onTouchMove = (e) => {
    if (!isPressed.current) return
    const cancel = pressStartY.current - e.touches[0].clientY > CANCEL_THRESHOLD
    setIsCancelling(cancel)
    cancelRef.current = cancel
  }

  /* ── 松开停止 ── */
  const onTouchEnd = () => {
    if (!isPressed.current) return
    isPressed.current = false
    setIsCancelling(false)
    recManager.stop()   // 触发 onStop
  }

  /* ── 颜色 ── */
  const vBg     = isCancelling ? 'rgba(248,71,33,0.12)' : isRecording ? 'rgba(115,44,255,0.10)' : 'rgba(250,250,251,1)'
  const vBorder = isCancelling ? 'rgba(248,71,33,1)'    : isRecording ? 'rgba(115,44,255,1)'    : 'rgba(220,220,228,1)'
  const vColor  = isCancelling ? 'rgba(248,71,33,1)'    : isRecording ? 'rgba(115,44,255,1)'    : 'rgba(10,17,32,1)'

  return (
    <View className={styles.wrap}>
      {/* 录音悬浮提示 */}
      {isRecording && (
        <View className={styles.recOverlay}>
          <View className={`${styles.recCard} ${isCancelling ? styles.recCancel : ''}`}>
            <View className={styles.waveform}>
              {[0.6, 1, 0.7, 1.3, 0.5, 1, 0.8].map((h, i) => (
                <View
                  key={i}
                  className={`${styles.waveBar} ${isCancelling ? '' : styles.waveAnim}`}
                  style={{ height: `${h * 18}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </View>
            <Text className={styles.recTime}>{fmt(recordSec)} 松开发送</Text>
            <Text className={styles.recHint}>{isCancelling ? '松开取消' : '上滑取消'}</Text>
          </View>
        </View>
      )}

      {/* 转写中 Toast */}
      {isTranscribing && (
        <View className={styles.transcribingToast}>
          <Text className={styles.toastText}>🔄 语音转文字中…</Text>
        </View>
      )}

      {/* 错误提示（3s 后自动消失可自行加 useEffect） */}
      {errMsg ? (
        <View className={styles.errBar}>
          <Text className={styles.errText}>{errMsg}</Text>
        </View>
      ) : null}

      {/* 输入行 */}
      <View className={styles.row}>
        {/* 模式切换 */}
        <View
          className={styles.iconBtn}
          onClick={() => setMode(p => p === 'keyboard' ? 'voice' : 'keyboard')}
        >
          <Text style={{ fontSize: '18px' }}>{mode === 'keyboard' ? '🎤' : '⌨️'}</Text>
        </View>

        {/* 主体 */}
        <View className={styles.inputMain}>
          {mode === 'keyboard' ? (
            <View className={styles.textareaBox}>
              <Textarea
                className={styles.textarea}
                value={inputText}
                onInput={(e) => setInputText(e.detail.value)}
                placeholder="输入消息..."
                autoHeight
                maxlength={500}
                placeholderStyle="color:rgba(180,180,195,1);font-size:14px"
              />
            </View>
          ) : (
            <View
              className={styles.voiceBtn}
              style={{ background: vBg, borderColor: vBorder }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Text style={{ fontSize: '14px' }}>🎤</Text>
              <Text style={{ color: vColor, fontSize: '14px', fontWeight: '600' }}>
                {isRecording
                  ? (isCancelling ? '松开取消' : '松开发送')
                  : isTranscribing ? '转换中…' : '按住 说话'}
              </Text>
            </View>
          )}
        </View>

        {/* 发送 / 更多 */}
        {mode === 'keyboard' && inputText.trim() ? (
          <View className={`${styles.iconBtn} ${styles.sendBtn}`} onClick={handleSendText}>
            <Text style={{ color: 'rgb(255,255,255)', fontSize: '16px' }}>▶</Text>
          </View>
        ) : (
          <View className={styles.iconBtn}>
            <Text style={{ fontSize: '20px', color: 'rgb(148,163,184)', letterSpacing: '-2px' }}>···</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default ChatInput
