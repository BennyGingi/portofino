'use client'

import { useState, useRef, useEffect } from 'react'
import { Analytics } from '@/lib/analytics'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  "What's your security exp?",
  'Tell me about FoodCritic',
  'Are you open to work?',
  "What's your stack?",
]

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function HireBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey 👋 I'm Benny's AI. Ask me about his experience, projects, or availability — I'll give you straight answers.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasUserMessages = messages.some((m) => m.role === 'user')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  async function sendMessage(text?: string) {
    const content = text || input.trim()
    if (!content || isLoading) return

    setInput('')
    setIsLoading(true)

    const userMsg: Message = { role: 'user', content, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    Analytics.trackChatMessage()

    const assistantMsg: Message = { role: 'assistant', content: '', timestamp: new Date() }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!res.ok) throw new Error('API error')
      const text = await res.text()

      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: text,
        }
        return updated
      })
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Something went wrong — reach out to Benny directly via the contact form.',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes hireBotPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes hireBotSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes hireBotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .hirebot-pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid var(--cyan);
          animation: hireBotPulse 2.5s ease-out infinite;
          pointer-events: none;
        }
        .hirebot-window {
          animation: hireBotSlideUp 0.25s ease forwards;
        }
        .hirebot-dot-1 { animation: hireBotBounce 0.9s ease-in-out infinite; }
        .hirebot-dot-2 { animation: hireBotBounce 0.9s ease-in-out 0.15s infinite; }
        .hirebot-dot-3 { animation: hireBotBounce 0.9s ease-in-out 0.3s infinite; }
        .hirebot-scroll::-webkit-scrollbar { width: 4px; }
        .hirebot-scroll::-webkit-scrollbar-track { background: transparent; }
        .hirebot-scroll::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
      `}</style>

      {/* Chat window */}
      {isOpen && (
        <div
          className="hirebot-window"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '28px',
            width: '370px',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              flexShrink: 0,
              height: '56px',
              padding: '0 16px',
              background: 'var(--bg3)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {/* Top gradient border */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, var(--cyan), #9d4edd)',
              }}
            />

            {/* Left: avatar + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--cyan), #9d4edd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: 'var(--bg)',
                  }}
                >
                  BG
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e',
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '10px',
                    color: 'var(--text)',
                    letterSpacing: '0.05em',
                  }}
                >
                  BENNY&apos;S AI
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '9px',
                    color: 'var(--text3)',
                  }}
                >
                  Ask me anything
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'var(--text2)',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg4)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="hirebot-scroll"
            style={{ flex: 1, overflowY: 'auto', padding: '16px' }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={
                    msg.role === 'assistant'
                      ? {
                          maxWidth: '85%',
                          background: 'var(--bg3)',
                          borderLeft: '2px solid var(--cyan)',
                          padding: '10px 14px',
                          fontFamily: 'var(--font-space-mono)',
                          fontSize: '12px',
                          lineHeight: '1.7',
                          color: 'var(--text)',
                          borderRadius: '0 8px 8px 8px',
                        }
                      : {
                          maxWidth: '85%',
                          background: 'var(--cyan)',
                          color: 'var(--bg)',
                          padding: '10px 14px',
                          fontFamily: 'var(--font-space-mono)',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '8px 8px 0 8px',
                        }
                  }
                >
                  {msg.content}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '9px',
                    color: 'var(--text3)',
                    marginTop: '4px',
                    display: 'block',
                  }}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div
                  style={{
                    background: 'var(--bg3)',
                    borderLeft: '2px solid var(--cyan)',
                    padding: '10px 14px',
                    borderRadius: '0 8px 8px 8px',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                >
                  <div className="hirebot-dot-1" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)' }} />
                  <div className="hirebot-dot-2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)' }} />
                  <div className="hirebot-dot-3" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips */}
          {!hasUserMessages && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '0 16px 12px',
              }}
            >
              {SUGGESTIONS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '11px',
                    minHeight: '44px',
                    padding: '8px 14px',
                    border: '1px solid var(--border2)',
                    color: 'var(--cyan)',
                    background: 'var(--cyan-glow)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    borderRadius: '2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cyan-glow)')}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div
            style={{
              flexShrink: 0,
              height: '52px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 14px',
              background: 'var(--bg3)',
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '12px',
                color: 'var(--text)',
                opacity: isLoading ? 0.5 : 1,
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--cyan)',
                color: 'var(--bg)',
                fontSize: '14px',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s, transform 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && input.trim()) {
                  e.currentTarget.style.background = 'var(--text)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--cyan)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <div
        className="hirebot-trigger"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 1000,
        }}
      >
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '68px',
              right: 0,
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '9px',
              color: 'var(--text)',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              padding: '5px 10px',
              pointerEvents: 'none',
            }}
          >
            Chat with Benny&apos;s AI ↗
          </div>
        )}

        <button
          className="hirebot-pulse"
          onClick={() => setIsOpen((v) => !v)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Open HireBot chat"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--cyan)',
            color: 'var(--bg)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,229,200,0.3)',
            transition: 'transform 0.2s',
          }}
          onFocus={() => setShowTooltip(false)}
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 640px) {
          .hirebot-trigger { bottom: 16px !important; right: 16px !important; }
          .hirebot-window {
            bottom: 88px !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            height: 70vh !important;
            max-height: 460px !important;
          }
        }
      `}</style>
    </>
  )
}
