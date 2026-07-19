import './Footer.css'

export default function Footer() {

  return (
    <footer>
        <div className="footer-top">
            <div>
                <h3>
                    TEAM ROCKET STUDIOS
                </h3>
                <p>
                    Independent multiplayer game development.
                </p>
            </div>

            <div className="footer-links">
                <a href="#studio">Discord</a>
                <a href="#project">Twitter</a>
                <a href="#">Youtube</a>
            </div>

        </div>
        <div className="footer-bottom">
            <p>
                © 2026 Team Rocket Studios.
                All Rights Reserved.
            </p>
        </div>
    </footer>
  )
}
