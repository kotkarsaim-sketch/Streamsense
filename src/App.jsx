import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase, IS_CONFIGURED } from './lib/supabase'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/auth" replace />
  return children
}

/* ── Shown when .env is still placeholder ── */
function SetupBanner() {
  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, background: 'rgba(245,158,11,.12)',
      border: '1px solid rgba(245,158,11,.35)', borderRadius: 12,
      padding: '12px 22px', color: '#fbbf24', fontSize: '.85rem',
      fontWeight: 600, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      ⚙️ Add your Supabase URL &amp; Anon Key to <code style={{ background: 'rgba(255,255,255,.08)', padding: '2px 6px', borderRadius: 5 }}>.env</code> to enable auth &amp; data.
    </div>
  )
}

export default function App() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(IS_CONFIGURED) // skip loading if not configured

  useEffect(() => {
    if (!IS_CONFIGURED) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <div className="loader" />
        <p style={{ color: '#475569', fontSize: '.9rem' }}>Loading StreamSense…</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-glow" />
      <div className="bg-glow-2" />
      {!IS_CONFIGURED && <SetupBanner />}
      <Navbar user={user} />
      <Routes>
        <Route path="/"            element={<LandingPage user={user} />} />
        <Route path="/auth"        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/assessment"  element={<ProtectedRoute user={user}><AssessmentPage user={user} /></ProtectedRoute>} />
        <Route path="/results/:id" element={<ProtectedRoute user={user}><ResultsPage user={user} /></ProtectedRoute>} />
        <Route path="/dashboard"   element={<ProtectedRoute user={user}><DashboardPage user={user} /></ProtectedRoute>} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

