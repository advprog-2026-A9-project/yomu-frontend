import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Reading() {
    const [readings, setReadings] = useState([])
    const [status, setStatus] = useState('Loading...')

    useEffect(() => {
        // PENTING: Kita tembak endpoint spesifik /api/readings
        fetch('https://yomu-backend-production.up.railway.app/api/readings')
            .then(res => {
                if (!res.ok) throw new Error("Gagal fetch data")
                return res.json() // Ubah response jadi JSON
            })
            .then(data => {
                setReadings(data)
                setStatus('Success')
            })
            .catch(err => setStatus('Error: ' + err.message))
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
            <h1 className="text-4xl font-bold mb-6 text-blue-400 text-center">Yomu Library</h1>

            {/* Indikator Status */}
            <div className="flex justify-center mb-8">
        <span className={`px-4 py-2 rounded-full font-semibold ${status === 'Success' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
          Backend Status: {status}
        </span>
            </div>

            {/* Grid Buku */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {readings.map((book) => (
                    <div key={book.id} className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:bg-gray-750 transition">
                        <h2 className="text-xl font-bold text-white mb-2">{book.title}</h2>
                        <span className="inline-block px-2 py-1 mb-3 text-xs font-semibold bg-blue-900 text-blue-200 rounded">
              {book.category}
            </span>
                        <p className="text-gray-400 text-sm line-clamp-3">{book.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Reading