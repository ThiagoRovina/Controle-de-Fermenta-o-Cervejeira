import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navbar from './Navbar'

export default function PageWrapper() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-light">
      <Header />
      <Navbar />
      <main className="min-h-[calc(100vh-112px)] px-6 py-7">
        <Outlet />
      </main>
    </div>
  )
}
