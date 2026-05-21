'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import { CommitNode } from '@/lib/github'

interface TimelinePlayerProps {
  commits: CommitNode[]
  onPlay: () => void
  onPause: () => void
  onSeek: (progress: number) => void
  isPlaying: boolean
  currentProgress: number
  currentCommit: CommitNode | null
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TimelinePlayer({
  commits,
  onPlay,
  onPause,
  onSeek,
  isPlaying,
  currentProgress,
  currentCommit,
}: TimelinePlayerProps) {
  const [dragging, setDragging] = useState(false)
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const totalDuration = commits.length * 250

  const handleBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const progress = Math.max(0, Math.min(1, x / rect.width))
    onSeek(progress)
  }, [onSeek])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setHoverProgress(Math.max(0, Math.min(1, x / rect.width)))
  }, [])

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true)
    handleBarClick(e)
  }, [handleBarClick])

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: MouseEvent) => {
      if (!barRef.current) return
      const rect = barRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const progress = Math.max(0, Math.min(1, x / rect.width))
      onSeek(progress)
    }
    const handleUp = () => setDragging(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragging, onSeek])

  const hoverIndex = hoverProgress !== null ? Math.floor(hoverProgress * commits.length) : null
  const hoverCommit = hoverIndex !== null ? commits[hoverIndex] : null
  const currentTime = Math.floor(currentProgress * totalDuration)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="glass-panel rounded-2xl px-5 pt-4 pb-4">
          {hoverCommit && dragging && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
              <div className="glass-panel rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-300 whitespace-nowrap">
                {hoverCommit.message.slice(0, 40)}...
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="w-9 h-9 rounded-xl bg-violet-600/80 hover:bg-violet-600 flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                  <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 1L13 7L2 13V1Z" fill="currentColor" />
                </svg>
              )}
            </button>

            <button
              onClick={() => onSeek(Math.min(1, currentProgress + 0.05))}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L7 6L1 11V1Z" fill="currentColor" />
                <rect x="9" y="1" width="2" height="10" rx="0.5" fill="currentColor" />
              </svg>
            </button>

            <div
              ref={barRef}
              className="flex-1 h-6 flex items-center cursor-pointer group relative"
              onClick={handleBarClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverProgress(null)}
              onMouseDown={handleDragStart}
            >
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-600 via-cyan-500 to-pink-500 transition-all duration-75"
                  style={{ width: `${currentProgress * 100}%` }}
                />
                {commits.map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/20"
                    style={{ left: `${(i / Math.max(commits.length - 1, 1)) * 100}%` }}
                  />
                ))}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-violet-500/30 transition-all duration-75"
                  style={{ left: `calc(${currentProgress * 100}% - 6px)` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono tabular-nums text-zinc-500 shrink-0 w-16 text-right">
              {formatDuration(currentTime)} / {formatDuration(totalDuration)}
            </div>

            <button
              onClick={() => onSeek(1)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M11 1L5 6L11 11V1Z" fill="currentColor" />
                <rect x="1" y="1" width="2" height="10" rx="0.5" fill="currentColor" />
              </svg>
            </button>
          </div>

          {currentCommit && (
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-violet-400">{currentCommit.sha.slice(0, 8)}</span>
              <span className="text-zinc-500 truncate">{currentCommit.message}</span>
              <span className="text-zinc-600 shrink-0">
                {currentCommit.date.toLocaleDateString('en-US')}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
