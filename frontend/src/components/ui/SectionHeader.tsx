import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import backIcon from '../../icones/icon_001.png'

interface SectionHeaderProps {
  title: string
  action?: ReactNode
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const showBackButton = location.pathname !== '/'

  function handleBack() {
    if (location.key === 'default') {
      navigate('/')
      return
    }

    navigate(-1)
  }

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {showBackButton ? (
          <button
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-brand-dark bg-brand-dark transition hover:bg-brand-navy"
            type="button"
            aria-label="Voltar"
            title="Voltar"
            onClick={handleBack}
          >
            <img className="h-4 w-4 object-contain" src={backIcon} alt="" aria-hidden="true" />
          </button>
        ) : null}
        <h1 className="truncate text-base font-semibold text-brand-dark">{title}</h1>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
