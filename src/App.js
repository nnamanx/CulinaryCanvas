import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './HomePage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={0} />
        <Route path="/recipes/:id" element={0} />
        <Route path="/contact" element={0} />
      </Routes>
    </Router>
  );
}

export default App;
