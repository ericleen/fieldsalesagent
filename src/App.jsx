import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth supabase={supabase} />} />
          <Route 
            path="/dashboard" 
            element={session ? <Dashboard supabase={supabase} /> : <Auth supabase={supabase} />} 
          />
          <Route 
            path="/profile" 
            element={session ? <Profile supabase={supabase} /> : <Auth supabase={supabase} />} 
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
