import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, IS_CONFIGURED } from '../lib/supabase'

export default function AuthPage() {
  const navigate  = useNavigate()
  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  const switchMode = (m) => { setMode(m); setError(''); setSuccess('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        })
        if (error) throw error
        setSuccess('Account created! Check your email to confirm your account, then sign in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Card */}
        <div className="auth-card card animate-scaleIn">
          <div className="auth-logo">🧭</div>
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Get started free'}
          </h1>
          <p className="auth-sub">
            {mode === 'login'
              ? 'Sign in to access your assessments and results.'
              : 'Create your free account and discover your ideal stream.'}
          </p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login'  ? 'active' : ''}`} onClick={() => switchMode('login')}>Sign In</button>
            <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>Sign Up</button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="input" placeholder="Your name"
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="input" placeholder="Min. 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={6} />
            </div>

            {error   && <div className="form-msg error">{error}</div>}
            {success && <div className="form-msg success">{success}</div>}

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
              disabled={loading}>
              {loading
                ? 'Please wait…'
                : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>
        </div>

        {/* Info blurb below card */}
        <p className="auth-foot">
          By signing up you agree to our terms. StreamSense is completely free — no payments, ever.
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height:100vh; display:flex; align-items:center; justify-content:center;
          padding:100px 24px 60px;
          position:relative; z-index:1;
        }
        .auth-container { width:100%; max-width:440px; }
        .auth-card { padding:44px 38px; }
        .auth-logo { font-size:2.4rem; text-align:center; margin-bottom:18px; }
        .auth-title {
          font-size:1.75rem; font-weight:900; text-align:center;
          margin-bottom:8px; letter-spacing:-.02em;
        }
        .auth-sub {
          text-align:center; color:#64748b; font-size:.88rem;
          line-height:1.6; margin-bottom:28px;
        }
        .auth-tabs {
          display:flex; background:rgba(255,255,255,.04);
          border-radius:10px; padding:4px; margin-bottom:28px;
        }
        .auth-tab {
          flex:1; padding:10px; border-radius:8px;
          font-size:.88rem; font-weight:600; color:#64748b;
          background:transparent; border:none; cursor:pointer;
          transition:all .2s;
        }
        .auth-tab.active { background:rgba(99,102,241,.18); color:#a5b4fc; }
        .auth-form { display:flex; flex-direction:column; gap:16px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-label { font-size:.82rem; font-weight:600; color:#94a3b8; }
        .form-msg {
          padding:11px 15px; border-radius:8px; font-size:.85rem; line-height:1.5;
        }
        .form-msg.error   { background:rgba(239,68,68,.1);  border:1px solid rgba(239,68,68,.25);  color:#fca5a5; }
        .form-msg.success { background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.25); color:#6ee7b7; }
        .auth-foot {
          text-align:center; color:#334155; font-size:.75rem;
          margin-top:18px; line-height:1.5;
        }
      `}</style>
    </div>
  )
}
