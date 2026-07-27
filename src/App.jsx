// App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ScrollProgress from './components/scroll_progress/ScrollProgress.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx'
import Landing from './pages/landing/Landing.jsx';
import Projects from './pages/projects/Projects.jsx';
import Leaderboard from './pages/leaderboard/Leaderboard.jsx';

// Create a wrapper component that handles scrolling
function ScrollToTopWrapper({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return children;
}

function AppContent() {
  return (
    <ScrollToTopWrapper>
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <Footer/>
    </ScrollToTopWrapper>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}