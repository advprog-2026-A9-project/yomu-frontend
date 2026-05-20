import { useParams, useNavigate } from "react-router-dom";
import DiscussionSection from "../../components/discussion/DiscussionSection";
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../context/AuthContext";

function ForumDetailPage() {
  const { readingId } = useParams<{ readingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  if (!readingId) {
    return <div className="min-h-screen bg-gray-900 text-white p-10">ID Bacaan tidak valid.</div>;
  }

  const currentUserId = user?.userId || "";

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Menampilkan Sidebar di Sisi Kiri */}
      <Sidebar username={user?.username || "Yomu Member"} />

      {/* Konten Utama di Sisi Kanan */}
      <div className="flex-1 p-10 font-sans text-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/forum")}
            className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <span>&larr;</span> Kembali ke Daftar Forum
          </button>

          <h1 className="text-3xl font-bold mb-2 text-blue-400">
            Forum Diskusi Bacaan
          </h1>
          <p className="text-gray-400 mb-8">
            Silakan diskusikan materi ini bersama pengguna lainnya.
          </p>

          {currentUserId ? (
            <DiscussionSection
              readingId={readingId}
              currentUserId={currentUserId}
              currentUserRole={user?.role}
            />
          ) : (
            <p className="text-red-400">Harap login terlebih dahulu untuk mengakses diskusi.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumDetailPage;