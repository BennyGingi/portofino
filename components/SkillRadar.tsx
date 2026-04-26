'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

// ── Data ─────────────────────────────────────────────────────────────────────

const AXES = [
  {
    id: 'security',
    label: 'Security Ops',
    value: 88,
    dark: '#00e5c8',
    light: '#007a65',
    tools: 'CrowdStrike · Hunters SIEM · Palo Alto · Cisco IronPort · Defender',
    desc: 'Tier 1/2 threat triage — phishing, malware, lateral movement',
  },
  {
    id: 'frontend',
    label: 'Frontend Dev',
    value: 87,
    dark: '#ff6b2b',
    light: '#c2410c',
    tools: 'Next.js · React · TypeScript · Tailwind · Mantine UI',
    desc: 'Full-stack apps from 0 to production — FoodCritic, SOC Portal, portfolio',
  },
  {
    id: 'backend',
    label: 'Backend & DB',
    value: 72,
    dark: '#9d4edd',
    light: '#7c3aed',
    tools: 'Node.js · PostgreSQL · Supabase · Prisma · REST APIs',
    desc: 'Auth, RLS policies, real-time subscriptions, schema design',
  },
  {
    id: 'devops',
    label: 'DevOps & Deploy',
    value: 65,
    dark: '#ffd166',
    light: '#b45309',
    tools: 'PM2 · IIS · GitLab CI/CD · Vercel · Windows Server',
    desc: 'Enterprise deployment at Mobileye, Vercel for consumer apps',
  },
  {
    id: 'tooling',
    label: 'Tooling & Script',
    value: 78,
    dark: '#4ade80',
    light: '#16a34a',
    tools: 'Python · Bash · PowerShell · CustomTkinter · Puppeteer',
    desc: 'GHOSTEYE v4, NIGHTWATCH, automation scripts, OSINT tools',
  },
]

const FULL_LABELS: Record<string, string> = {
  security: 'Security Operations',
  frontend: 'Frontend Dev',
  backend: 'Backend & Database',
  devops: 'DevOps & Deployment',
  tooling: 'Tooling & Scripting',
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

const SVG_W = 500
const SVG_H = 500
const CX = SVG_W / 2
const CY = SVG_H / 2
const OUTER = 165   // max radius
const N = AXES.length
const RINGS = 5

function angleOf(i: number) {
  return (270 + i * (360 / N)) * (Math.PI / 180)
}

function pointAt(i: number, frac: number) {
  const a = angleOf(i)
  return { x: CX + frac * OUTER * Math.cos(a), y: CY + frac * OUTER * Math.sin(a) }
}

function ringPoints(frac: number) {
  return Array.from({ length: N }, (_, i) => pointAt(i, frac))
}

function polyStr(pts: { x: number; y: number }[]) {
  return pts.map(p => `${p.x},${p.y}`).join(' ')
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SkillRadar() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const [activeIdx, setActiveIdx] = useState(0)
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null)
  const [cardVisible, setCardVisible] = useState(false)

  const polygonRef = useRef<SVGPolygonElement>(null)
  const markerRefs = useRef<(SVGCircleElement | null)[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const drawnRef = useRef(false)

  // ── card mount animation
  useEffect(() => {
    setCardVisible(false)
    const t = setTimeout(() => setCardVisible(true), 50)
    return () => clearTimeout(t)
  }, [activeIdx])

  // ── polygon draw-in on mount
  useEffect(() => {
    drawnRef.current = false
    const poly = polygonRef.current
    if (!poly) return

    const pts = AXES.map((ax, i) => pointAt(i, ax.value / 100))
    poly.setAttribute('points', polyStr(pts))

    // measure perimeter
    const len = poly.getTotalLength()
    poly.style.strokeDasharray = `${len}`
    poly.style.strokeDashoffset = `${len}`

    let start: number | null = null
    const DURATION = 1200

    function step(ts: number) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / DURATION, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      poly!.style.strokeDashoffset = `${len * (1 - ease)}`
      if (progress < 1) requestAnimationFrame(step)
      else drawnRef.current = true
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [resolvedTheme])

  // ── rAF loop: mouse breathing + hover detection
  useEffect(() => {
    const svg = svgRef.current
    const poly = polygonRef.current
    if (!svg || !poly) return

    function onMouseMove(e: MouseEvent) {
      const rect = svg!.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    function onMouseLeave() {
      mouseRef.current = { x: CX * (svg!.getBoundingClientRect().width / SVG_W), y: CY * (svg!.getBoundingClientRect().height / SVG_H) }
      setTooltip(null)
    }
    svg.addEventListener('mousemove', onMouseMove)
    svg.addEventListener('mouseleave', onMouseLeave)

    function loop() {
      const rect = svg!.getBoundingClientRect()
      const scaleX = rect.width / SVG_W
      const scaleY = rect.height / SVG_H
      const mx = mouseRef.current.x / scaleX
      const my = mouseRef.current.y / scaleY
      const dx = (mx - CX) / (SVG_W / 2)
      const dy = (my - CY) / (SVG_H / 2)

      // breathing
      const breathPts = AXES.map((ax, i) => {
        const a = angleOf(i)
        const base = pointAt(i, ax.value / 100)
        return {
          x: base.x + dx * 4 * Math.sin(a),
          y: base.y + dy * 4 * Math.cos(a),
        }
      })
      poly!.setAttribute('points', polyStr(breathPts))

      // hover detection — update markers + tooltip
      let found: { i: number; x: number; y: number } | null = null
      breathPts.forEach((bp, i) => {
        const bpSx = bp.x * scaleX
        const bpSy = bp.y * scaleY
        const dist = Math.hypot(mouseRef.current.x - bpSx, mouseRef.current.y - bpSy)
        const el = markerRefs.current[i]
        if (!el) return
        if (dist < 30) {
          el.setAttribute('r', '7')
          found = { i, x: bp.x, y: bp.y }
        } else {
          el.setAttribute('r', '4')
        }
      })
      setTooltip(found)

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      svg.removeEventListener('mousemove', onMouseMove)
      svg.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [resolvedTheme])

  const active = AXES[activeIdx]
  const accentColor = isDark ? active.dark : active.light

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* SVG Radar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '100%', maxWidth: '500px', height: 'auto', overflow: 'visible' }}
        >
          {/* 1 — Grid rings */}
          {Array.from({ length: RINGS }, (_, ri) => {
            const frac = (ri + 1) / RINGS
            const pts = ringPoints(frac)
            return (
              <polygon
                key={ri}
                points={polyStr(pts)}
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
                opacity="0.35"
              />
            )
          })}

          {/* 2 — Axis lines */}
          {AXES.map((_, i) => {
            const tip = pointAt(i, 1)
            return (
              <line
                key={i}
                x1={CX} y1={CY}
                x2={tip.x} y2={tip.y}
                stroke="var(--border2)"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.45"
              />
            )
          })}

          {/* 4 — Skill polygon (behind markers, above grid) */}
          <polygon
            ref={polygonRef}
            points={polyStr(AXES.map((ax, i) => pointAt(i, ax.value / 100)))}
            fill={isDark ? 'rgba(0,229,200,0.10)' : 'rgba(0,122,101,0.10)'}
            stroke={isDark ? '#00e5c8' : '#007a65'}
            strokeWidth="1.5"
            style={{ transition: 'fill 0.3s' }}
          />

          {/* 5 — Value markers + pulse rings */}
          {AXES.map((ax, i) => {
            const pt = pointAt(i, ax.value / 100)
            const color = isDark ? ax.dark : ax.light
            return (
              <g key={i}>
                {/* pulse ring — transform-scale animation */}
                <circle
                  cx={pt.x} cy={pt.y} r="8"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  style={{
                    transformOrigin: 'center',
                    transformBox: 'fill-box',
                    animation: tooltip?.i === i ? 'radarPulse 1.2s ease-out infinite' : 'none',
                    opacity: 0,
                  }}
                />
                <circle
                  ref={el => { markerRefs.current[i] = el }}
                  cx={pt.x} cy={pt.y} r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="1"
                  style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                  onClick={() => setActiveIdx(i)}
                />
              </g>
            )
          })}

          {/* 3 — Axis labels (rendered last so they're above everything) */}
          {AXES.map((ax, i) => {
            const a = angleOf(i)
            const PAD = 26
            const lx = CX + (OUTER + PAD) * Math.cos(a)
            const ly = CY + (OUTER + PAD) * Math.sin(a)
            const color = isDark ? ax.dark : ax.light

            // anchor based on quadrant
            let anchor: 'start' | 'middle' | 'end' = 'middle'
            const deg = ((a * 180) / Math.PI + 360) % 360
            if (deg > 200 && deg < 340) anchor = 'start'
            else if (deg > 20 && deg < 160) anchor = 'end'

            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveIdx(i)}
              >
                <text
                  x={lx} y={ly - 6}
                  textAnchor={anchor}
                  fontFamily="'Space Mono', monospace"
                  fontSize="10"
                  fill="var(--text2)"
                >
                  {ax.label}
                </text>
                <text
                  x={lx} y={ly + 8}
                  textAnchor={anchor}
                  fontFamily="'Space Mono', monospace"
                  fontSize="10"
                  fontWeight="bold"
                  fill={color}
                >
                  {ax.value}
                </text>
              </g>
            )
          })}

          {/* 6 — Tooltip pill */}
          {tooltip && (() => {
            const ax = AXES[tooltip.i]
            const color = isDark ? ax.dark : ax.light
            const px = tooltip.x
            const py = tooltip.y - 22
            const text = `${ax.label}: ${ax.value}%`
            const W2 = text.length * 5.8 + 16
            return (
              <g pointerEvents="none">
                <rect
                  x={px - W2 / 2} y={py - 12}
                  width={W2} height={20}
                  rx="4"
                  fill="var(--bg3)"
                  stroke={color}
                  strokeWidth="1"
                />
                <text
                  x={px} y={py + 2}
                  textAnchor="middle"
                  fontFamily="'Space Mono', monospace"
                  fontSize="9"
                  fill={color}
                >
                  {text}
                </text>
              </g>
            )
          })()}

        </svg>
      </div>

      {/* Drill-down card */}
      <div
        style={{
          border: `1px solid ${accentColor}`,
          background: 'var(--bg2)',
          padding: '20px 24px',
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '13px',
              fontWeight: 'bold',
              color: accentColor,
              letterSpacing: '0.06em',
            }}
          >
            {FULL_LABELS[active.id]}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: accentColor,
              opacity: 0.7,
            }}
          >
            {active.value}%
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: 'var(--text2)',
            marginBottom: '8px',
            lineHeight: 1.6,
          }}
        >
          {active.tools}
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            color: 'var(--text3)',
            lineHeight: 1.6,
            borderTop: '1px solid var(--border)',
            paddingTop: '8px',
          }}
        >
          {active.desc}
        </p>
      </div>

      {/* pulse keyframe */}
      <style>{`
        @keyframes radarPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0;   }
        }
      `}</style>
    </div>
  )
}
