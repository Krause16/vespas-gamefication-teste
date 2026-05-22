import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PainelInstrutor } from '@/components/instrutor/PainelInstrutor'

interface SalaPageProps {
  params: Promise<{ codigo: string }>
}

export default async function SalaPage({ params }: SalaPageProps) {
  const { codigo } = await params
  const supabase = await createClient()

  const { data: sala, error } = await supabase
    .from('salas')
    .select('*')
    .eq('codigo', codigo)
    .single()

  if (error || !sala) notFound()

  return <PainelInstrutor sala={sala} />
}
