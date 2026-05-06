import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontalIcon, MicIcon, KeyboardIcon, MoreHorizontalIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage?: (text: string, isAudio?: boolean, duration?: number) => void;
}

type InputMode = 'keyboard' | 'voice';

// Threshold in pixels to trigger cancel state when sliding up
const CANCEL_THRESHOLD = 80;

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage = () => console.log('onSendMessage not provided'),
}) => {
  const [mode, setMode] = useState<InputMode>('keyboard');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const timerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pressStartYRef = useRef<number>(0);
  const isPressedRef = useRef(false);

  console.log('ChatInput rendered, mode:', mode, 'isRecording:', isRecording);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Text input handlers ──────────────────────────────────────────
  const handleSendText = () => {
    if (!inputText.trim()) return;
    console.log('Sending text message:', inputText.trim());
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // ── Voice press handlers ─────────────────────────────────────────
  const startRecording = (startY: number) => {
    isPressedRef.current = true;
    pressStartYRef.current = startY;
    setIsRecording(true);
    setIsCancelling(false);
    console.log('Voice recording started at Y:', startY);
  };

  const updateSlide = (currentY: number) => {
    if (!isPressedRef.current) return;
    const deltaY = pressStartYRef.current - currentY;
    const shouldCancel = deltaY > CANCEL_THRESHOLD;
    setIsCancelling(shouldCancel);
    console.log('Slide delta:', deltaY, 'cancelling:', shouldCancel);
  };

  const stopRecording = (cancelled: boolean) => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    setIsRecording(false);
    setIsCancelling(false);

    if (cancelled) {
      console.log('Voice recording cancelled');
    } else {
      console.log('Voice message sent, duration:', recordingTime, 's');
      if (recordingTime > 0) {
        onSendMessage('Audio message', true, recordingTime);
      }
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startRecording(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    updateSlide(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopRecording(isCancelling);
  };

  // Mouse events (desktop preview)
  const handleMouseDown = (e: React.MouseEvent) => {
    startRecording(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPressedRef.current) return;
    updateSlide(e.clientY);
  };

  const handleMouseUp = () => {
    stopRecording(isCancelling);
  };

  const handleMouseLeave = () => {
    if (isPressedRef.current) stopRecording(isCancelling);
  };

  // ── Toggle mode ──────────────────────────────────────────────────
  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'keyboard' ? 'voice' : 'keyboard';
      console.log('Input mode toggled to:', next);
      return next;
    });
  };

  // ── Voice button visual state ────────────────────────────────────
  const voiceBtnBg = isCancelling
    ? 'rgba(248, 71, 33, 0.15)'
    : isRecording
    ? 'rgba(115, 44, 255, 0.12)'
    : 'rgba(250, 250, 251, 1)';

  const voiceBtnBorder = isCancelling
    ? 'rgba(248, 71, 33, 1)'
    : isRecording
    ? 'rgba(115, 44, 255, 1)'
    : 'rgba(233, 233, 233, 1)';

  const voiceBtnTextColor = isCancelling
    ? 'rgba(248, 71, 33, 1)'
    : isRecording
    ? 'rgba(115, 44, 255, 1)'
    : 'rgba(10, 17, 32, 1)';

  return (
    <div
      data-cmp="ChatInput"
      style={{ background: 'rgba(255,255,255,1)', borderTop: '1px solid rgba(233,233,233,1)' }}
      className="px-3 pt-2 pb-3 select-none"
    >
      {/* ── Recording overlay hint ── */}
      <div
        style={{
          opacity: isRecording ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s',
          position: 'absolute',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            background: isCancelling ? 'rgba(248, 71, 33, 0.9)' : 'rgba(20,20,20,0.82)',
            borderRadius: '16px',
            padding: '14px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            minWidth: '180px',
          }}
        >
          {/* Waveform animation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '28px' }}>
            {[0.6, 1, 0.7, 1.2, 0.5, 1, 0.8].map((h, i) => (
              <div
                key={i}
                style={{
                  width: '4px',
                  borderRadius: '2px',
                  background: isCancelling ? 'rgba(255,255,255,0.9)' : 'rgba(115,44,255,1)',
                  height: `${h * 18}px`,
                  animation: isRecording && !isCancelling
                    ? `waveBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`
                    : 'none',
                }}
              />
            ))}
          </div>

          <span style={{ color: 'rgba(255,255,255,1)', fontSize: '13px', fontWeight: 600 }}>
            {isCancelling ? '松开取消' : `${formatTime(recordingTime)} 松开发送`}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>
            {isCancelling ? '已取消' : '上滑取消'}
          </span>
        </div>
      </div>

      {/* ── Keyframe for wave animation ── */}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>

      {/* ── Input row ── */}
      <div className="flex items-end" style={{ gap: '8px' }}>
        {/* Voice / Keyboard toggle */}
        <button
          onClick={toggleMode}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid rgba(233,233,233,1)',
            background: 'rgba(250,250,251,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'rgba(137,140,147,1)',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {mode === 'keyboard' ? (
            <MicIcon size={20} />
          ) : (
            <KeyboardIcon size={20} />
          )}
        </button>

        {/* Main input area */}
        <div className="flex-1" style={{ minWidth: 0 }}>
          {/* Keyboard mode */}
          <div style={{ display: mode === 'keyboard' ? 'flex' : 'none', alignItems: 'flex-end' }}>
            <div
              style={{
                flex: 1,
                background: 'rgba(250,250,251,1)',
                border: '1px solid rgba(233,233,233,1)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'flex-end',
                minHeight: '38px',
                overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}
              onFocus={() => {}}
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="输入消息..."
                rows={1}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  padding: '9px 14px',
                  fontSize: '15px',
                  lineHeight: '1.4',
                  maxHeight: '120px',
                  color: 'rgba(10,17,32,1)',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Voice mode — 按住说话 button */}
          <div style={{ display: mode === 'voice' ? 'block' : 'none' }}>
            <button
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '20px',
                border: `1.5px solid ${voiceBtnBorder}`,
                background: voiceBtnBg,
                color: voiceBtnTextColor,
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <MicIcon size={16} />
              {isRecording
                ? isCancelling ? '松开取消' : '松开发送'
                : '按住 说话'}
            </button>
          </div>
        </div>

        {/* Send button (keyboard mode only) / More button (voice mode) */}
        {mode === 'keyboard' && inputText.trim() ? (
          <button
            onClick={handleSendText}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(115,44,255,1)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'rgba(255,255,255,1)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <SendHorizontalIcon size={18} />
          </button>
        ) : (
          <button
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid rgba(233,233,233,1)',
              background: 'rgba(250,250,251,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'rgba(137,140,147,1)',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontalIcon size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;