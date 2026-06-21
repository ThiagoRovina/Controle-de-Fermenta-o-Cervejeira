import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export default function Select({ label, children, className = '', ...props }: SelectProps) {
  return (
    <label className="grid min-w-0 gap-1 text-[11px] font-semibold text-brand-dark">
      <span>{label}</span>
      <select
        className={`h-8 min-w-0 rounded-md border border-[#cccccc] bg-brand-light px-2.5 text-xs outline-none focus:border-brand-navy disabled:bg-slate-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
