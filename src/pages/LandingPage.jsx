import { Link } from 'react-router-dom'

const features = [
  { icon: '⚡', title: '5 Minutes Only',       desc: 'A quick 25-question assessment designed for every busy student.' },
  { icon: '🎯', title: 'Personalised Result',  desc: 'Get your single best-fit stream based on your unique personality.' },
  { icon: '📊', title: 'Score Breakdown',       desc: 'See your alignment across all 5 streams in one clear visual chart.' },
  { icon: '💼', title: 'Real Career Paths',     desc: 'Discover actual careers and college options within your stream.' },
  { icon: '📄', title: 'Downloadable Report',   desc: 'Get a beautiful PDF report to share with parents or teachers.' },
  { icon: '📁', title: 'History Saved',         desc: 'All past assessments saved — retake anytime to track your growth.' },
]

const steps = [
  { num: '01', title: 'Create your account',   desc: "Sign up in seconds — it's completely free, always." },
  { num: '02', title: 'Answer 25 questions',   desc: 'Rate how much each statement sounds like you. One question at a time, no rush.' },
  { num: '03', title: 'Get your stream',       desc: 'Receive a personalised recommendation with career paths and a PDF report.' },
]

const streams = [
  { icon: '⚛️', name: 'Science – PCM',    color: '#06b6d4', desc: 'Engineering & Technology' },
  { icon: '🧬', name: 'Science – PCB',    color: '#10b981', desc: 'Medicine & Life Sciences'  },
  { icon: '📈', name: 'Commerce',         color: '#f59e0b', desc: 'Business & Finance'        },
  { icon: '⚖️', name: 'Humanities',       color: '#a855f7', desc: 'Law, Arts & Social Sci.'  },
  { icon: '🔧', name: 'Polytechnic',      color: '#f97316', desc: 'Hands-on Technical Work'   },
]

export default function LandingPage({ user }) {
  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate-fadeUp">
            <span>🎓</span> Free for all post-10th students
          </div>
          <h1 className="heading-xl text-gradient animate-fadeUp delay-1">
            Discover the stream<br />that's made for you.
          </h1>
          <p className="hero-sub animate-fadeUp delay-2">
            StreamSense analyses your personality and interests through a 5-minute assessment
            and tells you exactly which stream — Science, Commerce, Humanities, or Polytechnic — suits you best.
          </p>
          <div className="hero-actions animate-fadeUp delay-3">
            <Link to={user ? '/assessment' : '/auth'} className="btn btn-primary btn-lg">
              Start Free Assessment →
            </Link>
            {user && (
              <Link to="/dashboard" className="btn btn-outline btn-lg">My Dashboard</Link>
            )}
          </div>
          <div className="hero-stats animate-fadeUp delay-4">
            {[['25', 'Questions'], ['5', 'Streams'], ['5 min', 'Duration'], ['Free', 'Always']].flatMap(([v, l], i) => [
              i > 0 ? <div key={`div-${i}`} className="stat-div" /> : null,
              <div key={v} className="stat">
                <span>{v}</span>
                <small>{l}</small>
              </div>,
            ].filter(Boolean))}
          </div>
        </div>
      </section>

      {/* ── STREAMS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-primary">Streams</div>
            <h2 className="heading-lg">Which path will you take?</h2>
            <p className="section-sub">We score your responses across all five streams simultaneously.</p>
          </div>
          <div className="streams-grid">
            {streams.map((s) => (
              <div key={s.name} className="stream-chip card card-hover">
                <div className="stream-chip-bar" style={{ background: s.color }} />
                <span className="stream-chip-icon">{s.icon}</span>
                <div>
                  <div className="stream-chip-name">{s.name}</div>
                  <div className="stream-chip-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-primary">How it works</div>
            <h2 className="heading-lg">Simple as 1, 2, 3</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.num} className="step-card card">
                <div className="step-num">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge badge-primary">Features</div>
            <h2 className="heading-lg">Everything you need to decide</h2>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card card card-hover">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <div className="cta-card card">
            <h2 className="heading-lg">Ready to find your stream?</h2>
            <p>Start the free 5-minute assessment and get clarity today.</p>
            <Link to={user ? '/assessment' : '/auth'} className="btn btn-primary btn-lg">
              Start Assessment — It's Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-logo">🧭 StreamSense</span>
            <p className="footer-copy">© 2025 StreamSense · Free career guidance for every student.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .landing { position:relative; z-index:1; }

        /* Hero */
        .hero { padding:140px 0 90px; text-align:center; }
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding:7px 18px; border-radius:999px;
          background:rgba(99,102,241,.1); border:1px solid rgba(99,102,241,.25);
          color:#a5b4fc; font-size:.82rem; font-weight:700;
          letter-spacing:.03em; margin-bottom:28px;
        }
        .hero h1 { margin-bottom:24px; }
        .hero-sub {
          max-width:620px; margin:0 auto 40px;
          font-size:1.1rem; color:#94a3b8; line-height:1.75;
        }
        .hero-actions {
          display:flex; gap:14px; justify-content:center;
          flex-wrap:wrap; margin-bottom:56px;
        }
        .hero-stats {
          display:inline-flex; align-items:center; gap:28px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px; padding:18px 40px;
          flex-wrap:wrap; justify-content:center;
        }
        .stat { text-align:center; }
        .stat span {
          display:block; font-size:1.55rem; font-weight:900;
          background:linear-gradient(135deg,#fff,#a5b4fc);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .stat small { color:#475569; font-size:.75rem; text-transform:uppercase; letter-spacing:.05em; }
        .stat-div  { width:1px; height:38px; background:rgba(255,255,255,.08); }

        /* Sections */
        .section { padding:80px 0; }
        .section-header { text-align:center; margin-bottom:48px; }
        .section-header h2 { margin:10px 0; }
        .section-sub { color:#94a3b8; font-size:1rem; }

        /* Streams */
        .streams-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:14px; }
        .stream-chip {
          display:flex; align-items:center; gap:16px;
          padding:20px 22px; position:relative; overflow:hidden;
        }
        .stream-chip-bar { position:absolute; top:0; left:0; width:3px; height:100%; border-radius:0 2px 2px 0; }
        .stream-chip-icon { font-size:1.9rem; }
        .stream-chip-name { font-weight:700; font-size:.97rem; }
        .stream-chip-desc { font-size:.8rem; color:#475569; margin-top:2px; }

        /* Steps */
        .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .step-card { padding:36px 28px; }
        .step-num {
          font-size:2.4rem; font-weight:900; font-family:'DM Sans',sans-serif;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:16px; line-height:1;
        }
        .step-title { font-size:1.15rem; font-weight:700; margin-bottom:8px; }
        .step-desc  { color:#64748b; line-height:1.65; font-size:.9rem; }

        /* Features */
        .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .feature-card  { padding:26px 22px; }
        .feature-icon  { font-size:1.7rem; margin-bottom:12px; }
        .feature-title { font-size:1rem; font-weight:700; margin-bottom:7px; }
        .feature-desc  { color:#64748b; font-size:.87rem; line-height:1.6; }

        /* CTA */
        .cta-card {
          text-align:center; padding:64px 40px;
          background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.08));
          border-color:rgba(99,102,241,.2);
        }
        .cta-card h2  { margin-bottom:12px; }
        .cta-card p   { color:#64748b; margin-bottom:30px; font-size:1rem; }

        /* Footer */
        .footer { padding:36px 0; border-top:1px solid rgba(255,255,255,.06); }
        .footer-inner { display:flex; align-items:center; justify-content:space-between; }
        .footer-logo {
          font-size:1.05rem; font-weight:900;
          background:linear-gradient(135deg,#fff,#a5b4fc);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .footer-copy { color:#334155; font-size:.82rem; }

        @media (max-width:768px) {
          .steps-grid,.features-grid { grid-template-columns:1fr; }
          .hero-stats  { padding:14px 22px; gap:18px; }
          .footer-inner { flex-direction:column; gap:10px; text-align:center; }
          .hero { padding:110px 0 70px; }
        }
      `}</style>
    </div>
  )
}
