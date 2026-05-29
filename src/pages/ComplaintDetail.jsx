import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useParams, Link } from 'react-router-dom'

export default function ComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchComplaint() }, [id])

  const fetchComplaint = async () => {
    const snap = await getDoc(doc(db, 'complaints', id))
    if (snap.exists()) setComplaint({ id: snap.id, ...snap.data() })
    setLoading(false)
  }

  const updateStatus = async (status) => {
    setSaving(true)
    await updateDoc(doc(db, 'complaints', id), { status })
    setComplaint(prev => ({ ...prev, status }))
    setSaving(false)
  }

  if (loading) return <div style={{color:'white', textAlign:'center', padding:'40px'}}>Loading...</div>
  if (!complaint) return <div style={{color:'white', textAlign:'center', padding:'40px'}}>Not found</div>

  const fields = [
    { label: 'Complaint ID', value: complaint.complaint_id },
    { label: 'Type', value: complaint.complaint_type },
    { label: 'Location', value: complaint.location },
    { label: 'Road Type', value: complaint.road_type },
    { label: 'Landmark', value: complaint.landmark },
    { label: 'Pothole Size', value: complaint.pothole_size },
    { label: 'Pothole Depth', value: complaint.pothole_depth },
    { label: 'User Name', value: complaint.user_name },
    { label: 'Phone', value: complaint.phone_number },
    { label: 'Language', value: complaint.language_detected },
    { label: 'Timestamp', value: complaint.timestamp?.substring(0,19) },
  ]

  return (
    <div style={{minHeight:'100vh', background:'#0f172a', color:'white'}}>
      <nav style={{
        background:'rgba(255,255,255,0.05)',
        borderBottom:'1px solid rgba(255,255,255,0.1)',
        padding:'16px 24px'
      }}>
        <Link to="/complaints" style={{color:'#94a3b8', textDecoration:'none'}}>← Back to Complaints</Link>
      </nav>

      <div style={{padding:'24px', maxWidth:'800px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
          <h2>{complaint.complaint_id}</h2>
          <span style={{
            padding:'8px 16px', borderRadius:'20px', fontSize:'14px',
            background: complaint.severity_score >= 7 ? 'rgba(239,68,68,0.2)' : 'rgba(249,115,22,0.2)',
            color: complaint.severity_score >= 7 ? '#ef4444' : '#f97316'
          }}>Severity: {complaint.severity_score}/10</span>
        </div>

        {/* Status Update */}
        <div style={{
          background:'rgba(255,255,255,0.05)',
          borderRadius:'16px', padding:'20px', marginBottom:'20px'
        }}>
          <h3 style={{marginBottom:'16px', color:'#94a3b8'}}>Update Status</h3>
          <div style={{display:'flex', gap:'12px'}}>
            {['pending', 'assigned', 'resolved'].map(s => (
              <button key={s} onClick={() => updateStatus(s)} style={{
                padding:'10px 20px',
                background: complaint.status === s ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                border:'none', borderRadius:'10px',
                color:'white', cursor:'pointer', textTransform:'capitalize',
                opacity: saving ? 0.5 : 1
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{
          background:'rgba(255,255,255,0.05)',
          borderRadius:'16px', padding:'20px', marginBottom:'20px'
        }}>
          <h3 style={{marginBottom:'16px', color:'#94a3b8'}}>Complaint Details</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
            {fields.map((f, i) => f.value && (
              <div key={i}>
                <div style={{color:'#64748b', fontSize:'12px', marginBottom:'4px'}}>{f.label}</div>
                <div style={{color:'white', fontSize:'14px'}}>{f.value || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Authority */}
        {complaint.authority_assigned?.org_name && (
          <div style={{
            background:'rgba(59,130,246,0.1)',
            border:'1px solid rgba(59,130,246,0.3)',
            borderRadius:'16px', padding:'20px'
          }}>
            <h3 style={{marginBottom:'16px', color:'#3b82f6'}}>Assigned Authority</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              <div>
                <div style={{color:'#64748b', fontSize:'12px'}}>Organization</div>
                <div style={{color:'white', fontSize:'14px'}}>{complaint.authority_assigned.org_name}</div>
              </div>
              <div>
                <div style={{color:'#64748b', fontSize:'12px'}}>Contact</div>
                <div style={{color:'white', fontSize:'14px'}}>{complaint.authority_assigned.contact}</div>
              </div>
              <div>
                <div style={{color:'#64748b', fontSize:'12px'}}>Engineer</div>
                <div style={{color:'white', fontSize:'14px'}}>{complaint.authority_assigned.executive_engineer}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}