import { useEffect, useState } from 'react'

function App() {
    const [message, setMessage] = useState('Loading...')

    useEffect(() => {
        fetch('https://yomu-backend-production.up.railway.app/')
            .then(res => res.text())
            .then(data => setMessage(data))
            .catch(err => setMessage('Error fetching data: ' + err))
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">Yomu Frontend</h1>
            <div className="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                <p className="text-lg text-gray-300">Status Backend:</p>
                <p className="text-2xl font-semibold text-green-400 mt-2">{message}</p>
            </div>
        </div>
    )
}

export default App