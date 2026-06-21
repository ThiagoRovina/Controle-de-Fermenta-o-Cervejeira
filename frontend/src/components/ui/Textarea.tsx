import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export default function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <label className="grid min-w-0 gap-1 text-[11px] font-semibold text-brand-dark">
      <span>{label}</span>
      <textarea
        className={`min-h-20 min-w-0 resize-y rounded-md border border-[#cccccc] bg-brand-light px-2.5 py-2 text-xs outline-none focus:border-brand-navy ${className}`}
        {...props}
      />
    </label>
  )
}
