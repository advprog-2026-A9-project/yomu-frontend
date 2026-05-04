// src/pages/reading/ReadingDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Nanti kita akan buat fungsi getTextById di service API

export default function ReadingDetail() {
    const { id } = useParams(); // Ambil ID dari URL /reading/123
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <button
                onClick={() => navigate('/reading')}
                className="mb-6 text-blue-400 hover:underline"
            >
                ← Kembali ke Perpustakaan
            </button>

            <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
                <h1 className="text-3xl font-bold mb-4 text-blue-300">Menampilkan ID: {id}</h1>
                <p className="text-gray-400 italic mb-8">Sedang menyiapkan konten teks...</p>

                {/* Area Konten Teks di sini */}

                <div className="mt-10 p-6 bg-blue-900/30 border border-blue-500/50 rounded-xl text-center">
                    <p className="mb-4 text-blue-200 font-medium">Sudah paham isi bacaannya? Uji kemampuanmu di kuis!</p>
                    <button className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-full font-bold transition shadow-lg">
                        Mulai Kuis Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}