import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { componentById } from '../../data/components'
import { askTutor, type TutorMessage } from '../../services/tutor'
import { useLabStore } from '../../store/labStore'

type RecognitionResultEvent = { results: ArrayLike<{ 0: { transcript: string }; isFinal?: boolean }> }
type Recognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: RecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type Position = { x: number; y: number }

export function TutorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const selected = useLabStore(s => s.selectedComponent)
  const component = componentById[selected]
  const [latest, setLatest] = useState<TutorMessage>({
    role: 'tutor',
    text: `You are exploring the ${component.name}. Speak to ask me anything.`,
  })
  const [busy, setBusy] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [listenEnabled, setListenEnabled] = useState(false)
  const [recognizing, setRecognizing] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 24, y: 150 })

  const recognition = useRef<Recognition | null>(null)
  const listenWanted = useRef(false)
  const face = useRef<HTMLDivElement>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const lastSpoken = useRef('')

  useEffect(() => {
    setLatest({
      role: 'tutor',
      text: `You are exploring the ${component.name}. Speak to ask me anything.`,
    })
    lastSpoken.current = ''
  }, [selected, component.name])

  useEffect(() => {
    if (open)
      setPosition(value =>
        value.x === 24 && value.y === 150 ? { x: Math.max(12, window.innerWidth - 150), y: 150 } : value
      )
  }, [open])

  const getRecognition = useCallback(() => {
    const speechWindow = window as unknown as {
      SpeechRecognition?: new () => Recognition
      webkitSpeechRecognition?: new () => Recognition
    }
    const RecognitionClass = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition
    if (!RecognitionClass) return null
    const instance = new RecognitionClass()
    instance.continuous = true
    instance.interimResults = true
    instance.lang = 'en-US'
    return instance
  }, [])

  const send = useCallback(
    async (text: string) => {
      const question = text.trim()
      if (!question || busy) return
      setLatest({ role: 'student', text: question })
      setBusy(true)
      try {
        const result = await askTutor(selected, question)
        const message: TutorMessage = { role: 'tutor', text: result.answer }
        setLatest(message)
        if (voiceEnabled) {
          const utterance = new SpeechSynthesisUtterance(result.answer)
          utterance.onstart = () => setSpeaking(true)
          utterance.onend = () => setSpeaking(false)
          lastSpoken.current = result.answer
          window.speechSynthesis?.speak(utterance)
        }
      } catch (error) {
        setLatest({ role: 'tutor', text: String(error) })
      } finally {
        setBusy(false)
      }
    },
    [selected, busy, voiceEnabled]
  )

  const beginListening = useCallback(() => {
    if (!listenWanted.current || recognition.current || speaking) return
    const instance = getRecognition()
    if (!instance) {
      listenWanted.current = false
      setListenEnabled(false)
      return
    }
    recognition.current = instance
    setRecognizing(true)
    instance.onresult = event => {
      let interim = ''
      for (let i = event.results.length - 1; i >= 0; i--) {
        interim = event.results[i][0]?.transcript || ''
        if (event.results[i]?.isFinal) break
      }
      if (interim && interim !== lastSpoken.current) {
        lastSpoken.current = interim
      }
    }
    instance.onend = () => {
      setRecognizing(false)
      recognition.current = null
      if (listenWanted.current && listenEnabled) {
        window.setTimeout(() => beginListening(), 100)
      }
    }
    instance.onerror = () => {
      setRecognizing(false)
      recognition.current = null
    }
    instance.start()
  }, [getRecognition, speaking, listenEnabled])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('smaj:nova-state', {
        detail: { state: speaking ? 'speaking' : recognizing ? 'listening' : 'idle' },
      })
    )
  }, [speaking, recognizing])

  useEffect(() => {
    listenWanted.current = listenEnabled
    if (listenEnabled) beginListening()
    else {
      recognition.current?.stop()
      recognition.current = null
      setRecognizing(false)
    }
  }, [listenEnabled, beginListening])

  useEffect(() => {
    if (!open) {
      listenWanted.current = false
      recognition.current?.stop()
      recognition.current = null
      window.speechSynthesis?.cancel()
      setSpeaking(false)
      setRecognizing(false)
      return
    }
    if (!voiceEnabled || latest.role === 'student') {
      setListenEnabled(false)
      return
    }
    setListenEnabled(true)
  }, [open, voiceEnabled, latest])

  useEffect(() => {
    const follow = (event: PointerEvent) => {
      const node = face.current
      if (!node) return
      const box = node.getBoundingClientRect()
      const dx = Math.max(-3, Math.min(3, (event.clientX - (box.left + box.width / 2)) / 30))
      const dy = Math.max(-3, Math.min(3, (event.clientY - (box.top + box.height / 2)) / 30))
      node.style.setProperty('--eye-x', `${dx}px`)
      node.style.setProperty('--eye-y', `${dy}px`)
    }
    window.addEventListener('pointermove', follow)
    return () => window.removeEventListener('pointermove', follow)
  }, [])

  useEffect(
    () => () => {
      listenWanted.current = false
      recognition.current?.stop()
      window.speechSynthesis?.cancel()
    },
    []
  )

  const toggleListen = () => {
    listenWanted.current = !listenEnabled
    setListenEnabled(value => !value)
  }

  const toggleVoice = () => {
    if (voiceEnabled) {
      window.speechSynthesis?.cancel()
      setSpeaking(false)
    } else {
      lastSpoken.current = ''
    }
    setVoiceEnabled(value => !value)
  }

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    drag.current = { dx: event.clientX - position.x, dy: event.clientY - position.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!drag.current) return
    setPosition({
      x: Math.max(8, Math.min(window.innerWidth - 126, event.clientX - drag.current.dx)),
      y: Math.max(58, Math.min(window.innerHeight - 58, event.clientY - drag.current.dy)),
    })
  }

  const endDrag = () => {
    drag.current = null
  }

  if (!open) return null

  return (
    <aside
      className="ai-orb"
      aria-label="AI learning tutor"
      style={{ left: position.x, top: position.y }}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="ai-orb-face" ref={face}>
        <div className="ai-orb-eye ai-orb-eye-left" />
        <div className="ai-orb-eye ai-orb-eye-right" />
      </div>

      <div className="ai-orb-message">
        <div className={`message message-${latest.role}`}>{latest.text}</div>
      </div>

      <div className="ai-orb-controls">
        <button
          onClick={toggleListen}
          disabled={busy}
          title={listenEnabled ? 'Stop listening' : 'Start listening'}
          className={listenEnabled ? 'active' : ''}
        >
          {recognizing ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={toggleVoice}
          title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
          className={voiceEnabled ? 'active' : ''}
        >
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button onClick={onClose} title="Close tutor" className="close-button">
          <X size={20} />
        </button>
      </div>
    </aside>
  )
}
