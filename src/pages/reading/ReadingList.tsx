import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Search, ArrowLeft } from 'lucide-react';
import { getAllTexts, getAllCategories } from '../../services/readingAPI';
import type { ReadingTextResponse, CategoryResponse } from '../../types/reading';

export default function ReadingList() {
    const navigate = useNavigate();
    const [readings, setReadings] = useState<ReadingTextResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [textsData, categoriesData] = await Promise.all([
                    getAllTexts(),
                    getAllCategories()
                ]);
                setReadings(textsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Gagal mengambil data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Logika Filter
    const filteredReadings = readings.filter(book => {
        const matchCategory = selectedCategory === 'All' || book.categoryName === selectedCategory;
        const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* HEADER */}
                <div className="text-center space-y-4">
                    <button onClick={() => navigate('/')} className="text-indigo-300 hover:text-white flex items-center gap-2 font-medium">
                        <ArrowLeft size={18} /> Dashboard
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 inline-block">
                        Yomu Library
                    </h1>
                    <p className="text-indigo-200/70 max-w-xl mx-auto">
                        Jelajahi berbagai artikel dan bacaan untuk meningkatkan literasi dan kemampuan berpikir kritismu.
                    </p>
                </div>

                {/* SEARCH & FILTER SECTION */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Tabs Kategori */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-indigo-200 hover:bg-white/10'}`}
                        >
                            Semua
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-indigo-200 hover:bg-white/10'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/50" />
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* GRID BACAAN */}
                {filteredReadings.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
                        <Compass size={48} className="mx-auto text-indigo-500/50 mb-4" />
                        <p className="text-indigo-200/50 font-medium">Tidak ada teks bacaan yang sesuai dengan filter/pencarianmu.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredReadings.map((book) => (
                            <div key={book.id} className="group relative bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[220px]">
                                <div>
                                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/20">
                                        {book.categoryName}
                                    </span>
                                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                                        {book.title}
                                    </h2>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <Link
                                        to={`/readings/${book.id}`}
                                        className="w-full flex justify-center items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold py-2.5 px-4 rounded-xl transition-all"
                                    >
                                        <BookOpen size={16} />
                                        Mulai Membaca
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}