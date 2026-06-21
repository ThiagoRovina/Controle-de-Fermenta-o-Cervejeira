import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import SectionHeader from '../components/ui/SectionHeader'
import Table from '../components/ui/Table'
import { deleteCerveja, getCervejas } from '../services/cervejas'
import { getErrorMessage } from '../services/api'
import type { Cerveja } from '../types'
import addIcon from '../icones/novo_icone.png'
import settingsIcon from '../icones/icon_032.png'
import trashIcon from '../icones/excluir.png'

export default function Cervejas() {
  const navigate = useNavigate()
  const [cervejas, setCervejas] = useState<Cerveja[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCervejas() {
    setLoading(true)
    try {
      setError('')
      setCervejas(await getCervejas())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCervejas()
  }, [])

  async function removeCerveja(id: string) {
    try {
      setError('')
      await deleteCerveja(id)
      await loadCervejas()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Cervejas"
        action={
          <Button type="button" icon={<IconImage src={addIcon} size={18} />} onClick={() => navigate('/cervejas/novo')}>
            Nova cerveja
          </Button>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      <Table headers={['Nome', 'Estilo', 'Acoes']} isEmpty={!loading && cervejas.length === 0} emptyMessage="Nenhuma cerveja cadastrada ainda.">
        {cervejas.map((cerveja) => (
          <tr key={cerveja.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
            <td className="px-3.5 py-2.5 text-xs font-semibold text-brand-dark">{cerveja.nome}</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{cerveja.estilo}</td>
            <td className="px-3.5 py-2.5">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="border-[#063852] bg-[#063852] text-white hover:border-[#063852] hover:bg-[#063852]"
                  onClick={() => navigate(`/cervejas/${cerveja.id}/editar`)}
                >
                  Editar
                </Button>
                <Button type="button" variant="ghost" size="sm" icon={<IconImage src={settingsIcon} size={16} />} onClick={() => navigate(`/parametros?cervejaId=${cerveja.id}`)}>
                  Parametros
                </Button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[5px] border border-[#FA9897] bg-[#FA9897] transition hover:border-[#FA9897] hover:bg-[#FA9897] focus:outline-none focus:ring-2 focus:ring-[#FA9897]/40"
                  aria-label="Excluir cerveja"
                  title="Excluir"
                  onClick={() => void removeCerveja(cerveja.id)}
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
