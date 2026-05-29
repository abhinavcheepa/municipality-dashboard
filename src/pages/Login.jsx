import { useState } from 'react'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
      } catch (err2) {
        setError('Login failed. Check credentials.')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '400px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{textAlign:'center', marginBottom:'30px'}}>
          <div style={{fontSize:'48px'}}>🛣️</div>
          <h1 style={{color:'white', fontSize:'24px', margin:'10px 0'}}>Road Complaint System</h1>
          <p style={{color:'#94a3b8', fontSize:'14px'}}>Municipality Dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{marginBottom:'20px'}}>
            <label style={{color:'#94a3b8', fontSize:'14px', display:'block', marginBottom:'8px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@municipality.gov.in"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{marginBottom:'20px'}}>
            <label style={{color:'#94a3b8', fontSize:'14px', display:'block', marginBottom:'8px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {error && <p style={{color:'#ef4444', fontSize:'14px', marginBottom:'16px'}}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}