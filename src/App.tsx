import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Reading from './pages/reading/Reading.js';
import ClanDashboard from './pages/social/ClanDashboard.js';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/readings" element={<Reading />} />
                <Route path="/clan" element={<ClanDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;