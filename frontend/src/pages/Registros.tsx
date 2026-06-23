import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button, { DeleteIconButton } from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import Select from '../components/ui/Select'
import Table, { TableActions, TableCell, TableRow } from '../components/ui/Table'
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

  useEffect(() => {
    async function loadBaseData() {
      setLoading(true)
      try {
        setError('')
        const [cervejasData, tanquesData, registrosData] = await Promise.all([getCervejas(), getTanques(), getRegistros()])
        setCervejas(cervejasData)
        setTanques(tanquesData)
        setRegistros(registrosData)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadBaseData()
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
        <div className="grid grid-cols-1 items-end gap-3.5 lg:grid-cols-[1fr_1fr_180px_180px_auto]">
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
          <Input
            label="Lote"
            value={filtros.numeroLote ?? ''}
            onChange={(event) => setFiltros({ ...filtros, numeroLote: event.target.value || undefined })}
            maxLength={50}
          />
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
          <TableRow key={registro.id}>
            <TableCell strong>{registro.numeroLote}</TableCell>
            <TableCell>{getCervejaNome(cervejas, registro.cervejaId)}</TableCell>
            <TableCell>{getTanqueNome(tanques, registro.tanqueId)}</TableCell>
            <TableCell className="whitespace-nowrap">{formatDateTime(registro.dataHora)}</TableCell>
            <TableCell>{registro.temperatura} C</TableCell>
            <TableCell>{registro.ph}</TableCell>
            <TableCell>{registro.extrato} P</TableCell>
            <TableCell>
              <Badge status={registro.status} />
            </TableCell>
            <TableCell>
              <TableActions>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="border-[#063852] bg-[#063852] text-white hover:border-[#063852] hover:bg-[#063852]"
                  onClick={() => navigate(`/registros/${registro.id}/editar`)}
                >
                  Editar
                </Button>
                <DeleteIconButton label="Excluir registro" icon={<IconImage src={trashIcon} size={26} />} onClick={() => void removeRegistro(registro.id)} />
              </TableActions>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
