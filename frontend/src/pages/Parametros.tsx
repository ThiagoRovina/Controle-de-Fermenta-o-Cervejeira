import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { ErrorBanner, LoadingState } from '../components/ui/Feedback'
import IconImage from '../components/ui/IconImage'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import Select from '../components/ui/Select'
import { getErrorMessage } from '../services/api'
import { getCervejas } from '../services/cervejas'
import { getParametros, saveParametros } from '../services/parametros'
import type { Cerveja, ParametrosInput } from '../types'
import extractIcon from '../icones/icon_081.png'
import infoIcon from '../icones/icon_046.png'
import phIcon from '../icones/icon_064.png'
import saveIcon from '../icones/icon_069.png'
import temperatureIcon from '../icones/icon_047.png'

const emptyParams: ParametrosInput = {
  tempMin: 0,
  tempMax: 0,
  phMin: 0,
  phMax: 0,
  extratoMin: 0,
  extratoMax: 0,
}

interface ParameterBlockProps {
  title: string
  icon: ReactNode
  children: ReactNode
}

function ParameterBlock({ title, icon, children }: ParameterBlockProps) {
  return (
    <section className="rounded-lg border border-[#e0e0e0] bg-white p-[22px]">
      <div className="mb-4 flex items-center gap-2 text-brand-dark">
        {icon}
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3.5">{children}</div>
    </section>
  )
}

export default function Parametros() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialCervejaId = searchParams.get('cervejaId') ?? ''
  const [cervejas, setCervejas] = useState<Cerveja[]>([])
  const [cervejaId, setCervejaId] = useState(initialCervejaId)
  const [form, setForm] = useState<ParametrosInput>(emptyParams)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const selectedCerveja = useMemo(() => cervejas.find((cerveja) => cerveja.id === cervejaId), [cervejaId, cervejas])

  useEffect(() => {
    async function loadCervejas() {
      try {
        setError('')
        const data = await getCervejas()
        setCervejas(data)
        if (!cervejaId && data.length > 0) {
          setCervejaId(data[0].id)
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    void loadCervejas()
  }, [cervejaId])

  useEffect(() => {
    async function loadParametros() {
      if (!cervejaId) {
        return
      }

      try {
        setNotice('')
        setError('')
        const parametros = await getParametros(cervejaId)
        setForm({
          tempMin: parametros.tempMin,
          tempMax: parametros.tempMax,
          phMin: parametros.phMin,
          phMax: parametros.phMax,
          extratoMin: parametros.extratoMin,
          extratoMax: parametros.extratoMax,
        })
      } catch {
        setForm(emptyParams)
        setNotice('Parametros ainda nao definidos para esta cerveja.')
      }
    }

    void loadParametros()
  }, [cervejaId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!cervejaId) {
      setError('Selecione uma cerveja antes de salvar.')
      return
    }

    setSaving(true)
    try {
      setError('')
      setNotice('')
      await saveParametros(cervejaId, form)
      setNotice('Parametros salvos com sucesso.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  function updateNumber(field: keyof ParametrosInput, value: string) {
    setForm((current) => ({ ...current, [field]: Number(value) }))
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Parametros" />

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <LoadingState /> : null}
      {notice ? <div className="rounded-md border border-[#e0e0e0] bg-white px-4 py-3 text-xs font-medium text-brand-dark">{notice}</div> : null}

      <form id="parametros-form" className="grid gap-4" onSubmit={handleSubmit}>
        <div className="rounded-lg border border-[#e0e0e0] bg-white p-[22px]">
          <div className="grid max-w-[300px] gap-3">
            <Select label="Cerveja" value={cervejaId} onChange={(event) => setCervejaId(event.target.value)} required>
              <option value="">Selecione</option>
              {cervejas.map((cerveja) => (
                <option key={cerveja.id} value={cerveja.id}>
                  {cerveja.nome} - {cerveja.estilo}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-md border border-[#e0e0e0] bg-brand-light px-3 py-2 text-xs text-brand-gray">
            <IconImage className="mt-0.5" src={infoIcon} size={16} />
            <span>
              {selectedCerveja ? `${selectedCerveja.nome} - ${selectedCerveja.estilo}` : 'Selecione uma cerveja para configurar as faixas de tolerancia.'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <ParameterBlock title="Temperatura" icon={<IconImage src={temperatureIcon} size={17} />}>
            <Input label="Minima" unit="C" type="number" step="0.01" value={form.tempMin} onChange={(event) => updateNumber('tempMin', event.target.value)} required />
            <Input label="Maxima" unit="C" type="number" step="0.01" value={form.tempMax} onChange={(event) => updateNumber('tempMax', event.target.value)} required />
          </ParameterBlock>

          <ParameterBlock title="pH" icon={<IconImage src={phIcon} size={17} />}>
            <Input label="Minimo" type="number" min="0" max="14" step="0.01" value={form.phMin} onChange={(event) => updateNumber('phMin', event.target.value)} required />
            <Input label="Maximo" type="number" min="0" max="14" step="0.01" value={form.phMax} onChange={(event) => updateNumber('phMax', event.target.value)} required />
          </ParameterBlock>

          <ParameterBlock title="Extrato" icon={<IconImage src={extractIcon} size={17} />}>
            <Input label="Minimo" unit="P" type="number" step="0.01" value={form.extratoMin} onChange={(event) => updateNumber('extratoMin', event.target.value)} required />
            <Input label="Maximo" unit="P" type="number" step="0.01" value={form.extratoMax} onChange={(event) => updateNumber('extratoMax', event.target.value)} required />
          </ParameterBlock>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeeee] pt-3.5">
          <Button type="submit" variant="success" disabled={saving || !cervejaId} icon={<IconImage src={saveIcon} size={18} />}>
            Salvar parametros
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/cervejas')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

