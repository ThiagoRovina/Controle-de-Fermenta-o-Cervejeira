import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/cervejas', label: 'Cervejas' },
  { to: '/tanques', label: 'Tanques' },
  { to: '/parametros', label: 'Parametros' },
  { to: '/registros', label: 'Registros' },
  { to: '/lotes', label: 'Lotes' },
]

export default function Navbar() {
  return (
    <nav className="flex h-10 items-center gap-1 overflow-x-auto overflow-y-hidden border-b border-[#dddddd] bg-white px-6">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `flex h-10 shrink-0 items-center border-b-2 px-3 text-xs font-medium transition ${
              isActive
                ? 'border-brand-yellow text-brand-dark'
                : 'border-transparent text-brand-gray hover:text-brand-dark'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
