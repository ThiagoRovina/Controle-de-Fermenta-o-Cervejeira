import type { ReactNode } from 'react'

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
