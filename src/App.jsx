import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PreviewRedirect from './pages/PreviewRedirect'

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!isAdmin) return <Navigate to="/admin" replace />

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Preview Route */}
          <Route path="/p/:slug" element={<PreviewRedirect />} />

          {/* Admin Routes */}
          <Route path="/" element={<Layout />}>
            <Route path="admin" element={<Login />} />
            <Route 
              path="admin/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
