// Previous imports remain the same
import { useRef } from 'react'
import Navbar from './Navbar'

export default function Dashboard({ supabase }) {
  // Previous state declarations remain the same
  const webcamRef = useRef(null)

  const handleCaptureLocation = async () => {
    setLoading(true)
    try {
      // Capture location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      // Capture photo if webcam is enabled
      let imageUrl = null
      if (webcamEnabled && webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot()
        const file = await fetch(imageSrc).then(res => res.blob())
        
        const fileExt = 'jpeg'
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('location-images')
          .upload(filePath, file)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('location-images')
            .getPublicUrl(filePath)
          imageUrl = publicUrl
        }
      }

      // Save location to database
      const { error } = await supabase
        .from('locations')
        .insert([{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          image_url: imageUrl,
          user_id: user.id
        }])

      if (error) throw error
      alert('Location saved successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar supabase={supabase} />
      <div className="container mx-auto p-4 pt-20">
        {/* Previous dashboard content remains the same */}
        <div className="mt-8">
          <button
            onClick={handleCaptureLocation}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            {loading ? 'Saving...' : 'Track Location'}
          </button>
        </div>
        {/* Webcam component with ref */}
        {webcamEnabled && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full mt-4"
          />
        )}
      </div>
    </div>
  )
}
