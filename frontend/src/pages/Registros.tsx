import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import SectionHeader from '../components/ui/SectionHeader'
import Select from '../components/ui/Select'
import Table from '../components/ui/Table'
import { getErrorMessage } from '../services/api'
import { getCervejas } from '../services/cervejas'
import { deleteRegistro, getRegistros } from '../services/registros'
import { getTanques } from '../services/tanques'
import type { Cerveja, Registro, RegistroFiltros, StatusFermentacao, Tanque } from '../types'
import { formatDateTime, getCervejaNome, getTanqueNome } from '../utils/format'
import addIcon from '../icones/novo_icone.png'
import filterIcon from '../icones/icon_011.png'
import trashIcon from '../icones/excluir.png'

interface RegistrosLocationState {
  lastStatus?: StatusFermentacao
}

export default function Registros() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as RegistrosLocationState | null
  const [cervejas, setCervejas] = useState<Cerveja[]>([])
  const [tanques, setTanques] = useState<Tanque[]>([])
  const [registros, setRegistros] = useState<Registro[]>([])
  const [filtros, setFiltros] = useState<RegistroFiltros>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastStatus] = useState<StatusFermentacao | null>(locationState?.lastStatus ?? null)

  async function loadBaseData() {
    setLoading(true)
    try {
      setError('')
      const [cervejasData, tanquesData, registrosData] = await Promise.all([getCervejas(), getTanques(), getRegistros(filtros)])
      setCervejas(cervejasData)
      setTanques(tanquesData)
      setRegistros(registrosData)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBaseData()
    // A carga inicial deve ocorrer uma unica vez; filtros sao aplicados pelo botao "Filtrar".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function applyFilters() {
    setLoading(true)
    try {
      setError('')
      setRegistros(await getRegistros(filtros))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function removeRegistro(id: string) {
    try {
      setError('')
      await deleteRegistro(id)
      setRegistros(await getRegistros(filtros))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Registros"
        action={
          <Button type="button" icon={<IconImage src={addIcon} size={18} />} onClick={() => navigate('/registros/novo')}>
            Novo registro
          </Button>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <section className="rounded-lg border border-[#e0e0e0] bg-white p-[22px]">
        <h2 className="mb-4 text-sm font-semibold text-brand-dark">Filtros</h2>
        <div className="grid grid-cols-1 items-end gap-3.5 lg:grid-cols-[1fr_1fr_180px_auto]">
          <Select label="Cerveja" value={filtros.cervejaId ?? ''} onChange={(event) => setFiltros({ ...filtros, cervejaId: event.target.value || undefined })}>
            <option value="">Todas</option>
            {cervejas.map((cerveja) => (
              <option key={cerveja.id} value={cerveja.id}>
                {cerveja.nome}
              </option>
            ))}
          </Select>
          <Select label="Tanque" value={filtros.tanqueId ?? ''} onChange={(event) => setFiltros({ ...filtros, tanqueId: event.target.value || undefined })}>
            <option value="">Todos</option>
            {tanques.map((tanque) => (
              <option key={tanque.id} value={tanque.id}>
                {tanque.nome}
              </option>
            ))}
          </Select>
          <Select label="Status" value={filtros.status ?? ''} onChange={(event) => setFiltros({ ...filtros, status: event.target.value as StatusFermentacao | '' })}>
            <option value="">Todos</option>
            <option value="dentro_padrao">Dentro</option>
            <option value="atencao">Atencao</option>
            <option value="fora_padrao">Fora</option>
          </Select>
          <Button type="button" variant="ghost" icon={<IconImage src={filterIcon} size={18} />} onClick={() => void applyFilters()}>
            Filtrar
          </Button>
        </div>
      </section>

      {lastStatus ? <div className="flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-4 py-3 text-xs text-brand-dark">Ultimo registro: <Badge status={lastStatus} /></div> : null}
      {loading ? <LoadingState /> : null}

      <Table
        headers={['Lote', 'Cerveja', 'Tanque', 'Data/hora', 'Temp.', 'pH', 'Extrato', 'Status', 'Acoes']}
        isEmpty={!loading && registros.length === 0}
        emptyMessage="Nenhum registro fermentativo encontrado."
      >
        {registros.map((registro) => (
          <tr key={registro.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
            <td className="px-3.5 py-2.5 text-xs font-semibold text-brand-dark">{registro.numeroLote}</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{getCervejaNome(cervejas, registro.cervejaId)}</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{getTanqueNome(tanques, registro.tanqueId)}</td>
            <td className="whitespace-nowrap px-3.5 py-2.5 text-xs text-brand-dark">{formatDateTime(registro.dataHora)}</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.temperatura} C</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.ph}</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.extrato} P</td>
            <td className="px-3.5 py-2.5">
              <Badge status={registro.status} />
            </td>
            <td className="px-3.5 py-2.5">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="border-[#063852] bg-[#063852] text-white hover:border-[#063852] hover:bg-[#063852]"
                  onClick={() => navigate(`/registros/${registro.id}/editar`)}
                >
                  Editar
                </Button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[5px] border border-[#FA9897] bg-[#FA9897] transition hover:border-[#FA9897] hover:bg-[#FA9897] focus:outline-none focus:ring-2 focus:ring-[#FA9897]/40"
                  aria-label="Excluir registro"
                  title="Excluir"
                  onClick={() => void removeRegistro(registro.id)}
                >
                  <IconImage src={trashIcon} size={26} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}
