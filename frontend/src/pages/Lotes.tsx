import { useEffect, useState } from 'react'
import Badge from '../components/ui/Badge'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import SectionHeader from '../components/ui/SectionHeader'
import Table from '../components/ui/Table'
import { getErrorMessage } from '../services/api'
import { getLoteHistorico, getLotes } from '../services/lotes'
import type { LoteHistorico, LoteResumo } from '../types'
import { formatDateTime, formatShortDate } from '../utils/format'

export default function Lotes() {
  const [lotes, setLotes] = useState<LoteResumo[]>([])
  const [historico, setHistorico] = useState<LoteHistorico | null>(null)
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLotes() {
      try {
        setError('')
        const data = await getLotes()
        setLotes(data)
        if (data.length > 0) {
          setSelected(data[0].numeroLote)
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadLotes()
  }, [])

  useEffect(() => {
    async function loadHistorico() {
      if (!selected) {
        setHistorico(null)
        return
      }

      try {
        setError('')
        setHistorico(await getLoteHistorico(selected))
      } catch (err) {
        setError(getErrorMessage(err))
      }
    }

    void loadHistorico()
  }, [selected])

  return (
    <div className="space-y-4">
      <SectionHeader title="Lotes" />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
        <section className="rounded-lg border border-[#e0e0e0] bg-white p-3">
          <div className="space-y-2">
            {lotes.length === 0 && !loading ? <p className="px-2 py-3 text-xs text-brand-gray">Nenhum lote disponivel.</p> : null}
            {lotes.map((lote) => (
              <button
                key={lote.numeroLote}
                className={`w-full rounded-md border px-3 py-2.5 text-left transition ${
                  selected === lote.numeroLote ? 'border-l-[3px] border-brand-yellow bg-[#fffaf0]' : 'border-[#e8e8e8] bg-white hover:bg-[#fafafa]'
                }`}
                type="button"
                onClick={() => setSelected(lote.numeroLote)}
              >
                <strong className="block truncate text-xs font-semibold text-brand-dark">{lote.numeroLote}</strong>
                <span className="mt-1 block truncate text-[11px] font-medium text-brand-gray">{lote.totalRegistros} registros</span>
                <span className="mt-1 block truncate text-[10px] text-brand-gray">{formatShortDate(lote.ultimaMedicao)}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex min-h-8 items-center justify-between">
            <h2 className="text-base font-semibold text-brand-dark">Historico {historico?.numeroLote ?? ''}</h2>
            {historico?.registros[0]?.status ? <Badge status={historico.registros[0].status} /> : null}
          </div>
          <Table
            headers={['Data', 'Temperatura', 'pH', 'Extrato', 'Status']}
            isEmpty={!historico || historico.registros.length === 0}
            emptyMessage="Selecione um lote para visualizar o historico."
          >
            {historico?.registros.map((registro) => (
              <tr key={registro.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="whitespace-nowrap px-3.5 py-2.5 text-xs text-brand-dark">{formatDateTime(registro.dataHora)}</td>
                <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.temperatura} C</td>
                <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.ph}</td>
                <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.extrato} P</td>
                <td className="px-3.5 py-2.5">
                  <Badge status={registro.status} />
                </td>
              </tr>
            ))}
          </Table>
        </section>
      </div>
    </div>
  )
}
