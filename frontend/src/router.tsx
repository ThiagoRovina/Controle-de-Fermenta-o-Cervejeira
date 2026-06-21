import { createBrowserRouter } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper'
import CervejaForm from './pages/CervejaForm'
import Cervejas from './pages/Cervejas'
import Dashboard from './pages/Dashboard'
import Lotes from './pages/Lotes'
import Parametros from './pages/Parametros'
import RegistroForm from './pages/RegistroForm'
import Registros from './pages/Registros'
import TanqueForm from './pages/TanqueForm'
import Tanques from './pages/Tanques'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'cervejas', element: <Cervejas /> },
      { path: 'cervejas/novo', element: <CervejaForm /> },
      { path: 'cervejas/:id/editar', element: <CervejaForm /> },
      { path: 'tanques', element: <Tanques /> },
      { path: 'tanques/novo', element: <TanqueForm /> },
      { path: 'tanques/:id/editar', element: <TanqueForm /> },
      { path: 'parametros', element: <Parametros /> },
      { path: 'registros', element: <Registros /> },
      { path: 'registros/novo', element: <RegistroForm /> },
      { path: 'registros/:id/editar', element: <RegistroForm /> },
      { path: 'lotes', element: <Lotes /> },
      { path: 'lotes/:numero', element: <Lotes /> },
    ],
  },
])
