import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Shield, CheckCircle, MapPin, Milestone, Calendar, AlertTriangle, Layers, Maximize2, MoveRight, User, Phone, Languages, HelpCircle } from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchComplaint() }, [id])

  const fetchComplaint = async () => {
    try {
      const snap = await getDoc(doc(db, 'complaints', id))
      if (snap.exists()) setComplaint({ id: snap.id, ...snap.data() })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const updateStatus = async (status) => {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'complaints', id), { status })
      setComplaint(prev => ({ ...prev, status }))
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-canvas)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading case details...</div>
      </div>
    </div>
  )

  if (!complaint) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-card" style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '400px' }}>
        <HelpCircle style={{ width: '48px', height: '48px', color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Complaint Record Not Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 24px 0' }}>
          The requested complaint identifier does not exist or may have been archived.
        </p>
        <Link to="/complaints" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
          Back to Register
        </Link>
      </div>
    </div>
  )

  const severity = complaint.severity_score || 0;
  const isHighSeverity = severity >= 7;
  const isMediumSeverity = severity >= 4 && severity < 7;

  const currentStatus = complaint.status || 'pending';

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '48px' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(9, 13, 22, 0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/complaints" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600' }}>
          <ArrowLeft style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
          <span>Back to Register</span>
        </Link>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
        
        {/* Title and Severity Tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Anomaly Case File
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>
              {complaint.complaint_id}
            </h2>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '12px',
            background: isHighSeverity ? 'var(--color-danger-bg)' : isMediumSeverity ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
            border: `1px solid ${isHighSeverity ? 'var(--color-danger-border)' : isMediumSeverity ? 'var(--color-warning-border)' : 'var(--color-success-border)'}`
          }}>
            <AlertTriangle style={{
              width: '16px',
              height: '16px',
              color: isHighSeverity ? 'var(--color-danger)' : isMediumSeverity ? 'var(--color-warning)' : 'var(--color-success)'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: isHighSeverity ? 'var(--color-danger)' : isMediumSeverity ? 'var(--color-warning)' : 'var(--color-success)'
            }}>
              Severity Index: {severity}/10
            </span>
          </div>
        </div>

        {/* Tactile Stepper Timeline Card */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Dispatch Lifecycle Track
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '0 20px', flexWrap: 'wrap', gap: '20px' }}>
            
            {/* Connecting lines */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '10%',
              right: '10%',
              height: '3px',
              background: 'rgba(255,255,255,0.06)',
              zIndex: 0
            }} />
            
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '10%',
              width: currentStatus === 'resolved' ? '80%' : currentStatus === 'assigned' ? '40%' : '0%',
              height: '3px',
              background: currentStatus === 'resolved' ? 'var(--color-success)' : 'var(--color-primary)',
              boxShadow: currentStatus === 'resolved' ? '0 0 10px rgba(16, 185, 129, 0.4)' : '0 0 10px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.4s ease',
              zIndex: 1
            }} />

            {/* Stepper Node: Pending */}
            {[
              { statusKey: 'pending', label: 'Pending Dispatch', icon: <Clock style={{ width: '18px', height: '18px' }} />, activeBg: 'var(--color-warning)', activeColor: 'var(--color-warning)' },
              { statusKey: 'assigned', label: 'Engineer Assigned', icon: <Shield style={{ width: '18px', height: '18px' }} />, activeBg: 'var(--color-primary)', activeColor: 'var(--color-primary)' },
              { statusKey: 'resolved', label: 'Anomaly Resolved', icon: <CheckCircle style={{ width: '18px', height: '18px' }} />, activeBg: 'var(--color-success)', activeColor: 'var(--color-success)' },
            ].map((node, i) => {
              const isSelected = currentStatus === node.statusKey;
              const isPast = (currentStatus === 'resolved') || (currentStatus === 'assigned' && node.statusKey === 'pending');
              const isFinished = currentStatus === 'resolved';

              return (
                <button
                  key={i}
                  disabled={saving}
                  onClick={() => updateStatus(node.statusKey)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    zIndex: 2,
                    opacity: saving ? 0.6 : 1,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isSelected ? node.activeBg : isPast ? (isFinished ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--bg-surface-elevated)',
                    border: `2px solid ${isSelected ? '#ffffff' : isPast ? (isFinished ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--border-color)'}`,
                    color: isSelected || isPast ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected ? `0 0 16px 2px ${node.activeColor}55` : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {node.icon}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isSelected || isPast ? '600' : '500',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    marginTop: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    {node.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modular Complaint Detail Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Technical Diagnostics */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: 'var(--color-primary)' }}>
              <Layers style={{ width: '18px', height: '18px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                Anomaly Diagnosis
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Anomaly Type</div>
                <div style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{complaint.complaint_type || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Pothole Size / Breadth</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{complaint.pothole_size ? `${complaint.pothole_size}` : 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Estimated Depth</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{complaint.pothole_depth ? `${complaint.pothole_depth}` : 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Card 2: Incident Location */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: 'var(--color-primary)' }}>
              <MapPin style={{ width: '18px', height: '18px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                Incident Location
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Site Address</div>
                <div style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.4' }}>{complaint.location || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Landmark</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{complaint.landmark || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Road Segment Type</div>
                <div style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{complaint.road_type || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Card 3: Reporter Information */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: 'var(--color-primary)' }}>
              <User style={{ width: '18px', height: '18px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                Reporter Information
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Reporter Name</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{complaint.user_name || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Contact Phone</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{complaint.phone_number || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Ingress Language</div>
                <div style={{ display: 'inline-flex', marginTop: '2px' }}>
                  <span className="badge badge-assigned" style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 8px' }}>
                    {complaint.language_detected || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Detail Slip (Authority Card) */}
        {complaint.authority_assigned?.org_name ? (
          <div className="glass-card animate-fade-in" style={{
            padding: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 10px 24px -5px rgba(59, 130, 246, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <Shield style={{ width: '18px', height: '18px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                  Assigned Authority Dispatch Slip
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '2px 0 0 0' }}>
                  Engineering department dispatched for onsite repairs.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Organization Unit</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>{complaint.authority_assigned.org_name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Executive Engineer</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{complaint.authority_assigned.executive_engineer || 'Unassigned'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '2px' }}>Emergency Contact</div>
                <div style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone style={{ width: '12px', height: '12px', color: 'var(--color-success)' }} />
                  <span>{complaint.authority_assigned.contact || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{
            padding: '24px',
            textAlign: 'center',
            borderStyle: 'dashed',
            borderColor: 'var(--border-color)',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <Shield style={{ width: '28px', height: '28px', color: 'var(--text-dim)', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>No Active Authority Dispatched</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '12px', margin: 0 }}>This case is currently waiting for initial inspection approval.</p>
          </div>
        )}

        {/* Timestamp */}
        {complaint.timestamp && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '32px', color: 'var(--text-dim)', fontSize: '12px' }}>
            <Calendar style={{ width: '12px', height: '12px' }} />
            <span>Ingress Date: {complaint.timestamp.substring(0, 10)}</span>
            <span>•</span>
            <span>Time: {complaint.timestamp.substring(11, 19)}</span>
          </div>
        )}
      </div>
    </div>
  )
}