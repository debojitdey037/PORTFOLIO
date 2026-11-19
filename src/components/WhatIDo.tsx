import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const cards = [
  {
    title: "Software Development",
    description:
      "Building scalable, responsive applications using React.js, Node.js, Express.js and MongoDB. Passionate about software engineering, system design, and turning complex ideas into practical solutions.",
    tags: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "JWT Auth",
    ],
  },
  {
    title: "AI & Open Source",
    description:
      "Exploring Generative AI, RAG applications and emerging technologies while contributing to open-source projects and improving my problem-solving skills.",
    tags: [
      "Generative AI",
      "RAG",
      "LangChain",
      "ChromaDB",
      "Gemini",
      "Python",
      "Git & GitHub",
      "Open Source",
    ],
  },
  {
    title: "Competitive Programming",
    description:
      "Regularly solving DSA problems on LeetCode and participating in coding contests on CodeChef and Codeforces. Continuously improving algorithmic thinking, problem-solving, and coding efficiency.",
    tags: [
      "LeetCode",
      "CodeChef",
      "Codeforces",
      "Data Structures",
      "Algorithms",
      "Problem Solving",
    ],
  },
];

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    const handlers: { el: HTMLDivElement; fn: () => void }[] = [];

    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          const fn = () => handleClick(container);
          container.addEventListener("click", fn);
          handlers.push({ el: container, fn });
        }
      });
    }

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>

          {cards.map((card, index) => (
            <div
              key={card.title}
              className="what-content what-noTouch"
              ref={(el) => setRef(el, index)}
            >
              <div className="what-border1">
                <svg height="100%">
                  {index === 0 && (
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                    />
                  )}
                  <line
                    x1="0"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>
              <div className="what-corner"></div>

              <div className="what-content-in">
                <h3>{card.title}</h3>
                <h4>Description</h4>
                <p>{card.description}</p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  {card.tags.map((tag) => (
                    <div className="what-tags" key={tag}>
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="what-arrow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}