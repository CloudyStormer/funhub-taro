import React, { useState, useRef, useEffect, memo } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { transcribeAudio } from '../../pages/english/utils/asr'
import { isVoiceQuotaError, showVoiceQuotaToast, toVoiceErrorMessage } from '../../utils/voiceError'
import styles from './index.module.scss'

const CANCEL_THRESHOLD = 80
const LONG_PRESS_DELAY = 250

const ChatInput = ({ onSendMessage = () => {}, onSendImage = () => {}, onInterrupt = () => {} }) => {
  const [mode, setMode]                     = useState('keyboard')
  const [inputText, setInputText]           = useState('')
  const [isRecording, setIsRecording]       = useState(false)
  const [isCancelling, setIsCancelling]     = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isPickingImage, setIsPickingImage] = useState(false)
  const [recordSec, setRecordSec]           = useState(0)

  // ref：不受闭包陈旧值影响
  const hasMicPerm   = useRef(false)
  const timerRef     = useRef(null)
  const pressTimerRef = useRef(null)
  const pressStartY  = useRef(0)
  const isPressed    = useRef(false)
  const hasStartedRecording = useRef(false)
  const cancelRef    = useRef(false)
  const rmRef        = useRef(null)   // RecorderManager 懒初始化

  /* ── 挂载时初始化 RecorderManager 并预检权限 ── */
  useEffect(() => {
    const rm = Taro.getRecorderManager()
    rmRef.current = rm

    rm.onStart(() => {
      setIsRecording(true)
      setRecordSec(0)
    })

    rm.onStop(async ({ tempFilePath }) => {
      setIsRecording(false)
      if (cancelRef.current) { cancelRef.current = false; return }
      if (!tempFilePath) {
        Taro.showToast({ title: '录音文件丢失', icon: 'none', duration: 2000 })
        return
      }
      setIsTranscribing(true)
      try {
        const text = await transcribeAudio(tempFilePath)
        if (text?.trim()) {
          onSendMessage(text.trim(), false)
        } else {
          Taro.showToast({ title: '未识别到内容，请重试', icon: 'none', duration: 2000 })
        }
      } catch (e) {
        console.error('ASR error', e)
        if (isVoiceQuotaError(e)) {
          showVoiceQuotaToast(Taro)
        } else {
          Taro.showToast({ title: toVoiceErrorMessage(e).slice(0, 30), icon: 'none', duration: 2000 })
        }
      } finally {
        setIsTranscribing(false)
      }
    })

    rm.onError((err) => {
      setIsRecording(false)
      hasStartedRecording.current = false
      Taro.showToast({ title: err.errMsg || '录音出错', icon: 'none', duration: 2000 })
    })

    // 预检：已授权则直接标记
    Taro.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record']) {
          hasMicPerm.current = true
        }
      },
    })
  }, [])

  /* ── 录音计时 ── */
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordSec(p => p + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  useEffect(() => () => clearTimeout(pressTimerRef.current), [])

  const fmt = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  /* ── 文字发送 ── */
  const handleSendText = () => {
    if (!inputText.trim()) return
    onSendMessage(inputText.trim())
    setInputText('')
  }

  const compressImage = async (filePath) => {
    try {
      const res = await Taro.compressImage({
        src: filePath,
        quality: 55,
      })
      return res?.tempFilePath || filePath
    } catch (err) {
      console.warn('compress image failed, use original:', err)
      return filePath
    }
  }

  const pickImage = async () => {
    if (isRecording || isTranscribing || isPickingImage) return
    onInterrupt()
    setIsPickingImage(true)
    try {
      let filePath = ''
      if (Taro.chooseMedia) {
        const res = await Taro.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          sizeType: ['compressed'],
        })
        filePath = res?.tempFiles?.[0]?.tempFilePath || ''
      } else {
        const res = await Taro.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
          sizeType: ['compressed'],
        })
        filePath = res?.tempFilePaths?.[0] || ''
      }
      if (!filePath) return
      const compressedPath = await compressImage(filePath)
      onSendImage(compressedPath)
    } catch (err) {
      if (!String(err?.errMsg || '').includes('cancel')) {
        Taro.showToast({ title: '图片选择失败，请重试', icon: 'none', duration: 2000 })
      }
    } finally {
      setIsPickingImage(false)
    }
  }

  /* ── 切换模式：切到语音时申请权限 ── */
  const toggleMode = () => {
    const next = mode === 'keyboard' ? 'voice' : 'keyboard'
    if (next === 'voice' && !hasMicPerm.current) {
      Taro.authorize({ scope: 'scope.record' })
        .then(() => {
          hasMicPerm.current = true
          setMode('voice')
        })
        .catch(() => {
          Taro.showModal({
            title: '需要麦克风权限',
            content: '请在设置中开启麦克风权限以使用语音功能',
            confirmText: '去设置',
            success: (res) => { if (res.confirm) Taro.openSetting() },
          })
        })
    } else {
      setMode(next)
    }
  }

  const startRecording = () => {
    if (!isPressed.current || !rmRef.current || hasStartedRecording.current) return
    hasStartedRecording.current = true
    setIsCancelling(cancelRef.current)
    Taro.vibrateShort()   // 振动反馈，确认长按开始录音
    rmRef.current.start({
      duration:         60000,
      format:           'pcm',
      sampleRate:       16000,
      numberOfChannels: 1,
    })
  }

  const blockTouchScroll = (e) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
  }

  /* ── 触摸事件：长按后才启动录音，短按不弹出“松开发送” ── */
  const onTouchStart = (e) => {
    if (!hasMicPerm.current || !rmRef.current || isTranscribing) return
    blockTouchScroll(e)
    onInterrupt()            // 中断打字机动画 + 停止TTS播放
    clearTimeout(pressTimerRef.current)
    isPressed.current          = true
    hasStartedRecording.current = false
    cancelRef.current          = false
    pressStartY.current        = e.touches[0].clientY
    setIsCancelling(false)
    pressTimerRef.current = setTimeout(startRecording, LONG_PRESS_DELAY)
  }

  const onTouchMove = (e) => {
    if (!isPressed.current) return
    blockTouchScroll(e)
    const cancel = pressStartY.current - e.touches[0].clientY > CANCEL_THRESHOLD
    cancelRef.current = cancel
    if (hasStartedRecording.current) {
      setIsCancelling(cancel)
    }
  }

  const onTouchEnd = (e) => {
    if (!isPressed.current) return
    blockTouchScroll(e)
    clearTimeout(pressTimerRef.current)
    isPressed.current = false
    if (!hasStartedRecording.current) return
    hasStartedRecording.current = false
    setIsCancelling(false)
    rmRef.current?.stop()
  }

  /* ── 颜色 ── */
  const vBg     = isCancelling ? 'rgba(248,71,33,0.12)' : isRecording ? 'rgba(115,44,255,0.10)' : 'rgba(250,250,251,1)'
  const vBorder = isCancelling ? 'rgba(248,71,33,1)'    : isRecording ? 'rgba(115,44,255,1)'    : 'rgba(220,220,228,1)'
  const vColor  = isCancelling ? 'rgba(248,71,33,1)'    : isRecording ? 'rgba(115,44,255,1)'    : 'rgba(10,17,32,1)'

  return (
    <View
      className={styles.wrap}
      catchMove={isPressed.current || isRecording}
      onTouchMove={isPressed.current || isRecording ? blockTouchScroll : undefined}
    >
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

      {/* 输入行 */}
      <View className={styles.row}>
        <View className={styles.iconBtn} onClick={toggleMode}>
          <Text style={{ fontSize: '18px' }}>{mode === 'keyboard' ? '🎤' : '⌨️'}</Text>
        </View>

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
              catchMove
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
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

        {mode === 'keyboard' && inputText.trim() ? (
          <View className={`${styles.iconBtn} ${styles.sendBtn}`} onClick={handleSendText}>
            <Text style={{ color: 'rgb(255,255,255)', fontSize: '16px' }}>▶</Text>
          </View>
        ) : (
          <View className={`${styles.iconBtn} ${styles.imageBtn}`} onClick={pickImage}>
            <Text style={{ fontSize: '20px', color: 'rgb(148,163,184)' }}>{isPickingImage ? '…' : '+'}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default memo(ChatInput)
