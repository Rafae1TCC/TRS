// Section.jsx
import { Link } from "react-router-dom";
import Particles from '../particles/Particles';
import { useTilt } from '../../hooks/useTilt';
import './Section.css';

export default function Section({ 
  title, 
  text, 
  imageSrc, 
  imageAlt, 
  ctaLabel, 
  reverse, 
  linkName 
}) {
  // Removed translateY since you don't want the image to move up
  const imageRef = useTilt({
    maxRotate: 12,
    perspective: 900,
    scale: 1.02,
  });

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
  );

  const imageBlock = (
    <div className="container media-container">
      <div className="particles-wrapper">
        <Particles
          particleColors={["#750d0d"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
        {/* Image with tilt effect - centered */}
        <div 
          ref={imageRef}
          className="tilt-image-container"
        >
          <img 
            src={imageSrc} 
            alt={imageAlt}
          />
        </div>
      </div>
    </div>
  );

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
  );
}