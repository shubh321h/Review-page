import { Routes, Route, Navigate } from 'react-router-dom'
import ReviewFlow from './pages/ReviewFlow'
import QrPage from './pages/QrPage'

export default function App() {
  return (
    <div className="grain relative min-h-[100dvh] overflow-x-hidden bg-ink">
      <div className="aura" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<Navigate to="/review" replace />} />
        <Route path="/review" element={<ReviewFlow />} />
        <Route path="/qr" element={<QrPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
