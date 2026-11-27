import { PropsWithChildren } from "react";
import HeroPortrait from "./HeroPortrait";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <HeroPortrait />
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              DEBOJIT
              <br />
              <span>DEY</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Aspiring</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Competitive Programmer</div>
              <div className="landing-h2-2">FullStack Developer</div>
              <div className="landing-h2-3">Software Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Software Developer</div>
              <div className="landing-h2-info-1">Competitive Programmer</div>
              <div className="landing-h2-info-2">FullStack Developer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;