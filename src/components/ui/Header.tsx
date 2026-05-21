'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeaderProps {
  onSearch: (url: string) => void
  isLoading: boolean
  error?: string | null
}

export default function Header({ onSearch, isLoading, error }: HeaderProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input.trim())
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              ◈ Quantum Git
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-500 font-mono ml-2">
            <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span>LIVE</span>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="owner/repo or https://github.com/owner/repo"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-violet-600/80 hover:bg-violet-600 disabled:opacity-40 rounded-xl text-sm font-medium transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading
                </span>
              ) : (
                'Explore'
              )}
            </button>
          </form>

          {error && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
              <div className="glass-panel rounded-lg px-3 py-1.5 text-xs text-red-400 font-mono whitespace-nowrap">
                {error}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0">
            <button className="hover:text-white transition-colors">Demo</button>
            <button className="hover:text-white transition-colors">About</button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
