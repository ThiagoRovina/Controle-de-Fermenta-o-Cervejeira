import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  unit?: string
}

export default function Input({ label, unit, className = '', ...props }: InputProps) {
  return (
    <label className="grid min-w-0 gap-1 text-[11px] font-semibold text-brand-dark">
      <span>{label}</span>
      <span className="flex min-w-0 rounded-md border border-[#cccccc] bg-brand-light focus-within:border-brand-navy">
        <input
          className={`h-8 min-w-0 flex-1 rounded-md bg-brand-light px-2.5 text-xs outline-none disabled:bg-slate-100 ${className}`}
          {...props}
        />
        {unit ? (
          <span className="flex min-w-8 items-center justify-center border-l border-[#cccccc] px-2 text-[11px] font-semibold text-brand-navy">
            {unit}
          </span>
        ) : null}
      </span>
    </label>
  )
}
