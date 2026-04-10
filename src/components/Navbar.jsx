import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar({ user }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const isActive  = (p) => location.pathname === p

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🧭</span>
            <span className="logo-text">StreamSense</span>
          </Link>

          {/* Links */}
          <div className="navbar-links">
            {user ? (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/assessment" className="btn btn-primary btn-sm">
                  Take Test
                </Link>
                <button onClick={handleSignOut} className="btn btn-ghost btn-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="nav-link">Sign In</Link>
                <Link to="/auth" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        .navbar {
          position:fixed; top:0; left:0; right:0; z-index:100;
          padding:0 24px;
          background:rgba(10,15,30,.88);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(255,255,255,.07);
        }
        .navbar-inner {
          max-width:1100px; margin:0 auto; height:68px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .navbar-logo {
          display:flex; align-items:center; gap:10px; text-decoration:none;
        }
        .logo-icon { font-size:1.45rem; }
        .logo-text {
          font-size:1.2rem; font-weight:900; letter-spacing:-.02em;
          background:linear-gradient(135deg,#fff,#a5b4fc);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .navbar-links { display:flex; align-items:center; gap:10px; }
        .nav-link {
          color:#94a3b8; font-size:.9rem; font-weight:500;
          padding:6px 12px; border-radius:8px;
          transition:color .2s,background .2s; text-decoration:none;
        }
        .nav-link:hover,.nav-link.active { color:#f1f5f9; background:rgba(255,255,255,.06); }
      `}</style>
    </>
  )
}
