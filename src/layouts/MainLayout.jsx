import { Outlet } from 'react-router-dom'
import Header from '../ui/Header'
import Footer from '../ui/Footer'

export default function MainLayout() {
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1220]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
