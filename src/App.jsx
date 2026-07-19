// App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ScrollProgress from './components/ScrollProgress.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Projects from './pages/Projects.jsx';

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
      </Routes>
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