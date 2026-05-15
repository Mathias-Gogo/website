import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminApp from './admin/AdminApp'
import Blog from './pages/Blog'
import FynxPage from './pages/Fynx'

export default function App() {
  return (
    <BrowserRouter basename="/website">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/fynx" element={<FynxPage />} />
      </Routes>
    </BrowserRouter>
  )
}