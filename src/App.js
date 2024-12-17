import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import ContactPage from './pages/ContactPage';
import ListPage from './pages/ListPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<ListPage />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
