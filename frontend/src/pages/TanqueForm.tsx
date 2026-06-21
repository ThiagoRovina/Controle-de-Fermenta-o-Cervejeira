import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import { getErrorMessage } from '../services/api'
import { createTanque, deleteTanque, getTanque, updateTanque } from '../services/tanques'
import type { TanqueInput } from '../types'
import deleteIcon from '../icones/excluir.png'
import saveIcon from '../icones/icon_069.png'

const initialForm: TanqueInput = { nome: '', capacidade: 0 }

export default function TanqueForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<TanqueInput>(initialForm)
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const editing = Boolean(id)

  useEffect(() => {
    if (!id) {
      return
    }

    async function loadTanque() {
      try {
        setError('')
        const tanque = await getTanque(id!)
        setForm({ nome: tanque.nome, capacidade: tanque.capacidade })
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadTanque()
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      setError('')
      if (id) {
        await updateTanque(id, form)
      } else {
        await createTanque(form)
      }
      navigate('/tanques')
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
      await deleteTanque(id)
      navigate('/tanques')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title={editing ? 'Editar tanque' : 'Novo tanque'} />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      {!loading ? (
        <form id="tanque-form" className="form-card grid gap-3.5" onSubmit={handleSubmit}>
          <Input label="Nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required maxLength={100} />
          <Input
            label="Capacidade"
            unit="L"
            type="number"
            min="0.01"
            step="0.01"
            value={form.capacidade || ''}
            onChange={(event) => setForm({ ...form, capacidade: Number(event.target.value) })}
            required
          />
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
            <Button type="button" variant="ghost" onClick={() => navigate('/tanques')}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
