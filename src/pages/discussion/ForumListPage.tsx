import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTexts } from '../../services/readingAPI';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function ForumListPage() {
  const [readings, setReadings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTexts(); 
        setReadings(data);
      } catch (error) {
        console.error("Gagal mengambil data bacaan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReadings();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900">
      {}
      <Sidebar username={user?.username || "Yomu Member"} />

      {}
      <div className="flex-1 p-10 font-sans text-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-blue-400">Pilih Topik Diskusi</h1>
          <p className="text-gray-400 mb-8">Pilih bacaan di bawah ini untuk bergabung ke forum diskusinya.</p>

          {isLoading ? (
            <p className="text-gray-400 animate-pulse">Memuat daftar bacaan...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  onClick={() => navigate(`/forum/${reading.id}`)}
                  className="p-6 bg-gray-800 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 hover:border-blue-500 transition-all duration-200 shadow-sm"
                >
                  <h2 className="text-xl font-bold mb-2 text-white">{reading.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {reading.content || "Klik untuk melihat forum diskusi bacaan ini."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}