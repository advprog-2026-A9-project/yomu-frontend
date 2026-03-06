import DiscussionSection from "../../components/discussion/DiscussionSection";

function TestDiscussionPage() {
  const DUMMY_READING_ID = "123e4567-e89b-12d3-a456-426614174000";
  const DUMMY_USER_ID = "98765432-1234-5678-1234-567812345678";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-400">
          Halaman Uji Coba Diskusi
        </h1>

        <p className="text-gray-400 mb-8">
          Halaman ini untuk simulasi integrasi Milestone 25%.
        </p>

        <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Contoh Judul Bacaan</h2>

          <p className="text-gray-300 leading-relaxed">
            Ini adalah area konten bacaan simulasi. Komponen diskusi di bawah ini
            mengambil data dari Backend berdasarkan Reading ID.
          </p>
        </div>

        <DiscussionSection
          readingId={DUMMY_READING_ID}
          currentUserId={DUMMY_USER_ID}
        />
      </div>
    </div>
  );
}

export default TestDiscussionPage;