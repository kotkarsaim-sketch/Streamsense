import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions, RATING_LABELS } from '../lib/questions'
import { calculateScores } from '../lib/scoring'
import { supabase } from '../lib/supabase'

export default function AssessmentPage({ user }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers,      setAnswers]      = useState(Array(25).fill(null))
  const [selected,     setSelected]     = useState(null)
  const [animDir,      setAnimDir]      = useState('enter') // 'enter' | 'exit'
  const [saving,       setSaving]       = useState(false)

  const progress = (currentIndex / questions.length) * 100
  const q        = questions[currentIndex]
  const isLast   = currentIndex === questions.length - 1

  /* ── Advance / submit ── */
  const handleNext = async () => {
    if (selected === null) return
    const newAnswers = [...answers]
    newAnswers[currentIndex] = selected

    if (isLast) {
      setSaving(true)
      const { percentages, recommended } = calculateScores(newAnswers)
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          user_id:            user.id,
          answers:            newAnswers,
          scores:             percentages,
          recommended_stream: recommended,
        })
        .select()
        .single()

      if (error) {
        alert('Could not save results: ' + error.message)
        setSaving(false)
        return
      }
      navigate(`/results/${data.id}`)
      return
    }

    // Animate out → advance → animate in
    setAnimDir('exit')
    setTimeout(() => {
      setAnswers(newAnswers)
      setCurrentIndex(currentIndex + 1)
      setSelected(null)
      setAnimDir('enter')
    }, 260)
  }

  /* ── Go back ── */
  const handleBack = () => {
    if (currentIndex === 0) return
    setAnimDir('exit')
    setTimeout(() => {
      setCurrentIndex(currentIndex - 1)
      setSelected(answers[currentIndex - 1])
      setAnimDir('enter')
    }, 200)
  }

  return (
    <div className="assess-page">
      <div className="container">

        {/* Progress row */}
        <div className="assess-header">
          <div className="assess-meta">
            <span className="q-counter">Question {currentIndex + 1} <span style={{ color: '#334155' }}>/ {questions.length}</span></span>
            <span className="q-time">~{Math.max(1, Math.ceil((questions.length - currentIndex) * 12 / 60))} min left</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${progress}%` }} />
            <div className="prog-dot"  style={{ left:  `calc(${progress}% - 7px)` }} />
          </div>
        </div>

        {/* Question card */}
        <div className={`q-card card anim-${animDir}`}>
          <div className="q-num">{String(currentIndex + 1).padStart(2, '0')}</div>
          <h2 className="q-text">{q.text}</h2>
          <p className="q-hint">Rate how much this statement sounds like you:</p>

          <div className="rating-grid">
            {RATING_LABELS.map(({ value, label }) => (
              <button
                key={value}
                className={`rating-btn ${selected === value ? 'sel' : ''}`}
                onClick={() => setSelected(value)}
              >
                <span className="r-num">{value}</span>
                <span className="r-lbl">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nav buttons */}
        <div className="q-nav">
          <button className="btn btn-outline" onClick={handleBack} disabled={currentIndex === 0}>
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={selected === null || saving}
          >
            {saving ? 'Saving…' : isLast ? 'See My Results 🎉' : 'Next →'}
          </button>
        </div>

        {/* Dot minimap */}
        <div className="q-dots">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`q-dot ${i === currentIndex ? 'cur' : answers[i] !== null ? 'done' : ''}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .assess-page {
          min-height:100vh; padding-top:100px; padding-bottom:60px;
          position:relative; z-index:1;
        }
        .assess-header { max-width:700px; margin:0 auto 36px; }
        .assess-meta {
          display:flex; justify-content:space-between; margin-bottom:12px;
        }
        .q-counter { font-weight:700; font-size:.9rem; color:#a5b4fc; }
        .q-time    { font-size:.82rem; color:#334155; }

        /* Progress bar */
        .prog-track {
          position:relative; height:5px;
          background:rgba(255,255,255,.06); border-radius:999px;
        }
        .prog-fill {
          height:100%;
          background:linear-gradient(90deg,#6366f1,#8b5cf6);
          border-radius:999px;
          transition:width .45s cubic-bezier(.4,0,.2,1);
          min-width:5px;
        }
        .prog-dot {
          position:absolute; top:50%; transform:translateY(-50%);
          width:14px; height:14px; background:#8b5cf6; border-radius:50%;
          box-shadow:0 0 10px rgba(139,92,246,.65);
          transition:left .45s cubic-bezier(.4,0,.2,1);
        }

        /* Card */
        .q-card { max-width:700px; margin:0 auto; padding:48px 44px; }

        .anim-enter { animation:fadeUp .32s ease forwards; }
        .anim-exit  { animation:qExit .22s ease forwards; }
        @keyframes qExit { to { opacity:0; transform:translateY(-12px); } }

        .q-num {
          font-size:3.2rem; font-weight:900; font-family:'DM Sans',sans-serif;
          line-height:1; margin-bottom:18px;
          background:linear-gradient(135deg,rgba(99,102,241,.35),rgba(139,92,246,.35));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .q-text {
          font-size:1.38rem; font-weight:700; line-height:1.45;
          letter-spacing:-.01em; margin-bottom:14px;
        }
        .q-hint { color:#475569; font-size:.87rem; margin-bottom:28px; }

        /* Rating */
        .rating-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
        .rating-btn {
          display:flex; flex-direction:column; align-items:center; gap:7px;
          padding:18px 6px;
          background:rgba(255,255,255,.04);
          border:2px solid rgba(255,255,255,.07);
          border-radius:12px; cursor:pointer;
          transition:all .22s cubic-bezier(.34,1.56,.64,1);
          font-family:inherit;
        }
        .rating-btn:hover {
          border-color:rgba(99,102,241,.4);
          background:rgba(99,102,241,.07);
          transform:translateY(-4px);
        }
        .rating-btn.sel {
          border-color:#6366f1;
          background:rgba(99,102,241,.18);
          transform:translateY(-4px);
          box-shadow:0 6px 22px rgba(99,102,241,.28);
        }
        .r-num {
          font-size:1.5rem; font-weight:900; color:#fff;
          transition:all .2s;
        }
        .rating-btn.sel .r-num {
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .r-lbl {
          font-size:.67rem; color:#475569; text-align:center;
          line-height:1.3; font-weight:500;
        }
        .rating-btn.sel .r-lbl { color:#a5b4fc; }

        /* Nav */
        .q-nav {
          display:flex; justify-content:space-between;
          max-width:700px; margin:22px auto;
        }

        /* Dots */
        .q-dots {
          display:flex; justify-content:center; flex-wrap:wrap;
          gap:5px; max-width:700px; margin:14px auto 0;
        }
        .q-dot {
          width:8px; height:8px; border-radius:50%;
          background:rgba(255,255,255,.08);
          transition:all .3s;
        }
        .q-dot.done { background:rgba(99,102,241,.45); }
        .q-dot.cur  {
          background:#6366f1; transform:scale(1.4);
          box-shadow:0 0 7px rgba(99,102,241,.7);
        }

        @media (max-width:600px) {
          .q-card { padding:26px 18px; }
          .rating-grid { gap:6px; }
          .rating-btn { padding:12px 4px; }
          .r-num { font-size:1.2rem; }
          .r-lbl { font-size:.6rem; }
          .q-text { font-size:1.15rem; }
        }
      `}</style>
    </div>
  )
}
