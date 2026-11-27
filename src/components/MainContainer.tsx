import { lazy, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = () => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    let timer: number;
    const resizeHandler = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        setSplitText();
        setIsDesktopView(window.innerWidth > 1024);
      }, 150);
    };
    setSplitText();
    import("./utils/initialFX").then((module) => {
      if (module.initialFX) {
        module.initialFX();
      }
    });
    window.addEventListener("resize", resizeHandler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing />
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Certifications />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
