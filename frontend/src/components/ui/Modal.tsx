import type { ReactNode } from 'react'
import IconImage from './IconImage'
import closeIcon from '../../icones/icon_105.png'

interface ModalProps {
  title: string
  children: ReactNode
  open: boolean
  width?: 'normal' | 'wide'
  onClose: () => void
}

export default function Modal({ title, children, open, width = 'normal', onClose }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <section
        aria-modal="true"
        className={`max-h-[90vh] overflow-y-auto rounded-[10px] border border-[#dddddd] bg-white p-[22px] shadow-xl ${width === 'wide' ? 'w-[520px]' : 'w-[460px]'} max-w-full`}
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-dark">{title}</h2>
          <button className="grid h-7 w-7 place-items-center rounded-md text-brand-gray hover:bg-brand-light hover:text-brand-dark" type="button" onClick={onClose}>
            <IconImage src={closeIcon} size={17} />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
