import type { StatusFermentacao } from '../../types'
import { statusLabels } from '../../utils/format'

const styles: Record<StatusFermentacao, string> = {
  dentro_padrao: 'bg-brand-green text-[#1e5c1a]',
  atencao: 'bg-brand-yellow text-[#6b4700]',
  fora_padrao: 'bg-brand-red text-[#7a1a1a]',
}

export default function Badge({ status }: { status: StatusFermentacao }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-[3px] text-[10px] font-semibold ${styles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
