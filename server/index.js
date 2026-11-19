import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dataFile = path.join(dataDir, "projects.json");
const certFile = path.join(dataDir, "certifications.json");

const initialCertifications = [
  {
    id: "cert-1",
    title: "Python (Basic)",
    issuer: "HackerRank",
    issuedDate: "Jul 2026",
    credentialId: "42F88A64BDDB",
    credentialUrl: "https://www.hackerrank.com/certificates/42f88a64bddb",
    logo: "/images/cert-hackerrank.png",
  },
  {
    id: "cert-2",
    title: "CRUD Operations in MongoDB",
    issuer: "MongoDB",
    issuedDate: "Jun 2026",
    credentialId: "MDBjyssb84dw6",
    credentialUrl: "https://learn.mongodb.com/c/jVny_XN8T5qMwt5KzQIH6A",
    logo: "/images/cert-mongodb.png",
  },
];

const initialProjects = [
  {
    id: "1",
    title: "Restaurant Order & Kitchen Management",
    category: "Full-Stack Web Application",
    tools: "React 19, Vite, Node.js, Express, MongoDB, JWT, Mongoose",
    description:
      "Full-stack restaurant ordering system with customer self-service ordering, live Kitchen Display System with 10s auto-refresh, admin analytics dashboard, and 5% GST billing lifecycle.",
    image: "/images/proj-restaurant.webp",
    github: "https://github.com/debojitdey037/restaurant-order-table-management-kitchen-automation-system",
    demo: "https://restaurant-order-table-management-k.vercel.app/menu",
    link: "https://restaurant-order-table-management-k.vercel.app/menu",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "HR Policy Assistant",
    category: "AI-Powered Web Application",
    tools: "Python, LangChain, Google Gemini, ChromaDB, Streamlit, RAG",
    description:
      "Retrieval-augmented generation (RAG) chatbot answering employee questions from a 79-page HR policy manual using LangChain, Google Gemini and ChromaDB with Streamlit interface.",
    image: "/images/proj-hr-ai.webp",
    github: "https://github.com/debojitdey037/HR-Policy-Assistant",
    demo: "https://hr-policy-assistant-rmufus2vxrx3sappndmno8g.streamlit.app/",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "SpendWise – Budget Tracker App",
    category: "Mobile Application (Android)",
    tools: "Kotlin, Jetpack Compose, Room DB, Google ML Kit, Gradle",
    description:
      "Native Android expense tracker built with Jetpack Compose for declarative UI, Room database for local storage, and ML Kit for smart receipt scanning and categorisation.",
    image: "/images/proj-spendwise.webp",
    github: "https://github.com/debojitdey037/SPENDWISE-APP",
    demo: "https://github.com/debojitdey037/SPENDWISE-APP",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "EventSphere – Event Manager",
    category: "Full-Stack MVC Platform",
    tools: "Node.js, Express, MongoDB, EJS, JWT, Helmet, bcrypt",
    description:
      "Full-stack event management and ticketing platform supporting 5 user roles with role-based route guards, atomic seat booking, and race-condition-safe reservations.",
    image: "/images/proj-event.webp",
    github: "https://github.com/debojitdey037/Event-Manager",
    demo: "https://event-manager-seven-pi.vercel.app/",
    link: "https://event-manager-seven-pi.vercel.app/",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "ShowTime – TV Show Finder",
    category: "Frontend Web Application",
    tools: "JavaScript, Vite, TVmaze REST API, Client-Side Routing",
    description:
      "Searchable TV show browser that fetches data from the TVmaze API with a dynamic search grid, /shows/:id detail routes, cast lists, and fully responsive design.",
    image: "/images/proj-showtime.webp",
    github: "https://github.com/debojitdey037/ps6-ShowTime-a-TV-Show-Finder",
    demo: "https://ps6-show-time-a-tv-show-finder.vercel.app/shows",
    link: "https://ps6-show-time-a-tv-show-finder.vercel.app/shows",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "AskMyPDF – AI Document Chat",
    category: "AI-Powered Web Application",
    tools: "Python, LangChain, OpenAI, FAISS, Streamlit, PyPDF2",
    description:
      "Upload any PDF and chat with it instantly. Uses LangChain and FAISS vector search with OpenAI embeddings to deliver accurate, context-aware answers from your documents.",
    image: "/images/proj-askmypdf.webp",
    github: "https://github.com/debojitdey037/AskMyPDF",
    demo: "https://github.com/debojitdey037/AskMyPDF",
    createdAt: new Date().toISOString(),
  },
];

function readProjects() {
  try {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify(initialProjects, null, 2));
      return initialProjects;
    }
    const raw = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading projects:", err);
    return initialProjects;
  }
}

function saveProjects(projects) {
  fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2), "utf-8");
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "debojitdey037@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "debojit2026";
const SECRET_TOKEN = "debojit-dey-secure-token-2026";

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (token !== SECRET_TOKEN) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
  next();
}

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (
    (username === ADMIN_USERNAME || username === ADMIN_EMAIL) &&
    password === ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      token: SECRET_TOKEN,
      user: {
        name: "Debojit Dey",
        email: ADMIN_EMAIL,
        role: "admin",
      },
    });
  }
  return res.status(401).json({ error: "Invalid username or password" });
});

app.get("/api/auth/me", requireAdmin, (_req, res) => {
  res.json({
    authenticated: true,
    user: {
      name: "Debojit Dey",
      email: ADMIN_EMAIL,
      role: "admin",
    },
  });
});

app.get("/api/projects", (_req, res) => {
  const projects = readProjects();
  res.json(projects);
});

app.post("/api/projects", requireAdmin, (req, res) => {
  const { title, category, tools, description, image, link, github } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }
  const projects = readProjects();
  const newProject = {
    id: String(Date.now()),
    title: title.trim(),
    category: (category || "Software Project").trim(),
    tools: (tools || "React, TypeScript, Node.js").trim(),
    description: description.trim(),
    image: image || "/images/placeholder.webp",
    link: link || "",
    github: github || "",
    createdAt: new Date().toISOString(),
  };
  projects.unshift(newProject);
  saveProjects(projects);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, category, tools, description, image, link, github } = req.body;
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  projects[index] = {
    ...projects[index],
    title: title !== undefined ? title.trim() : projects[index].title,
    category: category !== undefined ? category.trim() : projects[index].category,
    tools: tools !== undefined ? tools.trim() : projects[index].tools,
    description: description !== undefined ? description.trim() : projects[index].description,
    image: image !== undefined ? image : projects[index].image,
    link: link !== undefined ? link : projects[index].link,
    github: github !== undefined ? github : projects[index].github,
    updatedAt: new Date().toISOString(),
  };
  saveProjects(projects);
  res.json(projects[index]);
});

app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  let projects = readProjects();
  const exists = projects.some((p) => p.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Project not found" });
  }
  projects = projects.filter((p) => p.id !== id);
  saveProjects(projects);
  res.json({ success: true, message: "Project deleted successfully" });
});

app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

function readCerts() {
  try {
    if (!fs.existsSync(certFile)) {
      fs.writeFileSync(certFile, JSON.stringify(initialCertifications, null, 2));
      return initialCertifications;
    }
    return JSON.parse(fs.readFileSync(certFile, "utf-8"));
  } catch {
    return initialCertifications;
  }
}
function saveCerts(data) {
  fs.writeFileSync(certFile, JSON.stringify(data, null, 2), "utf-8");
}

app.get("/api/certifications", (_req, res) => {
  res.json(readCerts());
});

app.post("/api/certifications", requireAdmin, (req, res) => {
  const { title, issuer, issuedDate, credentialId, credentialUrl, logo } = req.body;
  if (!title || !issuer) {
    return res.status(400).json({ error: "Title and issuer are required" });
  }
  const certs = readCerts();
  const newCert = {
    id: `cert-${Date.now()}`,
    title: title.trim(),
    issuer: issuer.trim(),
    issuedDate: (issuedDate || "").trim(),
    credentialId: (credentialId || "").trim(),
    credentialUrl: (credentialUrl || "").trim(),
    logo: logo || "",
    createdAt: new Date().toISOString(),
  };
  certs.unshift(newCert);
  saveCerts(certs);
  res.status(201).json(newCert);
});

app.delete("/api/certifications/:id", requireAdmin, (req, res) => {
  let certs = readCerts();
  const exists = certs.some((c) => c.id === req.params.id);
  if (!exists) return res.status(404).json({ error: "Certification not found" });
  certs = certs.filter((c) => c.id !== req.params.id);
  saveCerts(certs);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

