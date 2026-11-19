export interface Project {
  id: string;
  title: string;
  category: string;
  tools: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  demo?: string;
}

export const defaultProjects: Project[] = [
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
  },
  {
    id: "4",
    title: "EventSphere – Event Manager",
    category: "Full-Stack MVC Platform",
    tools: "Node.js, Express, MongoDB, EJS, JWT, Helmet, bcrypt",
    description:
      "Full-stack event management and ticketing platform supporting 5 user roles with role-based route guards, atomic seat booking, race-condition-safe reservations, and a moderation queue.",
    image: "/images/proj-event.webp",
    github: "https://github.com/debojitdey037/Event-Manager",
    demo: "https://event-manager-seven-pi.vercel.app/",
  },
  {
    id: "5",
    title: "ShowTime – TV Show Finder",
    category: "Frontend Web Application",
    tools: "JavaScript, Vite, TVmaze REST API, Client-Side Routing",
    description:
      "Searchable TV show browser that fetches data from the TVmaze API with a dynamic search grid, /shows/:id detail routes, cast lists, episode guides, and fully responsive design.",
    image: "/images/proj-showtime.webp",
    github: "https://github.com/debojitdey037/ps6-ShowTime-a-TV-Show-Finder",
    demo: "https://ps6-show-time-a-tv-show-finder.vercel.app/shows",
  },
  {
    id: "6",
    title: "AskMyPDF – AI Document Chat",
    category: "AI-Powered Web Application",
    tools: "Python, LangChain, OpenAI, FAISS, Streamlit, PyPDF2",
    description:
      "Upload any PDF and chat with it instantly. Uses LangChain and FAISS vector search with OpenAI embeddings to deliver accurate, context-aware answers directly from your documents.",
    image: "/images/proj-askmypdf.webp",
    github: "https://github.com/debojitdey037/AskMyPDF",
    demo: "https://github.com/debojitdey037/AskMyPDF",
  },
];
