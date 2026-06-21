import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import SectionHeader from '../components/ui/SectionHeader'
import Table from '../components/ui/Table'
import { getErrorMessage } from '../services/api'
import { deleteTanque, getTanques } from '../services/tanques'
import type { Tanque } from '../types'
import addIcon from '../icones/novo_icone.png'
import trashIcon from '../icones/excluir.png'

export default function Tanques() {
  const navigate = useNavigate()
  const [tanques, setTanques] = useState<Tanque[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadTanques() {
    setLoading(true)
    try {
      setError('')
      setTanques(await getTanques())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTanques()
  }, [])

  async function removeTanque(id: string) {
    try {
      setError('')
      await deleteTanque(id)
      await loadTanques()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Tanques"
        action={
          <Button type="button" icon={<IconImage src={addIcon} size={18} />} onClick={() => navigate('/tanques/novo')}>
            Novo tanque
          </Button>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      <Table headers={['Nome', 'Capacidade', 'Acoes']} isEmpty={!loading && tanques.length === 0} emptyMessage="Nenhum tanque cadastrado ainda.">
        {tanques.map((tanque) => (
          <tr key={tanque.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
            <td className="px-3.5 py-2.5 text-xs font-semibold text-brand-dark">{tanque.nome}</td>
            <td className="px-3.5 py-2.5 text-xs text-brand-dark">{tanque.capacidade.toLocaleString('pt-BR')} L</td>
            <td className="px-3.5 py-2.5">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="border-[#063852] bg-[#063852] text-white hover:border-[#063852] hover:bg-[#063852]"
                  onClick={() => navigate(`/tanques/${tanque.id}/editar`)}
                >
                  Editar
                </Button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[5px] border border-[#FA9897] bg-[#FA9897] transition hover:border-[#FA9897] hover:bg-[#FA9897] focus:outline-none focus:ring-2 focus:ring-[#FA9897]/40"
                  aria-label="Excluir tanque"
                  title="Excluir"
                  onClick={() => void removeTanque(tanque.id)}
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
