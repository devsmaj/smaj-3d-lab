import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { componentById } from '../../data/components'
import { askTutor, NovaError, type NovaContext, type TutorMessage } from '../../services/tutor'
import { useLabStore } from '../../store/labStore'

type RecognitionResultEvent = { results: ArrayLike<{ 0: { transcript: string }; isFinal?: boolean }> }
type RecognitionErrorEvent = { error?: string; message?: string }
type Recognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: RecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
type Position = { x: number; y: number }
type Props = { open: boolean; onClose: () => void; exploded: boolean; tracking: boolean; gesture: string | null }

export function TutorPanel({ open, onClose, exploded, tracking, gesture }: Props) {
  const selected = useLabStore(s => s.selectedComponent)
  const visited = useLabStore(s => s.visited)
  const quizResults = useLabStore(s => s.quizResults)
  const component = componentById[selected]

  const intro = () => ({
    role: 'tutor' as const,
    text: `You are exploring the ${component.name}. Speak to ask me anything.`,
  })

  const [messages, setMessages] = useState<TutorMessage[]>([intro()])
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
  const request = useRef<AbortController | null>(null)

  const latest = messages[messages.length - 1] ?? intro()

  const context = useMemo<NovaContext>(
    () => ({
      componentId: selected,
      lesson: component.lesson,
      interactionState: exploded ? 'exploded' : 'assembled',
      handTracking: tracking,
      gesture,
      visited,
      passed: Object.entries(quizResults).filter(([, passed]) => passed).length,
    }),
    [selected, component.lesson, exploded, tracking, gesture, visited, quizResults]
  )

  useEffect(() => {
    setMessages(current => (current.some(message => message.role === 'student') ? current : [intro()]))
    lastSpoken.current = ''
  }, [selected])

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

  const interrupt = useCallback(() => {
    request.current?.abort()
    request.current = null
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setBusy(false)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const question = text.trim()
      if (!question || busy) return

      interrupt()
      const history = messages.slice(-12)
      const controller = new AbortController()
      request.current = controller

      setMessages(current => [...current, { role: 'student', text: question }])
      setBusy(true)

      try {
        const response = await askTutor(question, history, context, controller.signal)
        setMessages(current => [...current, response])

        if (voiceEnabled && response.role === 'tutor') {
          const utterance = new SpeechSynthesisUtterance(response.text)
          utterance.onstart = () => setSpeaking(true)
          utterance.onend = () => setSpeaking(false)
          lastSpoken.current = response.text
          window.speechSynthesis?.speak(utterance)
        }
      } catch (error) {
        if (error instanceof NovaError) {
          setMessages(current => [...current, { role: 'tutor', text: error.message, error: true }])
        }
      } finally {
        setBusy(false)
        if (request.current === controller) request.current = null
      }
    },
    [messages, busy, voiceEnabled, context, interrupt]
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

    instance.onerror = event => {
      console.error('Speech recognition error:', event.error || event.message)
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
      interrupt()
      setRecognizing(false)
      return
    }

    if (busy || latest.error || !voiceEnabled || latest.role === 'student') {
      setListenEnabled(false)
      return
    }

    setListenEnabled(true)
  }, [open, busy, latest, voiceEnabled, interrupt])

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
      request.current?.abort()
      window.speechSynthesis?.cancel()
    },
    []
  )

  const toggleListen = () => {
    if (speaking || busy) {
      interrupt()
      listenWanted.current = true
      setListenEnabled(true)
      window.setTimeout(beginListening, 0)
      return
    }

    listenWanted.current = !listenEnabled
    setListenEnabled(listenWanted.current)
  }

  const toggleVoice = () => {
    if (voiceEnabled) interrupt()
    else lastSpoken.current = ''
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

      <div className="ai-orb-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role}`}>
            {msg.error && <span className="error-icon">⚠️</span>}
            {msg.text}
          </div>
        ))}
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
