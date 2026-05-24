'use client'

import { motion } from 'framer-motion'
import { type Flag } from '@/types/terminal-ctf'

interface FlagItemProps {
  flag: Flag
  encontrada: boolean
}

export function FlagItem({ flag, encontrada }: FlagItemProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <motion.span
        className="flex-shrink-0 font-mono text-xs font-bold"
        animate={encontrada ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ color: encontrada ? '#39ff14' : '#333', minWidth: 28 }}
      >
        {encontrada ? '[✓]' : '[  ]'}
      </motion.span>

      <span
        className="font-mono text-xs"
        style={{ color: encontrada ? '#d9e2ec' : '#444' }}
      >
        flag_{String(flag.numero).padStart(2, '0')}
      </span>

      {encontrada && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto font-mono text-[10px]"
          style={{ color: '#39ff14' }}
        >
          +{flag.pontos}
        </motion.span>
      )}
    </div>
  )
}
