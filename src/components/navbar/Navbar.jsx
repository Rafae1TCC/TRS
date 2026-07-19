import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function updateNavbar() {
      setScrolled(window.scrollY > 40)
    }

    updateNavbar()
    window.addEventListener('scroll', updateNavbar, { passive: true })

    return () => window.removeEventListener('scroll', updateNavbar)
  }, [])

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <Link className="logo" to="/">
        <span className="logo-main">TEAM ROCKET</span>
        <span className="logo-sub">STUDIOS</span>
      </Link>
      <nav className="navbar">
        <a href="#">
          Nosotros<i className="ri-rocket-line"></i>
        </a>
        <Link to="/projects">
          Proyectos<i className="ri-grid-line"></i>
        </Link>
        <a href="#">
          Leaderboard<i className="ri-bar-chart-box-line"></i>
        </a>
        <a href="#">
          Comunidad<i className="ri-team-line"></i>
        </a>
      </nav>
    </header>
  )
}
