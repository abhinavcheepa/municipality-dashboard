import { useState, useEffect } from 'react'
import { db, auth } from '../services/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { FileText, Clock, CheckCircle, AlertTriangle, LogOut, ArrowRight, Activity } from 'lucide-react'

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Resolved: '#10b981',
  Assigned: '#3b82f6'
}

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
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count: complaints.filter(c => c.complaint_type === type).length
  }))

  const statusData = [
    { name: 'Pending', value: complaints.filter(c => c.status === 'pending').length },
    { name: 'Assigned', value: complaints.filter(c => c.status === 'assigned').length },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length },
  ].filter(s => s.value > 0)

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{label}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#ffffff', fontWeight: '700' }}>
            Count: <span style={{ color: 'var(--color-primary)' }}>{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-canvas)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Loading Dashboard...</div>
      </div>
    </div>
  )

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🛣️
          </div>
          <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            Road Complaint System
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/complaints" style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px', transition: 'color 0.2s' }}>
            Complaints List
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{
            padding: '8px 16px',
            fontSize: '13px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderColor: 'rgba(244, 63, 94, 0.15)',
            background: 'rgba(244, 63, 94, 0.05)',
            color: 'var(--color-danger)'
          }}>
            <LogOut style={{ width: '14px', height: '14px' }} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">

        {/* Dashboard Title Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Operations Dashboard
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              Real-time monitoring of road complaints, anomalies, and dispatch status.
            </p>
          </div>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', fontSize: '13px' }}>
            <Activity style={{ width: '16px', height: '16px', color: 'var(--color-success)' }} />
            <span style={{ color: 'var(--text-muted)' }}>System Status:</span>
            <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>Active</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Complaints', value: stats.total, color: 'var(--color-primary)', border: 'rgba(59, 130, 246, 0.3)', icon: <FileText style={{ width: '22px', height: '22px' }} />, bg: 'rgba(59, 130, 246, 0.04)' },
            { label: 'Pending Dispatch', value: stats.pending, color: 'var(--color-warning)', border: 'var(--color-warning-border)', icon: <Clock style={{ width: '22px', height: '22px' }} />, bg: 'var(--color-warning-bg)' },
            { label: 'Resolved Cases', value: stats.resolved, color: 'var(--color-success)', border: 'var(--color-success-border)', icon: <CheckCircle style={{ width: '22px', height: '22px' }} />, bg: 'var(--color-success-bg)' },
            { label: 'High Severity Alerts', value: stats.high, color: 'var(--color-danger)', border: 'var(--color-danger-border)', icon: <AlertTriangle style={{ width: '22px', height: '22px' }} />, bg: 'var(--color-danger-bg)' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{
              padding: '24px',
              borderBottom: `3px solid ${s.color}`,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{s.label}</span>
                <div style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  color: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {s.icon}
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'var(--font-heading)', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {s.value || 0}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 2fr 1fr))', gap: '20px', marginBottom: '32px' }}>

          {/* Bar Chart */}
          <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
              Complaints By Category
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="count" fill="url(#barGlow)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
              Resolution Progress
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="47%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'white', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Pie Chart Custom Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '-10px', flexWrap: 'wrap' }}>
              {statusData.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[s.name] }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="glass-card" style={{ padding: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                Recent Ingress Complaints
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0 0' }}>
                Latest 5 items received through civil interface.
              </p>
            </div>
            <Link to="/complaints" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-primary)'
            }}>
              <span>Manage All</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  {['Complaint ID', 'Anomaly Type', 'Location Address', 'Severity Score', 'Dispatch Status'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/complaint/${c.id}`)}>
                    <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{c.complaint_id}</td>
                    <td style={{ textTransform: 'capitalize' }}>{c.complaint_type || 'N/A'}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}