import { useEffect, useState } from 'react'
import Badge from '../components/ui/Badge'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import SectionHeader from '../components/ui/SectionHeader'
import Table from '../components/ui/Table'
import { getDashboard } from '../services/dashboard'
import { getErrorMessage } from '../services/api'
import { getCervejas } from '../services/cervejas'
import { getRegistros } from '../services/registros'
import { getTanques } from '../services/tanques'
import type { Cerveja, DashboardData, Registro, Tanque } from '../types'
import { formatDateTime, getCervejaNome, getTanqueNome } from '../utils/format'
import alertIcon from '../icones/icon_065.png'
import checkIcon from '../icones/icon_106.png'
import dashboardIcon from '../icones/icon_094.png'
import errorIcon from '../icones/icon_105.png'

const emptyDashboard: DashboardData = {
  totalRegistros: 0,
  dentroPadrao: 0,
  atencao: 0,
  foraPadrao: 0,
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(emptyDashboard)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [cervejas, setCervejas] = useState<Cerveja[]>([])
  const [tanques, setTanques] = useState<Tanque[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError('')
        const [dashboardData, registrosData, cervejasData, tanquesData] = await Promise.all([getDashboard(), getRegistros(), getCervejas(), getTanques()])
        setData(dashboardData)
        setRegistros(registrosData.slice(0, 8))
        setCervejas(cervejasData)
        setTanques(tanquesData)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const cards = [
    { label: 'Total de registros', value: data.totalRegistros, icon: dashboardIcon, border: 'border-t-brand-dark' },
    { label: 'Dentro do padrao', value: data.dentroPadrao, icon: checkIcon, border: 'border-t-brand-green' },
    { label: 'Atencao', value: data.atencao, icon: alertIcon, border: 'border-t-brand-yellow' },
    { label: 'Fora do padrao', value: data.foraPadrao, icon: errorIcon, border: 'border-t-brand-red' },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader title="Dashboard" />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon, border }) => (
          <section key={label} className={`rounded-lg border border-[#e0e0e0] border-t-[3px] bg-white px-5 py-4 ${border}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="block text-[30px] font-semibold leading-tight text-brand-dark">{value}</strong>
                <span className="mt-1 block text-[11px] font-semibold text-brand-gray">{label}</span>
              </div>
              <IconImage src={icon} size={22} />
            </div>
          </section>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-dark">Registros recentes</h2>
        </div>
        <Table
          headers={['Lote', 'Cerveja', 'Tanque', 'Data/hora', 'Temp.', 'pH', 'Status']}
          isEmpty={!loading && registros.length === 0}
          emptyMessage="Nenhum registro recente encontrado."
        >
          {registros.map((registro) => (
            <tr key={registro.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
              <td className="px-3.5 py-2.5 text-xs font-semibold text-brand-dark">{registro.numeroLote}</td>
              <td className="px-3.5 py-2.5 text-xs text-brand-dark">{getCervejaNome(cervejas, registro.cervejaId)}</td>
              <td className="px-3.5 py-2.5 text-xs text-brand-dark">{getTanqueNome(tanques, registro.tanqueId)}</td>
              <td className="whitespace-nowrap px-3.5 py-2.5 text-xs text-brand-dark">{formatDateTime(registro.dataHora)}</td>
              <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.temperatura} C</td>
              <td className="px-3.5 py-2.5 text-xs text-brand-dark">{registro.ph}</td>
              <td className="px-3.5 py-2.5">
                <Badge status={registro.status} />
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  )
}
