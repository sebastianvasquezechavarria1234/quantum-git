'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CommitNode, CommitFile } from '@/lib/github'

interface TelemetryPanelProps {
  commit: CommitNode | null
  onClose: () => void
}

function DiffViewer({ file }: { file: CommitFile }) {
  const lines = file.patch?.split('\n') ?? []

  return (
    <div className="rounded-lg overflow-hidden border border-white/5">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
        <span className="text-xs font-mono text-zinc-400 truncate">{file.filename}</span>
        <span className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400">+{file.additions}</span>
          <span className="text-red-400">-{file.deletions}</span>
        </span>
      </div>
      <div className="max-h-40 overflow-y-auto">
        {lines.length > 0 ? (
          <pre className="text-[11px] font-mono leading-5 p-2">
            {lines.map((line, i) => {
              let className = 'text-zinc-500'
              if (line.startsWith('+')) className = 'text-emerald-400 bg-emerald-400/5'
              else if (line.startsWith('-')) className = 'text-red-400 bg-red-400/5'
              else if (line.startsWith('@@')) className = 'text-cyan-400 bg-cyan-400/5'
              return (
                <div key={i} className={className}>
                  <span className="inline-block w-8 text-right mr-2 opacity-40 select-none">{i + 1}</span>
                  {line}
                </div>
              )
            })}
          </pre>
        ) : (
          <div className="text-xs text-zinc-600 p-3 text-center">No diff available</div>
        )}
      </div>
    </div>
  )
}

export default function TelemetryPanel({ commit, onClose }: TelemetryPanelProps) {
  return (
    <AnimatePresence>
      {commit && (
        <motion.aside
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed top-20 right-4 bottom-24 w-[400px] z-40 overflow-hidden rounded-2xl"
        >
          <div className="glass-panel h-full overflow-y-auto p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                  {commit.author.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{commit.author.name}</p>
                  <p className="text-xs text-zinc-500">{commit.author.login}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                <span>Commit</span>
              </div>
              <p className="text-xs font-mono text-violet-400 break-all">{commit.sha.slice(0, 12)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                <span>Message</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{commit.message}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                <span>Date</span>
              </div>
              <p className="text-xs font-mono tabular-nums text-zinc-400">
                {commit.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600 font-mono mb-2">
                <span>Impact Index</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono tabular-nums text-emerald-400">+{commit.additions}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs font-mono tabular-nums text-red-400">-{commit.deletions}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-xs font-mono tabular-nums text-violet-400">{commit.files.length} files</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-600 font-mono mb-2">
                <span>Diff Viewer</span>
              </div>
              <div className="space-y-2">
                {commit.files.map((file, i) => (
                  <DiffViewer key={i} file={file} />
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
