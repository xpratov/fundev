import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DonatePage from './pages/Donate/Donate'
import Home from './pages/Home/Home'
import Empty from './pages/Empty/Empty'
import Developer from './pages/Dev/Dev'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/dev" element={<Developer />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/empty" element={<Empty />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
