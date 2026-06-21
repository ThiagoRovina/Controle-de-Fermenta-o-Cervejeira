import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import { getErrorMessage } from '../services/api'
import { createCerveja, deleteCerveja, getCerveja, updateCerveja } from '../services/cervejas'
import type { CervejaInput } from '../types'
import deleteIcon from '../icones/excluir.png'
import saveIcon from '../icones/icon_069.png'

const initialForm: CervejaInput = { nome: '', estilo: '' }

export default function CervejaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<CervejaInput>(initialForm)
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const editing = Boolean(id)

  useEffect(() => {
    if (!id) {
      return
    }

    async function loadCerveja() {
      try {
        setError('')
        const cerveja = await getCerveja(id!)
        setForm({ nome: cerveja.nome, estilo: cerveja.estilo })
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadCerveja()
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      setError('')
      if (id) {
        await updateCerveja(id, form)
      } else {
        await createCerveja(form)
      }
      navigate('/cervejas')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) {
      return
    }

    try {
      setError('')
      await deleteCerveja(id)
      navigate('/cervejas')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title={editing ? 'Editar cerveja' : 'Nova cerveja'} />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      {!loading ? (
        <form id="cerveja-form" className="form-card grid gap-3.5" onSubmit={handleSubmit}>
          <Input label="Nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required maxLength={100} />
          <Input label="Estilo" value={form.estilo} onChange={(event) => setForm({ ...form, estilo: event.target.value })} required maxLength={100} />
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeeee] pt-3.5">
            <div className="flex gap-2">
              <Button type="submit" variant="success" disabled={saving} icon={<IconImage src={saveIcon} size={18} />}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              {editing ? (
                <Button type="button" variant="danger" icon={<IconImage src={deleteIcon} size={18} />} onClick={() => void handleDelete()}>
                  Excluir
                </Button>
              ) : null}
            </div>
            <Button type="button" variant="ghost" onClick={() => navigate('/cervejas')}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
