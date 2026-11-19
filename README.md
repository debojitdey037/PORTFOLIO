# Debojit Dey | Portfolio

Welcome to the repository for my personal developer portfolio website. This project showcases my work as a Computer Science student, Full-Stack developer, and Competitive Programmer. It features interactive 3D elements, physics-based simulations, fluid animations, and a project management dashboard.

---

## Overview

I built this portfolio to present my technical projects, engineering experience, problem-solving journey, and verified certifications in an engaging, interactive format.

- **Developer:** Debojit Dey
- **Education:** B.Tech in Computer Science & Engineering (AI & ML), Hi-Tech Institute of Engineering & Technology (2025–2029)
- **GitHub:** [https://github.com/debojitdey037](https://github.com/debojitdey037)
- **LinkedIn:** [https://linkedin.com/in/debojit-dey-b55766380](https://linkedin.com/in/debojit-dey-b55766380)
- **Email:** debojitdey037@gmail.com

---

## Features

- **Interactive 3D Avatar:** A WebGL character built with Three.js and React Three Fiber that tracks cursor coordinates in real time with smooth inverse kinematics.
- **Floating 3D Tech-Stack Playground:** Interactive physics simulation powered by `@react-three/rapier` where 26 spheres representing languages and libraries physically bounce and collide with mouse gestures.
- **Fluid GSAP Scroll & Text Animations:** Smooth inertia scrolling using GSAP ScrollSmoother and character-by-character headline transitions via SplitText.
- **Interactive Projects Carousel:** Displays key full-stack and AI projects with live demo and GitHub buttons, 5-second auto-rotation, and pagination controls.
- **Dynamic Content Management (Admin Dashboard):** Built-in `/admin` route backed by an Express REST API allowing authenticated project additions, link updates, image uploads, and certification management.
- **Responsive Design:** Optimized across desktop, tablet, and mobile viewport sizes.

---

## Tech Stack

### Frontend
- **Framework & Language:** React 19, TypeScript
- **Bundler & Tooling:** Vite
- **3D Graphics & Physics:** Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`
- **Animations:** GSAP, ScrollTrigger, ScrollSmoother, SplitText
- **Icons:** React Icons (`react-icons/fa6`, `react-icons/si`, `react-icons/fi`)

### Backend
- **Runtime & Server:** Node.js, Express.js
- **Middleware & Storage:** Multer (image uploads), CORS, Flat-file JSON data storage

---

## Project Structure

```text
├── public/                 # Static assets (3D model, resume, images)
│   ├── models/             # 3D character and environment assets
│   ├── images/             # Project screenshots and certificate badges
│   └── Debojit_Dey_Resume.pdf
├── server/                 # Express backend API
│   ├── index.js            # Server setup, REST endpoints, auth
│   └── data/               # Persistent JSON records (projects, certifications)
├── src/
│   ├── components/         # React presentation components
│   │   ├── Admin/          # Admin dashboard for content management
│   │   ├── Character/      # 3D canvas and model loaders
│   │   ├── styles/         # Component-level CSS stylesheets
│   │   ├── utils/          # GSAP animation helpers
│   │   ├── About.tsx
│   │   ├── Career.tsx
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   ├── Landing.tsx
│   │   ├── Navbar.tsx
│   │   ├── SocialIcons.tsx
│   │   ├── TechStack.tsx
│   │   ├── WhatIDo.tsx
│   │   └── Work.tsx
│   ├── config/             # Environment and API base configuration
│   ├── data/               # Default static project definitions
│   ├── App.tsx             # Main router and view container
│   └── main.tsx            # Application entry point
├── render.yaml             # Backend deployment blueprint
├── vercel.json             # Frontend deployment and header routing
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/debojitdey037/PORTFOLIO.git
cd PORTFOLIO
npm install
```

### Running Locally
To launch both the backend server and frontend development server concurrently:

```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5001`
- **Admin Portal:** `http://localhost:5173/admin`

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This compiles TypeScript definitions (`tsc -b`) and generates minified bundles via Vite into the `dist/` directory.

---

## Deployment

- **Frontend (Vercel):** Connect the GitHub repository to Vercel, set framework preset to `Vite`, and configure the `VITE_API_URL` environment variable pointing to the backend API.
- **Backend (Render):** Deploy as a Web Service using the provided `render.yaml` or start command `node server/index.js`.

---

## Contact

- **Name:** Debojit Dey
- **Email:** [debojitdey037@gmail.com](mailto:debojitdey037@gmail.com)
- **LinkedIn:** [https://linkedin.com/in/debojit-dey-b55766380](https://linkedin.com/in/debojit-dey-b55766380)
- **GitHub:** [https://github.com/debojitdey037](https://github.com/debojitdey037)

---

## License

This project is licensed under the [MIT License](LICENSE).
