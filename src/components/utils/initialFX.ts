import { SplitText } from "gsap-trial/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (smoother) smoother.paused(false);
  const main = document.getElementsByTagName("main")[0];
  if (main) main.classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  var landingText2 = new SplitText(".landing-h2-info", TextProps);
  gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const whiteRoles = [
    landingText2,
    new SplitText(".landing-h2-info-1", TextProps),
    new SplitText(".landing-h2-info-2", TextProps),
  ];

  const ghostRoles = [
    new SplitText(".landing-h2-1", TextProps),
    new SplitText(".landing-h2-2", TextProps),
    new SplitText(".landing-h2-3", TextProps),
  ];

  LoopRoles([whiteRoles, ghostRoles]);
}

function LoopRoles(sets: SplitText[][]) {
  const hold = 3; 
  const count = sets[0].length;

  sets.forEach((set) => {
    set.slice(1).forEach((role) => {
      gsap.set(role.chars, { opacity: 0, y: 80 });
    });
  });

  const showNext = (i: number, wait: number) => {
    const next = (i + 1) % count;
    const tl = gsap.timeline({
      delay: wait,
      onComplete: () => showNext(next, hold),
    });

    sets.forEach((set) => {
      tl.fromTo(
        set[i].chars,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -80,
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.04,
        },
        0
      ).fromTo(
        set[next].chars,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.04,
        },
        0.4
      );
    });
  };

  showNext(0, 4); 
}