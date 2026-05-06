import { useNavigate } from "react-router-dom";
import DiscussionSection from "../../components/discussion/DiscussionSection";
import { useAuth } from "../../context/AuthContext"; 

function TestDiscussionPage() {
  const navigate = useNavigate();

  const { user } = useAuth(); 
  
  const DUMMY_READING_ID = "123e4567-e89b-12d3-a456-426614174000";
  

  const currentUserId = user?.userId || "98765432-1234-5678-1234-567812345678";
  const currentUserRole = user?.role || "USER"; 

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <span>&larr;</span> Kembali ke Home
        </button>

        <h1 className="text-3xl font-bold mb-2 text-blue-400">
          Halaman Uji Coba Diskusi
        </h1>

        <p className="text-gray-400 mb-8">
        </p>

        <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Contoh Judul Bacaan</h2>

          <p className="text-gray-300 leading-relaxed">
            Ini adalah area konten bacaan simulasi. Komponen diskusi di bawah ini
            mengambil data dari Backend berdasarkan Reading ID.
          </p>
          
          {}
          <div className="mt-4 p-2 bg-gray-700 rounded text-sm text-yellow-300">
            Sedang login sebagai: <strong>{currentUserRole}</strong>
          </div>
        </div>

        {}
        <DiscussionSection
          readingId={DUMMY_READING_ID}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      </div>
    </div>
  );
}

export default TestDiscussionPage;