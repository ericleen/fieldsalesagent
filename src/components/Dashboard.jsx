import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Dashboard({ supabase }) {
  const [location, setLocation] = useState(null)
  const [webcamEnabled, setWebcamEnabled] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLocationError('')
        },
        (error) => {
          setLocationError('Location access denied or unavailable')
          console.error(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser')
    }
  }

  useEffect(() => {
    getLocation()
    const interval = setInterval(getLocation, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <h1 className="text-2xl font-bold text-primary">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Location Tracking</h2>
            {locationError && (
              <div className="mb-4 text-red-500">{locationError}</div>
            )}
            {location ? (
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]} />
              </MapContainer>
            ) : (
              <p>Loading location...</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Photo Capture</h2>
            <button
              onClick={() => setWebcamEnabled(!webcamEnabled)}
              className="bg-primary text-white px-4 py-2 rounded-lg mb-4 hover:bg-secondary"
            >
              {webcamEnabled ? 'Disable Camera' : 'Enable Camera'}
            </button>
            {webcamEnabled && (
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
