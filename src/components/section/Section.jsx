// Section.jsx
import { Link } from "react-router-dom";
import Particles from '../particles/Particles';
import SplitText from '../split_text/SplitText';
import { useTilt } from '../../hooks/useTilt';
import './Section.css';

export default function Section({ 
  title, 
  text, 
  imageSrc, 
  imageAlt, 
  ctaLabel, 
  reverse, 
  linkName,
  particlesColor,
  fontClass,
  icon
}) {
  
  const imageRef = useTilt({
    maxRotate: 12,
    perspective: 900,
    scale: 1.00,
  });

  const handleAnimationComplete = () => {
  };

  const textBlock = (
    <div className="container">
      <div className="subtitle">
        <SplitText
          text={title}
          className=""
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin=""
          textAlign=""
          tag="h1"
          onLetterAnimationComplete={handleAnimationComplete}
          showCallback
        />
      </div>
      <div className="content">
        <SplitText
          text={text}
          className={fontClass}
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="lines"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin=""
          textAlign=""
          tag="p"
          onLetterAnimationComplete={handleAnimationComplete}
          showCallback
        />
        <div className="button">
          <Link to={linkName}>
            <SplitText
              text={ctaLabel}
              className={fontClass}
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin=""
              textAlign=""
              tag="p"
              onLetterAnimationComplete={handleAnimationComplete}
              showCallback
              icon="ri-corner-down-right-line"
            />
          </Link>
        </div>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="container media-container">
      <div className="particles-wrapper">
        <Particles
          particleColors={[particlesColor]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
        
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