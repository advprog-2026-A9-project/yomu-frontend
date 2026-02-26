import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Reading from './pages/reading/Reading.js';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/readings" element={<Reading />} />
            </Routes>
        </Router>
    );
}

export default App;