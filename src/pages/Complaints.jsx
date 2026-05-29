import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchComplaints() }, [])

  useEffect(() => {
    let data = complaints
    if (filter !== 'all') data = data.filter(c => c.status === filter)
    if (search) data = data.filter(c =>
      c.complaint_id?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_type?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(data)
  }, [search, filter, complaints])

  const fetchComplaints = async () => {
    const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'))
    const snap = await getDocs(q)
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setComplaints(data)
    setFiltered(data)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'complaints', id), { status })
    fetchComplaints()
  }

  return (
    <div style={{minHeight:'100vh', background:'#0f172a', color:'white'}}>
      <nav style={{
        background:'rgba(255,255,255,0.05)',
        borderBottom:'1px solid rgba(255,255,255,0.1)',
        padding:'16px 24px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <Link to="/" style={{color:'white', textDecoration:'none', display:'flex', alignItems:'center', gap:'8px'}}>
          <span>←</span> <span>🛣️ Road Complaint System</span>
        </Link>
      </nav>

      <div style={{padding:'24px'}}>
        <h2 style={{marginBottom:'20px'}}>All Complaints</h2>

        {/* Filters */}
        <div style={{display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap'}}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, location, type..."
            style={{
              flex:1, minWidth:'200px',
              padding:'10px 16px',
              background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:'10px',
              color:'white',
              outline:'none'
            }}
          />
          {['all', 'pending', 'assigned', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:'10px 20px',
              background: filter === s ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              border:'none', borderRadius:'10px',
              color:'white', cursor:'pointer', textTransform:'capitalize'
            }}>{s}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'rgba(255,255,255,0.05)'}}>
                {['ID', 'Type', 'Location', 'Severity', 'Status', 'Action'].map(h => (
                  <th key={h} style={{padding:'14px 12px', textAlign:'left', color:'#64748b', fontSize:'13px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding:'12px', fontSize:'13px', color:'#3b82f6', cursor:'pointer'}}
                    onClick={() => navigate(`/complaint/${c.id}`)}>{c.complaint_id}</td>
                  <td style={{padding:'12px', fontSize:'13px', textTransform:'capitalize'}}>{c.complaint_type || 'N/A'}</td>
                  <td style={{padding:'12px', fontSize:'13px', color:'#94a3b8', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.location || 'N/A'}</td>
                  <td style={{padding:'12px'}}>
                    <span style={{
                      padding:'4px 8px', borderRadius:'20px', fontSize:'12px',
                      background: c.severity_score >= 7 ? 'rgba(239,68,68,0.2)' : 'rgba(249,115,22,0.2)',
                      color: c.severity_score >= 7 ? '#ef4444' : '#f97316'
                    }}>{c.severity_score}/10</span>
                  </td>
                  <td style={{padding:'12px'}}>
                    <span style={{
                      padding:'4px 8px', borderRadius:'20px', fontSize:'12px',
                      background: c.status === 'resolved' ? 'rgba(34,197,94,0.2)' : c.status === 'assigned' ? 'rgba(59,130,246,0.2)' : 'rgba(249,115,22,0.2)',
                      color: c.status === 'resolved' ? '#22c55e' : c.status === 'assigned' ? '#3b82f6' : '#f97316'
                    }}>{c.status || 'pending'}</span>
                  </td>
                  <td style={{padding:'12px'}}>
                    <select
                      value={c.status || 'pending'}
                      onChange={e => updateStatus(c.id, e.target.value)}
                      style={{
                        padding:'6px 10px',
                        background:'rgba(255,255,255,0.1)',
                        border:'1px solid rgba(255,255,255,0.2)',
                        borderRadius:'8px',
                        color:'white',
                        cursor:'pointer',
                        fontSize:'12px'
                      }}
                    >
                      <option value="pending" style={{background:'#1e293b'}}>Pending</option>
                      <option value="assigned" style={{background:'#1e293b'}}>Assigned</option>
                      <option value="resolved" style={{background:'#1e293b'}}>Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{textAlign:'center', padding:'40px', color:'#64748b'}}>No complaints found</div>
          )}
        </div>
      </div>
    </div>
  )
}