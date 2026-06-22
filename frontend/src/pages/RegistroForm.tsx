import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import { getErrorMessage } from '../services/api'
import { getCervejas } from '../services/cervejas'
import { createRegistro, getRegistro, updateRegistro } from '../services/registros'
import { getTanques } from '../services/tanques'
import type { Cerveja, RegistroInput, Tanque } from '../types'
import { toDateTimeLocal } from '../utils/format'
import saveIcon from '../icones/icon_069.png'

const initialForm: RegistroInput = {
  cervejaId: '',
  tanqueId: '',
  numeroLote: '',
  dataHora: toDateTimeLocal(),
  temperatura: 0,
  ph: 0,
  extrato: 0,
  observacoes: '',
}

export default function RegistroForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cervejas, setCervejas] = useState<Cerveja[]>([])
  const [tanques, setTanques] = useState<Tanque[]>([])
  const [form, setForm] = useState<RegistroInput>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const editing = Boolean(id)

  useEffect(() => {
    async function loadBaseData() {
      try {
        setError('')
        const [cervejasData, tanquesData, registroData] = await Promise.all([getCervejas(), getTanques(), id ? getRegistro(id) : Promise.resolve(null)])
        setCervejas(cervejasData)
        setTanques(tanquesData)
        if (registroData) {
          setForm({
            cervejaId: registroData.cervejaId,
            tanqueId: registroData.tanqueId,
            numeroLote: registroData.numeroLote,
            dataHora: toDateTimeLocal(new Date(registroData.dataHora)),
            temperatura: registroData.temperatura,
            ph: registroData.ph,
            extrato: registroData.extrato,
            observacoes: registroData.observacoes ?? '',
          })
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadBaseData()
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      setError('')
      const payload = {
        ...form,
        dataHora: new Date(form.dataHora).toISOString(),
      }
      const saved = id ? await updateRegistro(id, payload) : await createRegistro(payload)
      navigate('/registros', { state: { lastStatus: saved.status } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title={editing ? 'Editar registro' : 'Novo registro'} />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}

      {!loading ? (
        <form id="registro-form" className="form-card grid w-full gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-[minmax(260px,360px)_minmax(240px,320px)_220px]">
            <Select label="Cerveja" value={form.cervejaId} onChange={(event) => setForm({ ...form, cervejaId: event.target.value })} required>
              <option value="">Selecione a cerveja</option>
              {cervejas.map((cerveja) => (
                <option key={cerveja.id} value={cerveja.id}>
                  {cerveja.nome} - {cerveja.estilo}
                </option>
              ))}
            </Select>
            <Select label="Tanque" value={form.tanqueId} onChange={(event) => setForm({ ...form, tanqueId: event.target.value })} required>
              <option value="">Selecione o tanque</option>
              {tanques.map((tanque) => (
                <option key={tanque.id} value={tanque.id}>
                  {tanque.nome} - {tanque.capacidade.toLocaleString('pt-BR')} L
                </option>
              ))}
            </Select>
            <Input
              label="Data e hora"
              type="datetime-local"
              value={form.dataHora}
              onChange={(event) => setForm({ ...form, dataHora: event.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-[minmax(220px,320px)_150px_120px_150px]">
            <Input
              label="Numero do lote"
              value={form.numeroLote}
              onChange={(event) => setForm({ ...form, numeroLote: event.target.value })}
              placeholder="Ex.: IPA001"
              autoComplete="off"
              required
              maxLength={50}
            />
            <Input
              label="Temperatura"
              unit="C"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex.: 10.5"
              value={form.temperatura || ''}
              onChange={(event) => setForm({ ...form, temperatura: Number(event.target.value) })}
              required
            />
            <Input
              label="pH"
              type="number"
              min="0"
              max="14"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex.: 5.2"
              value={form.ph || ''}
              onChange={(event) => setForm({ ...form, ph: Number(event.target.value) })}
              required
            />
            <Input
              label="Extrato"
              unit="P"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex.: 12.5"
              value={form.extrato || ''}
              onChange={(event) => setForm({ ...form, extrato: Number(event.target.value) })}
              required
            />
          </div>
          <div className="max-w-[760px]">
            <Textarea
              label="Observacoes"
              value={form.observacoes ?? ''}
              onChange={(event) => setForm({ ...form, observacoes: event.target.value })}
              placeholder="Informacoes adicionais sobre a medicao"
              maxLength={500}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeeee] pt-3.5">
            <Button type="submit" variant="success" disabled={saving} icon={<IconImage src={saveIcon} size={18} />}>
              {saving ? 'Salvando...' : 'Salvar registro'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/registros')}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
