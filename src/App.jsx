import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import ComplaintDetail from './pages/ComplaintDetail'
import { useState, useEffect } from 'react'
import { auth } from './services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0f172a'}}>
      <div style={{color:'white',fontSize:'24px'}}>Loading...</div>
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/complaints" element={user ? <Complaints /> : <Navigate to="/login" />} />
        <Route path="/complaint/:id" element={user ? <ComplaintDetail /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App