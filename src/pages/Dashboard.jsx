import { useState, useEffect } from 'react'
import { db, auth } from '../services/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

export default function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setComplaints(data)

      // Stats calculate karo
      const total = data.length
      const pending = data.filter(c => c.status === 'pending').length
      const resolved = data.filter(c => c.status === 'resolved').length
      const high = data.filter(c => c.severity_score >= 7).length

      setStats({ total, pending, resolved, high })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  // Chart data
  const typeData = ['pothole', 'waterlogging', 'drainage', 'streetlight', 'garbage'].map(type => ({
    name: type,
    count: complaints.filter(c => c.complaint_type === type).length
  }))

  const statusData = [
    { name: 'Pending', value: complaints.filter(c => c.status === 'pending').length },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length },
    { name: 'Assigned', value: complaints.filter(c => c.status === 'assigned').length },
  ]

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0f172a'}}>
      <div style={{color:'white'}}>Loading...</div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh', background:'#0f172a', color:'white'}}>
      {/* Navbar */}
      <nav style={{
        background:'rgba(255,255,255,0.05)',
        borderBottom:'1px solid rgba(255,255,255,0.1)',
        padding:'16px 24px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{fontSize:'24px'}}>🛣️</span>
          <span style={{fontSize:'18px', fontWeight:'700'}}>Road Complaint System</span>
        </div>
        <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
          <Link to="/complaints" style={{color:'#94a3b8', textDecoration:'none'}}>Complaints</Link>
          <button onClick={handleLogout} style={{
            padding:'8px 16px',
            background:'rgba(239,68,68,0.2)',
            border:'1px solid rgba(239,68,68,0.4)',
            borderRadius:'8px',
            color:'#ef4444',
            cursor:'pointer'
          }}>Logout</button>
        </div>
      </nav>

      <div style={{padding:'24px'}}>
        {/* Stats Cards */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px'}}>
          {[
            { label: 'Total Complaints', value: stats.total, color: '#3b82f6', icon: '📋' },
            { label: 'Pending', value: stats.pending, color: '#f97316', icon: '⏳' },
            { label: 'Resolved', value: stats.resolved, color: '#22c55e', icon: '✅' },
            { label: 'High Severity', value: stats.high, color: '#ef4444', icon: '🚨' },
          ].map((s, i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.05)',
              border:`1px solid ${s.color}33`,
              borderRadius:'16px',
              padding:'20px'
            }}>
              <div style={{fontSize:'32px', marginBottom:'8px'}}>{s.icon}</div>
              <div style={{fontSize:'32px', fontWeight:'700', color:s.color}}>{s.value || 0}</div>
              <div style={{color:'#94a3b8', fontSize:'14px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px', marginBottom:'24px'}}>
          <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px'}}>
            <h3 style={{marginBottom:'16px', color:'#94a3b8'}}>Complaints by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{background:'#1e293b', border:'none'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px'}}>
            <h3 style={{marginBottom:'16px', color:'#94a3b8'}}>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{background:'#1e293b', border:'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Complaints */}
        <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
            <h3 style={{color:'#94a3b8'}}>Recent Complaints</h3>
            <Link to="/complaints" style={{color:'#3b82f6', textDecoration:'none', fontSize:'14px'}}>View All →</Link>
          </div>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                {['ID', 'Type', 'Location', 'Severity', 'Status'].map(h => (
                  <th key={h} style={{padding:'12px', textAlign:'left', color:'#64748b', fontSize:'13px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 5).map(c => (
                <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)', cursor:'pointer'}}
                  onClick={() => navigate(`/complaint/${c.id}`)}>
                  <td style={{padding:'12px', fontSize:'13px', color:'#3b82f6'}}>{c.complaint_id}</td>
                  <td style={{padding:'12px', fontSize:'13px'}}>{c.complaint_type || 'N/A'}</td>
                  <td style={{padding:'12px', fontSize:'13px', color:'#94a3b8'}}>{c.location?.substring(0,30) || 'N/A'}</td>
                  <td style={{padding:'12px'}}>
                    <span style={{
                      padding:'4px 8px',
                      borderRadius:'20px',
                      fontSize:'12px',
                      background: c.severity_score >= 7 ? 'rgba(239,68,68,0.2)' : c.severity_score >= 4 ? 'rgba(249,115,22,0.2)' : 'rgba(34,197,94,0.2)',
                      color: c.severity_score >= 7 ? '#ef4444' : c.severity_score >= 4 ? '#f97316' : '#22c55e'
                    }}>{c.severity_score}/10</span>
                  </td>
                  <td style={{padding:'12px'}}>
                    <span style={{
                      padding:'4px 8px',
                      borderRadius:'20px',
                      fontSize:'12px',
                      background: c.status === 'resolved' ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)',
                      color: c.status === 'resolved' ? '#22c55e' : '#f97316'
                    }}>{c.status || 'pending'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}