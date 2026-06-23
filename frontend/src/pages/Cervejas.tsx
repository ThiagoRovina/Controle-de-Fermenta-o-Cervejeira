import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button, { DeleteIconButton } from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import Table, { TableActions, TableCell, TableRow } from '../components/ui/Table'
import { deleteCerveja, getCervejas } from '../services/cervejas'
import { getErrorMessage } from '../services/api'
import type { Cerveja } from '../types'
import addIcon from '../icones/novo_icone.png'
import settingsIcon from '../icones/icon_032.png'
import trashIcon from '../icones/excluir.png'

export default function Cervejas() {
  const navigate = useNavigate()
  const [cervejas, setCervejas] = useState<Cerveja[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cervejasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR')

    if (!termo) {
      return cervejas
    }

    return cervejas.filter((cerveja) =>
      `${cerveja.nome} ${cerveja.estilo}`.toLocaleLowerCase('pt-BR').includes(termo)
    )
  }, [busca, cervejas])

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

      <section className="rounded-lg border border-[#e0e0e0] bg-white p-[22px]">
        <div className="grid max-w-[360px] gap-3">
          <Input label="Buscar" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Nome ou estilo" />
        </div>
      </section>

      <Table
        headers={['Nome', 'Estilo', 'Acoes']}
        isEmpty={!loading && cervejasFiltradas.length === 0}
        emptyMessage={busca ? 'Nenhuma cerveja encontrada para a busca.' : 'Nenhuma cerveja cadastrada ainda.'}
      >
        {cervejasFiltradas.map((cerveja) => (
          <TableRow key={cerveja.id}>
            <TableCell strong>{cerveja.nome}</TableCell>
            <TableCell>{cerveja.estilo}</TableCell>
            <TableCell>
              <TableActions>
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
                <DeleteIconButton label="Excluir cerveja" icon={<IconImage src={trashIcon} size={26} />} onClick={() => void removeCerveja(cerveja.id)} />
              </TableActions>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
