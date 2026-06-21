import IconImage from './IconImage'
import errorIcon from '../../icones/icon_105.png'
import loadingIcon from '../../icones/icon_065.png'

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
      <IconImage src={errorIcon} size={18} />
      <span>{message}</span>
    </div>
  )
}

export function LoadingState({ label = 'Carregando dados' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-6 text-sm font-medium text-brand-navy">
      <IconImage className="animate-spin" src={loadingIcon} size={18} />
      <span>{label}</span>
    </div>
  )
}
