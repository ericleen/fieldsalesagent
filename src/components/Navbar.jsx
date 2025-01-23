import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ supabase }) {
  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Field Sales Tracker</div>
        <div className="flex space-x-4">
          <Link to="/dashboard" className="text-white hover:text-secondary">
            Dashboard
          </Link>
          <Link to="/locations" className="text-white hover:text-secondary">
            Locations
          </Link>
          <Link to="/profile" className="text-white hover:text-secondary">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
