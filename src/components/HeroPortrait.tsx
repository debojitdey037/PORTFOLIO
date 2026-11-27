import React, { useRef, useState, useEffect } from "react";
import "./styles/HeroPortrait.css";

interface HeroPortraitProps {
  imageSrc?: string;
}

const HeroPortrait: React.FC<HeroPortraitProps> = ({
  imageSrc = "/images/debojit-bw.png",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, moveX: 0, moveY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize from -1 to 1
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      // 3D rotation angles & translation
      setCoords({
        rotateX: -y * 12, // tilt up/down
        rotateY: x * 15,  // turn left/right
        moveX: x * 20,    // subtle parallax shift
        moveY: y * 15,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="hero-3d-wrapper"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background ambient glow matching portfolio theme */}
      <div
        className="hero-3d-halo"
        style={{
          transform: `translate(${coords.moveX * 0.5}px, ${coords.moveY * 0.5}px)`,
        }}
      />

      {/* Floating Awwwards editorial tags inspired by Carter Ogunsola layout */}
      <div
        className="hero-badge hero-badge-left"
        style={{
          transform: `translate3d(${-coords.moveX * 0.8}px, ${-coords.moveY * 0.8}px, 40px)`,
        }}
      >
        <span className="hero-badge-title">Software Developer</span>
        <span className="hero-badge-star">✦</span>
      </div>

      <div
        className="hero-badge hero-badge-right"
        style={{
          transform: `translate3d(${coords.moveX * 0.8}px, ${coords.moveY * 0.8}px, 40px)`,
        }}
      >
        <span className="hero-badge-title">Competitive Programmer</span>
        <span className="hero-badge-star">✦</span>
      </div>

      {/* 3D Perspective Card holding the portrait */}
      <div
        className="hero-3d-card"
        style={{
          transform: `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) translate3d(${coords.moveX}px, ${coords.moveY}px, 0px)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
      >
        {/* Subtle grid background card texture */}
        <div className="hero-3d-grid" />

        {/* User Portrait with smooth lighting reflection & shadow */}
        <div className="hero-3d-image-wrap">
          <img
            src={imageSrc}
            alt="Debojit Dey"
            className="hero-3d-photo"
            loading="eager"
          />
          {/* Bottom fade blending naturally into the dark background */}
          <div className="hero-bottom-fade" />
          {/* Subtle glossy sheen reacting to tilt */}
          <div
            className="hero-light-glare"
            style={{
              transform: `translate(${coords.rotateY * 3}%, ${coords.rotateX * 3}%)`,
              opacity: isHovered ? 0.35 : 0.15,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPortrait;
