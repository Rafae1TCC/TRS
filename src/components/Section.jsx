import { Link } from "react-router-dom"
import Particles from './particles/Particles';

export default function Section({ title, text, imageSrc, imageAlt, ctaLabel, reverse, linkName }) {
  const textBlock = (
    <div className="container">
      <div className="subtitle">
        <h1>{title}</h1>
      </div>
      <div className="content">
        <p>{text}</p>
        <div className="button">
          <Link to={linkName}>
            {ctaLabel}
            <i className="ri-corner-down-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  )

  const imageBlock = (
    <div className="container">
      <img src={imageSrc} alt={imageAlt} />
    </div>
  )

  const particleBlock = (
    <div className="container">
      <Particles
        particleColors={["#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
    />
    </div>
  )

  return (
    <div className="main-content">
      {reverse ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  )
}
