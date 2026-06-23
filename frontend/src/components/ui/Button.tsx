import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  icon?: ReactNode
  variant?: ButtonVariant
  size?: 'normal' | 'sm'
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border-brand-yellow bg-brand-yellow text-brand-dark hover:bg-yellow-300',
  secondary: 'border-brand-dark bg-brand-dark text-white hover:bg-brand-navy',
  danger: 'border-brand-red bg-brand-red text-[#7a1a1a] hover:bg-red-300',
  ghost: 'border-[#cccccc] bg-white text-brand-dark hover:bg-[#fafafa]',
  success: 'border-[#9CD497] bg-[#9CD497] text-brand-dark hover:bg-[#8bc985]',
}

export default function Button({ children, icon, variant = 'primary', size = 'normal', className = '', ...props }: ButtonProps) {
  const sizeClass = size === 'sm' ? 'min-h-7 rounded-[5px] px-2.5 py-[5px] text-[11px]' : 'min-h-8 rounded-md px-4 py-2 text-xs'

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 border font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${sizeClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children ? <span>{children}</span> : null}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
}

export function DeleteIconButton({ icon, label, className = '', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[5px] border border-[#FA9897] bg-[#FA9897] transition hover:border-[#FA9897] hover:bg-[#FA9897] focus:outline-none focus:ring-2 focus:ring-[#FA9897]/40 ${className}`}
      aria-label={label}
      title="Excluir"
      {...props}
    >
      {icon}
    </button>
  )
}
