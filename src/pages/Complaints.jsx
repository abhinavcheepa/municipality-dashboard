import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowLeft, Filter, RefreshCw } from 'lucide-react'

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchComplaints() }, [])

  useEffect(() => {
    let data = complaints
    if (filter !== 'all') data = data.filter(c => c.status === filter)
    if (search) {
      const lower = search.toLowerCase()
      data = data.filter(c =>
        c.complaint_id?.toLowerCase().includes(lower) ||
        c.location?.toLowerCase().includes(lower) ||
        c.complaint_type?.toLowerCase().includes(lower)
      )
    }
    setFiltered(data)
  }, [search, filter, complaints])

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setComplaints(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateDoc(doc(db, 'complaints', id), { status })
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    } catch (err) {
      console.error(err)
    }
    setUpdatingId(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '40px' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(9, 13, 22, 0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600' }}>
          <ArrowLeft style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
          <span>Back to Dashboard</span>
        </Link>
        <button onClick={fetchComplaints} className="btn btn-secondary" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw style={{ width: '12px', height: '12px' }} />
          <span>Refresh</span>
        </button>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
        
        {/* Page Title */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Complaint Register
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            Search, filter, and dispatch authorities for reported road defects.
          </p>
        </div>

        {/* Search and Filters Section */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search Input Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
              width: '18px',
              height: '18px'
            }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, location address, or defect type..."
              className="custom-input"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          {/* Segmented Filter Control */}
          <div className="glass-card" style={{
            display: 'flex',
            padding: '4px',
            gap: '4px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            alignItems: 'center'
          }}>
            <div style={{ padding: '0 8px 0 10px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
              <Filter style={{ width: '14px', height: '14px' }} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>Status:</span>
            </div>
            {['all', 'pending', 'assigned', 'resolved'].map(s => {
              const isActive = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: '6px 14px',
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: isActive ? '600' : '500',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Complaints Table Container */}
        <div className="glass-card" style={{ padding: '8px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading register records...</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    {['Complaint ID', 'Anomaly Type', 'Location Address', 'Severity Score', 'Dispatch Status', 'Dispatch Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/complaint/${c.id}`)}>
                      <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{c.complaint_id}</td>
                      <td style={{ textTransform: 'capitalize' }}>{c.complaint_type || 'N/A'}</td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.location || 'N/A'}
                      </td>
                      <td>
                        <span className={c.severity_score >= 7 ? 'badge badge-danger' : c.severity_score >= 4 ? 'badge badge-pending' : 'badge badge-resolved'}>
                          {c.severity_score}/10
                        </span>
                      </td>
                      <td>
                        <span className={c.status === 'resolved' ? 'badge badge-resolved' : c.status === 'assigned' ? 'badge badge-assigned' : 'badge badge-pending'}>
                          {c.status || 'pending'}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <select
                          value={c.status || 'pending'}
                          onChange={e => updateStatus(c.id, e.target.value)}
                          disabled={updatingId === c.id}
                          className="custom-select"
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            fontSize: '12px',
                            borderRadius: '8px'
                          }}
                        >
                          <option value="pending" style={{ background: '#0f172a', color: 'white' }}>Pending</option>
                          <option value="assigned" style={{ background: '#0f172a', color: 'white' }}>Assigned</option>
                          <option value="resolved" style={{ background: '#0f172a', color: 'white' }}>Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>No matching complaints found</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>Try refining your search filter query.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}