'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessaoStore } from '@/stores/sessaoStore'
import { entrarAnonymously } from '@/lib/supabase/auth'
import { buscarSalaPorCodigo } from '@/lib/supabase/salas'
import { criarJogador } from '@/lib/supabase/jogadores'

interface UseCodigoEntradaReturn {
  digitos: string[]
  erro: string | null
  carregando: boolean
  completo: boolean
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>
  handleDigito: (index: number, valor: string) => void
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  handleEntrar: () => Promise<void>
}

export function useCodigoEntrada(): UseCodigoEntradaReturn {
  const [digitos, setDigitos] = useState<string[]>(Array(6).fill(''))
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const entrarNaSala = useSessaoStore((state) => state.entrarNaSala)

  const completo = digitos.every((d) => d !== '')

  function handleDigito(index: number, valor: string): void {
    if (!/^\d*$/.test(valor)) return

    const novosDigitos = [...digitos]
    novosDigitos[index] = valor.slice(-1)
    setDigitos(novosDigitos)
    setErro(null)

    if (valor && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void {
    if (e.key === 'Backspace' && !digitos[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>): void {
    e.preventDefault()
    const texto = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const novosDigitos = Array(6).fill('')
    texto.split('').forEach((c, i) => {
      novosDigitos[i] = c
    })
    setDigitos(novosDigitos)
    const proximoFoco = Math.min(texto.length, 5)
    inputRefs.current[proximoFoco]?.focus()
  }

  async function handleEntrar(): Promise<void> {
    if (!completo || carregando) return
    setCarregando(true)
    setErro(null)

    try {
      const codigo = digitos.join('')

      const user = await entrarAnonymously()

      const sala = await buscarSalaPorCodigo(codigo)
      if (!sala) {
        setErro('Sala não encontrada ou encerrada')
        return
      }

      const apelido = `Agente #${Math.floor(1000 + Math.random() * 9000)}`
      const jogador = await criarJogador({
        sala_id: sala.id,
        apelido,
        auth_user_id: user.id,
      })

      entrarNaSala(codigo, apelido, sala.id, jogador.id)
      router.push('/hub')
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : 'Erro inesperado. Tente novamente.'
      setErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return {
    digitos,
    erro,
    carregando,
    completo,
    inputRefs,
    handleDigito,
    handleKeyDown,
    handlePaste,
    handleEntrar,
  }
}
