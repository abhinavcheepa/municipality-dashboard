import { useState } from 'react'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { Mail, Lock, AlertTriangle } from 'lucide-react'

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
        setError('Authentication failed. Please verify your credentials.')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Blurs */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(59, 130, 246, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        top: '10%',
        left: '20%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(244, 63, 94, 0.08)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        bottom: '10%',
        right: '20%',
        zIndex: 0
      }} />

      <div className="glass-card animate-fade-in" style={{
        padding: '40px 32px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            fontSize: '32px',
            marginBottom: '16px',
            boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.2)'
          }}>
            🛣️
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            marginBottom: '6px'
          }}>
            Road Complaint System
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
            margin: 0
          }}>
            Municipality Operations Console
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '8px'
            }}>
              Official Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
                width: '18px',
                height: '18px'
              }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@municipality.gov.in"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
                width: '18px',
                height: '18px'
              }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="badge-danger" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              textTransform: 'none',
              fontWeight: '500',
              marginBottom: '20px',
              width: '100%',
              border: '1px solid var(--color-danger-border)'
            }}>
              <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}