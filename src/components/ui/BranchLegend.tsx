'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BranchData } from '@/lib/github'

interface BranchLegendProps {
  branches: BranchData[]
  visible: boolean
}

export default function BranchLegend({ branches, visible }: BranchLegendProps) {
  return (
    <AnimatePresence>
      {visible && branches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30"
        >
          <div className="glass-panel rounded-xl py-3 px-3 space-y-1.5">
            <p className="text-[9px] uppercase tracking-wider text-zinc-600 font-mono px-1 pb-1.5 border-b border-white/5">
              Branches
            </p>
            <div className="space-y-1">
              {branches.slice(0, 12).map((branch) => (
                <div
                  key={branch.name}
                  className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-white/5 transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: branch.color }}
                  />
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[100px]">
                    {branch.name}
                  </span>
                </div>
              ))}
              {branches.length > 12 && (
                <p className="text-[9px] text-zinc-600 text-center pt-1">
                  +{branches.length - 12} more
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
