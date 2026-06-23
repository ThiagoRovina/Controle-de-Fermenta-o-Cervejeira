import type { TdHTMLAttributes, ReactNode } from 'react'

interface TableProps {
  headers: string[]
  children: ReactNode
  emptyMessage?: string
  isEmpty?: boolean
}

export default function Table({ headers, children, emptyMessage = 'Nenhum registro encontrado.', isEmpty = false }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed text-left">
          <thead className="border-b border-[#eeeeee] bg-[#fafafa]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="truncate px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-brand-dark">
            {isEmpty ? (
              <tr>
                <td className="px-3.5 py-8 text-center text-xs text-brand-gray" colSpan={headers.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TableRowProps {
  children: ReactNode
}

export function TableRow({ children }: TableRowProps) {
  return <tr className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">{children}</tr>
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
  strong?: boolean
}

export function TableCell({ children, strong = false, className = '', ...props }: TableCellProps) {
  const weight = strong ? 'font-semibold' : ''

  return (
    <td className={`px-3.5 py-2.5 text-xs text-brand-dark ${weight} ${className}`} {...props}>
      {children}
    </td>
  )
}

export function TableActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}
