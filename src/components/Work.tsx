import { useEffect, useState, useRef, useCallback } from "react";
import "./styles/Work.css";
import { Project, defaultProjects } from "../data/projectsData";
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_BASE } from "../config/api";

const Work = () => {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((index + projects.length) % projects.length);
      setTimeout(() => setAnimating(false), 500);
    },
    [animating, projects.length]
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 5000);
  };

  const handlePrev = () => { resetAuto(); prev(); };
  const handleNext = () => { resetAuto(); next(); };
  const handleDot  = (i: number) => { resetAuto(); goTo(i); };

  if (!projects.length) return null;

  const project = projects[current];

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>My <span>Work</span></h2>

        <div className="carousel-wrapper">
          
          <button className="carousel-btn carousel-btn--prev" onClick={handlePrev} aria-label="Previous project">
            <FaChevronLeft />
          </button>

          <div className={`carousel-card ${animating ? "carousel-card--fade" : ""}`} key={project.id}>
            
            <div className="carousel-image">
              <img
                src={project.image || "/images/placeholder.webp"}
                alt={project.title}
                loading="lazy"
              />
              <div className="carousel-image-overlay">
                <span className="carousel-category">{project.category}</span>
              </div>
            </div>

            <div className="carousel-info">
              <div className="carousel-index">0{current + 1}<span>/{projects.length.toString().padStart(2, "0")}</span></div>
              <h3>{project.title}</h3>
              <p className="carousel-description">{project.description}</p>

              <div className="carousel-tools">
                <span className="tools-label">Tech Stack</span>
                <div className="tools-tags">
                  {project.tools.split(",").map((t) => (
                    <span key={t.trim()} className="tool-tag">{t.trim()}</span>
                  ))}
                </div>
              </div>

              <div className="carousel-actions">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="carousel-btn-link carousel-btn-link--github"
                >
                  <FaGithub /> GitHub
                </a>
                {(project.demo || project.link) && (
                  <a
                    href={project.demo || project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="carousel-btn-link carousel-btn-link--demo"
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          <button className="carousel-btn carousel-btn--next" onClick={handleNext} aria-label="Next project">
            <FaChevronRight />
          </button>
        </div>

        <div className="carousel-dots">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? "carousel-dot--active" : ""}`}
              onClick={() => handleDot(i)}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
