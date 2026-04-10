import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STREAMS } from '../lib/scoring'

const STREAM_COLOR = {
  pcm: '#06b6d4', pcb: '#10b981',
  commerce: '#f59e0b', humanities: '#a855f7', polytechnic: '#f97316',
}

export default function DashboardPage({ user }) {
  const navigate    = useNavigate()
  const [list,    setList]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!error) setList(data || [])
      setLoading(false)
    })()
  }, [])

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Student'

  const latest = list[0]

  return (
    <div className="dash-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="dash-header animate-fadeUp">
          <div>
            <h1 className="heading-lg">
              Welcome back, <span className="text-gradient-primary">{firstName}</span> 👋
            </h1>
            <p className="dash-sub">
              {list.length === 0
                ? "You haven't taken any assessment yet — let's find your stream!"
                : `${list.length} assessment${list.length > 1 ? 's' : ''} completed. Keep exploring!`}
            </p>
          </div>
          <Link to="/assessment" className="btn btn-primary btn-lg">+ Start New Assessment</Link>
        </div>

        {/* ── Stats strip (only if at least 1 result) ── */}
        {latest && (
          <div className="dash-stats animate-fadeUp delay-1">
            <div className="stat-box card">
              <div className="stat-val">{list.length}</div>
              <div className="stat-lbl">Total Tests</div>
            </div>
            <div className="stat-box card">
              <div className="stat-val" style={{ fontSize: '2rem' }}>
                {STREAMS[latest.recommended_stream]?.icon}
              </div>
              <div className="stat-lbl">Latest Stream</div>
              <div className="stat-name" style={{ color: STREAM_COLOR[latest.recommended_stream] }}>
                {STREAMS[latest.recommended_stream]?.name}
              </div>
            </div>
            <div className="stat-box card">
              <div className="stat-val">
                {latest.scores?.[latest.recommended_stream]}%
              </div>
              <div className="stat-lbl">Best Match</div>
            </div>
          </div>
        )}

        {/* ── Assessment history ── */}
        <div className="dash-section animate-fadeUp delay-2">
          <h2 className="section-lbl">Past Assessments</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155' }}>
              Loading…
            </div>
          ) : list.length === 0 ? (
            /* Empty state */
            <div className="empty-card card">
              <div className="empty-icon">📝</div>
              <h3>No assessments yet</h3>
              <p>Take the 5-minute assessment to discover your ideal stream.</p>
              <Link to="/assessment" className="btn btn-primary" style={{ marginTop: 20 }}>
                Start Assessment →
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {list.map((a, idx) => {
                const stream = STREAMS[a.recommended_stream]
                const color  = STREAM_COLOR[a.recommended_stream]
                return (
                  <div
                    key={a.id}
                    className="a-card card card-hover"
                    onClick={() => navigate(`/results/${a.id}`)}
                    style={{
                      '--sc': color,
                      animationDelay:      `${idx * 0.06}s`,
                      animationFillMode:   'backwards',
                    }}
                  >
                    {/* Top accent */}
                    <div className="a-card-accent" />

                    {/* Header row */}
                    <div className="a-card-head">
                      <span className="a-icon">{stream?.icon}</span>
                      <span className="a-date">
                        {new Date(a.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="a-stream" style={{ color }}>{stream?.name}</h3>
                    <p  className="a-tagline">{stream?.tagline}</p>

                    {/* Mini score bars */}
                    <div className="mini-bars">
                      {Object.keys(STREAMS).map((key) => (
                        <div key={key} className="mini-row">
                          <div className="mini-track">
                            <div
                              className="mini-fill"
                              style={{
                                width:      `${a.scores?.[key] || 0}%`,
                                background: key === a.recommended_stream ? color : 'rgba(255,255,255,.14)',
                              }}
                            />
                          </div>
                          <span className="mini-pct">{a.scores?.[key] || 0}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="a-card-foot">
                      <span
                        className="match-badge"
                        style={{ background: `${color}18`, borderColor: `${color}40`, color }}
                      >
                        {a.scores?.[a.recommended_stream]}% match
                      </span>
                      <span className="view-link">View Report →</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dash-page {
          min-height:100vh; padding-top:100px; padding-bottom:80px;
          position:relative; z-index:1;
        }

        /* Header */
        .dash-header {
          display:flex; align-items:flex-start; justify-content:space-between;
          gap:24px; margin-bottom:36px; flex-wrap:wrap;
        }
        .dash-sub { color:#475569; margin-top:6px; font-size:.92rem; }

        /* Stats */
        .dash-stats {
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:16px; margin-bottom:40px;
        }
        .stat-box  { padding:24px; text-align:center; }
        .stat-val  {
          font-size:2rem; font-weight:900;
          background:linear-gradient(135deg,#fff,#a5b4fc);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .stat-lbl  { font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; color:#334155; margin-top:4px; }
        .stat-name { font-size:.8rem; font-weight:600; margin-top:3px; }

        /* Section label */
        .dash-section   { }
        .section-lbl    { font-size:1.1rem; font-weight:700; color:#64748b; margin-bottom:18px; }

        /* Empty */
        .empty-card {
          text-align:center; padding:64px 40px;
        }
        .empty-icon   { font-size:3rem; margin-bottom:14px; }
        .empty-card h3{ font-size:1.25rem; font-weight:700; margin-bottom:8px; }
        .empty-card p { color:#475569; }

        /* Grid */
        .cards-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
          gap:18px;
        }

        /* Assessment card */
        .a-card {
          padding:22px; cursor:pointer;
          position:relative; overflow:hidden;
          animation:fadeUp .4s ease;
        }
        .a-card-accent {
          position:absolute; top:0; left:0; right:0;
          height:3px; background:var(--sc);
        }
        .a-card-head {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:10px;
        }
        .a-icon   { font-size:1.7rem; }
        .a-date   { font-size:.75rem; color:#334155; font-weight:500; }
        .a-stream { font-size:1.1rem; font-weight:900; margin-bottom:2px; }
        .a-tagline{ font-size:.8rem; color:#475569; margin-bottom:14px; }

        /* Mini bars */
        .mini-bars { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .mini-row  { display:flex; align-items:center; gap:8px; }
        .mini-track{
          flex:1; height:4px;
          background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden;
        }
        .mini-fill { height:100%; border-radius:2px; transition:width .5s ease; }
        .mini-pct  { font-size:.68rem; color:#334155; font-weight:600; width:28px; text-align:right; }

        /* Footer */
        .a-card-foot {
          display:flex; align-items:center; justify-content:space-between;
          padding-top:12px; border-top:1px solid rgba(255,255,255,.05);
        }
        .match-badge {
          padding:4px 10px; border-radius:999px; border:1px solid;
          font-size:.73rem; font-weight:700;
        }
        .view-link { font-size:.78rem; color:#334155; font-weight:600; transition:color .2s; }
        .a-card:hover .view-link { color:#a5b4fc; }

        @media (max-width:768px) {
          .dash-header { flex-direction:column; }
          .dash-stats  { grid-template-columns:repeat(3,1fr); }
        }
        @media (max-width:480px) {
          .dash-stats  { grid-template-columns:1fr 1fr; }
        }
      `}</style>
    </div>
  )
}
