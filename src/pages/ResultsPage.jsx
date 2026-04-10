import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import jsPDF from 'jspdf'
import { supabase } from '../lib/supabase'
import { STREAMS } from '../lib/scoring'

/* ── helpers ── */
function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [99, 102, 241]
}

const STREAM_COLOR = {
  pcm: '#06b6d4', pcb: '#10b981',
  commerce: '#f59e0b', humanities: '#a855f7', polytechnic: '#f97316',
}

/* ── custom tooltip ── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#0e1428', border: '1px solid rgba(255,255,255,.12)',
      borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: '.85rem',
    }}>
      <strong>{d.fullName}</strong>
      <div style={{ color: d.color, fontWeight: 700, marginTop: 2 }}>{d.score}%</div>
    </div>
  )
}

/* ── PDF generator ── */
function buildPDF(assessment, stream, user) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, H = 297, M = 20

  // Dark background
  doc.setFillColor(10, 15, 30); doc.rect(0, 0, W, H, 'F')

  // Top accent bar
  doc.setFillColor(99, 102, 241); doc.rect(0, 0, W, 2.5, 'F')

  // Logo
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22)
  doc.setTextColor(255, 255, 255); doc.text('StreamSense', M, 18)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  doc.setTextColor(71, 85, 105); doc.text('Career Guidance Report', M, 26)

  const dateStr = new Date(assessment.created_at)
    .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(`Generated: ${dateStr}`, M, 32)
  doc.setTextColor(100, 116, 139)
  doc.text(`Student: ${user.email}`, W - M, 26, { align: 'right' })

  // Divider
  doc.setDrawColor(30, 41, 59); doc.setLineWidth(0.4)
  doc.line(M, 38, W - M, 38)

  // Recommended stream box
  const [sr, sg, sb] = hexToRgb(stream.color)
  doc.setFillColor(sr, sg, sb, 0.12)
  doc.roundedRect(M, 44, W - 2 * M, 46, 4, 4, 'F')
  doc.setDrawColor(sr, sg, sb); doc.setLineWidth(0.5)
  doc.roundedRect(M, 44, W - 2 * M, 46, 4, 4, 'S')

  doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
  doc.setTextColor(sr, sg, sb)
  doc.text('YOUR RECOMMENDED STREAM', W / 2, 53, { align: 'center' })

  doc.setFontSize(20); doc.setTextColor(255, 255, 255)
  doc.text(`${stream.icon}  ${stream.name}`, W / 2, 65, { align: 'center' })

  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  doc.setTextColor(sr, sg, sb)
  doc.text(stream.tagline, W / 2, 74, { align: 'center' })

  doc.setFontSize(8.5); doc.setTextColor(100, 116, 139)
  const descLines = doc.splitTextToSize(stream.description, W - 2 * M - 10)
  doc.text(descLines, W / 2, 100, { align: 'center' })

  // Score Breakdown
  let y = 100 + descLines.length * 4.5 + 8
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12)
  doc.setTextColor(255, 255, 255); doc.text('Score Breakdown', M, y); y += 7

  Object.keys(STREAMS).forEach((key) => {
    const [r, g, b] = hexToRgb(STREAM_COLOR[key])
    const pct = assessment.scores?.[key] || 0
    const isRec = key === assessment.recommended_stream

    if (isRec) {
      doc.setFillColor(r, g, b, 0.08)
      doc.roundedRect(M, y - 4, W - 2 * M, 13, 2, 2, 'F')
    }

    doc.setFont('helvetica', isRec ? 'bold' : 'normal')
    doc.setFontSize(8.5); doc.setTextColor(r, g, b)
    doc.text(STREAMS[key].name, M + 3, y + 5)

    const barX = M + 62, barW = W - 2 * M - 74
    doc.setFillColor(20, 27, 45); doc.roundedRect(barX, y + 1, barW, 5, 1, 1, 'F')
    if (pct > 0) {
      doc.setFillColor(r, g, b)
      doc.roundedRect(barX, y + 1, Math.max(barW * (pct / 100), 3), 5, 1, 1, 'F')
    }

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.text(`${pct}%`, W - M - 1, y + 5, { align: 'right' })
    y += 14
  })

  // Career Paths
  y += 4
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12)
  doc.setTextColor(255, 255, 255); doc.text('Career Paths', M, y); y += 7

  stream.careers.forEach((career) => {
    const [r, g, b] = hexToRgb(stream.color)
    doc.setFillColor(r, g, b)
    doc.circle(M + 3, y + 2.5, 1.8, 'F')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5)
    doc.setTextColor(203, 213, 225)
    doc.text(career, M + 8, y + 4)
    y += 8
  })

  // Top Institutions
  y += 2
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
  doc.setTextColor(100, 116, 139); doc.text('Top Institutions:', M, y); y += 6
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5)
  doc.setTextColor(148, 163, 184)
  stream.colleges.forEach((c) => {
    doc.text(`• ${c}`, M + 4, y); y += 6
  })

  // Footer
  doc.setDrawColor(20, 30, 50); doc.setLineWidth(0.3)
  doc.line(M, H - 16, W - M, H - 16)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5)
  doc.setTextColor(51, 65, 85)
  doc.text(
    'Generated by StreamSense · Free Career Guidance for Post-10th Students',
    W / 2, H - 9, { align: 'center' }
  )

  doc.save(`StreamSense_${stream.name.replace(/\s|–/g, '_')}.pdf`)
}

/* ════════════════════════════════════ COMPONENT ═══════════ */
export default function ResultsPage({ user }) {
  const { id } = useParams()
  const [assessment, setAssessment] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [dlLoading,  setDlLoading]  = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (!error) setAssessment(data)
      setLoading(false)
    })()
  }, [id])

  if (loading) return <Spinner text="Loading your results…" />
  if (!assessment) return (
    <div style={{ textAlign: 'center', paddingTop: 140, color: '#475569' }}>
      Assessment not found.
    </div>
  )

  const stream = STREAMS[assessment.recommended_stream]
  const scores = assessment.scores || {}

  const chartData = Object.keys(STREAMS).map((key) => ({
    name:     STREAMS[key].name.replace('Science – ', '').replace('Science –', ''),
    fullName: STREAMS[key].name,
    score:    scores[key] || 0,
    color:    STREAM_COLOR[key],
  }))

  const handlePDF = () => {
    setDlLoading(true)
    try { buildPDF(assessment, stream, user) }
    finally { setTimeout(() => setDlLoading(false), 800) }
  }

  return (
    <div className="results-page">
      <div className="container">

        {/* Header */}
        <div className="res-header animate-fadeUp">
          <div className="badge badge-primary">Assessment Complete 🎉</div>
          <h1 className="heading-lg" style={{ marginTop: 12 }}>Your Results Are Ready</h1>
          <p className="res-date">
            {new Date(assessment.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        {/* Recommended stream hero card */}
        <div
          className="rec-card card animate-scaleIn"
          style={{ '--sc': stream.color }}
        >
          <div className="rec-top-row">
            <div>
              <span className="rec-label">Your Best-Fit Stream</span>
              <h2 className="rec-name" style={{ color: stream.color }}>{stream.name}</h2>
              <p  className="rec-tag">{stream.tagline}</p>
            </div>
            <span className="rec-big-icon">{stream.icon}</span>
          </div>

          <p className="rec-desc">{stream.description}</p>

          <div className="rec-match" style={{
            background: `${stream.color}18`,
            border:     `1px solid ${stream.color}40`,
            color:       stream.color,
          }}>
            ✦ Match Score: <strong>{scores[assessment.recommended_stream]}%</strong>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="res-grid">

          {/* Score chart */}
          <div className="card res-panel animate-fadeUp delay-1">
            <h3 className="panel-title">Score Breakdown</h3>
            <p  className="panel-sub">Your alignment across all five streams</p>
            <div style={{ marginTop: 24, height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 24, top: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" horizontal={false} />
                  <XAxis
                    type="number" domain={[0, 100]}
                    tick={{ fill: '#334155', fontSize: 11 }}
                    tickLine={false} axisLine={false} unit="%"
                  />
                  <YAxis
                    dataKey="name" type="category" width={52}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={false} axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,.03)' }} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={22}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        fillOpacity={entry.fullName === stream.name ? 1 : 0.4}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* All-stream score pills */}
            <div className="score-pills">
              {Object.keys(STREAMS).map((key) => (
                <div key={key} className={`score-pill ${key === assessment.recommended_stream ? 'pill-rec' : ''}`}
                  style={{ '--pc': STREAM_COLOR[key] }}>
                  <span className="pill-icon">{STREAMS[key].icon}</span>
                  <span className="pill-val" style={{ color: STREAM_COLOR[key] }}>{scores[key] || 0}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career paths */}
          <div className="card res-panel animate-fadeUp delay-2">
            <h3 className="panel-title">Career Paths in {stream.name}</h3>
            <p  className="panel-sub">Real options within your recommended stream</p>

            <div className="career-list">
              {stream.careers.map((c, i) => (
                <div key={i} className="career-row">
                  <div className="career-dot" style={{ background: stream.color }} />
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <div className="colleges-box">
              <span className="colleges-lbl">Top Institutions</span>
              <div className="colleges-chips">
                {stream.colleges.map((c, i) => (
                  <span key={i} className="c-chip">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="res-actions animate-fadeUp delay-3">
          <button className="btn btn-primary btn-lg" onClick={handlePDF} disabled={dlLoading}>
            {dlLoading ? 'Generating…' : '📄 Download PDF Report'}
          </button>
          <Link to="/assessment" className="btn btn-outline btn-lg">🔄 Retake Assessment</Link>
          <Link to="/dashboard"  className="btn btn-ghost  btn-lg">View Dashboard</Link>
        </div>
      </div>

      <style>{`
        .results-page {
          min-height:100vh; padding-top:100px; padding-bottom:80px;
          position:relative; z-index:1;
        }
        .res-header { text-align:center; margin-bottom:40px; }
        .res-date   { color:#334155; font-size:.85rem; margin-top:6px; }

        /* Rec card */
        .rec-card {
          padding:36px 40px; margin-bottom:28px;
          position:relative; overflow:hidden;
          background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.06));
        }
        .rec-card::before {
          content:''; position:absolute; top:0; left:0; right:0;
          height:3px; background:var(--sc);
        }
        .rec-top-row {
          display:flex; align-items:flex-start; justify-content:space-between;
          margin-bottom:14px;
        }
        .rec-label {
          font-size:.75rem; font-weight:700; text-transform:uppercase;
          letter-spacing:.08em; color:#334155; display:block; margin-bottom:6px;
        }
        .rec-name  { font-size:2rem; font-weight:900; letter-spacing:-.02em; margin-bottom:4px; }
        .rec-tag   { color:#94a3b8; font-weight:500; }
        .rec-big-icon { font-size:3rem; }
        .rec-desc  { color:#64748b; font-size:.9rem; line-height:1.75; max-width:720px; margin-bottom:18px; }
        .rec-match {
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 18px; border-radius:999px; font-size:.85rem; font-weight:600;
        }

        /* Grid */
        .res-grid {
          display:grid; grid-template-columns:1fr 1fr;
          gap:22px; margin-bottom:30px;
        }
        .res-panel { padding:26px; }
        .panel-title { font-size:1.08rem; font-weight:700; margin-bottom:4px; }
        .panel-sub   { font-size:.83rem; color:#475569; }

        /* Pill row */
        .score-pills {
          display:flex; gap:8px; flex-wrap:wrap; margin-top:20px;
          padding-top:16px; border-top:1px solid rgba(255,255,255,.06);
        }
        .score-pill {
          display:flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:999px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.07); font-size:.78rem;
        }
        .score-pill.pill-rec {
          background:rgba(var(--pc),.12); border-color:rgba(var(--pc),.3);
        }
        .pill-icon { font-size:.95rem; }
        .pill-val  { font-weight:700; }

        /* Careers */
        .career-list { display:flex; flex-direction:column; gap:9px; margin-top:18px; }
        .career-row  { display:flex; align-items:center; gap:10px; font-size:.88rem; color:#cbd5e1; }
        .career-dot  { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

        /* Colleges */
        .colleges-box  { margin-top:18px; padding-top:14px; border-top:1px solid rgba(255,255,255,.06); }
        .colleges-lbl  { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#334155; display:block; margin-bottom:8px; }
        .colleges-chips{ display:flex; flex-wrap:wrap; gap:6px; }
        .c-chip {
          padding:4px 10px; border-radius:6px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          font-size:.74rem; color:#94a3b8;
        }

        /* Actions */
        .res-actions {
          display:flex; gap:14px; justify-content:center; flex-wrap:wrap;
        }

        @media (max-width:768px) {
          .res-grid  { grid-template-columns:1fr; }
          .rec-name  { font-size:1.6rem; }
          .rec-top-row { flex-direction:row; }
        }
      `}</style>
    </div>
  )
}

function Spinner({ text }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', flexDirection:'column', gap:16,
    }}>
      <div className="spinner" />
      <p style={{ color:'#475569', fontSize:'.88rem' }}>{text}</p>
    </div>
  )
}
