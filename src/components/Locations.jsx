import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Locations({ supabase }) {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) setLocations(data)
    }
    fetchLocations()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-primary">Saved Locations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location) => (
            <div key={location.id} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={13}
                  style={{ height: '200px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.latitude, location.longitude]} />
                </MapContainer>
              </div>
              <div className="text-gray-700">
                <p>Date: {new Date(location.created_at).toLocaleString()}</p>
                {location.image_url && (
                  <img 
                    src={location.image_url} 
                    alt="Location" 
                    className="mt-4 rounded-lg"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
