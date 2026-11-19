import React, { useState, useEffect } from "react";
import "../styles/Admin.css";
import { Project, defaultProjects } from "../../data/projectsData";
import { Certification, defaultCertifications } from "../Certifications";
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiArrowLeft, FiUpload, FiCheck, FiAward } from "react-icons/fi";
import { API_BASE } from "../../config/api";

interface Props {
  onExit: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onExit }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("debojit_admin_token")
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "certifications">("projects");

  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [certs, setCerts] = useState<Certification[]>(defaultCertifications);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState<Partial<Certification>>({
    title: "", issuer: "", issuedDate: "", credentialId: "", credentialUrl: "", logo: "",
  });

  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    category: "",
    tools: "",
    description: "",
    image: "/images/placeholder.webp",
    link: "",
    github: "",
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          return;
        }
      }
    } catch {
      
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCerts();
  }, [token]);

  const fetchCerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/certifications`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setCerts(data);
      }
    } catch {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("debojit_admin_token", data.token);
      setToken(data.token);
      setMessage({ text: "Signed in successfully!", type: "success" });
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("debojit_admin_token");
    setToken(null);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "",
      tools: "",
      description: "",
      image: "/images/placeholder.webp",
      link: "",
      github: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      setFormData((prev) => ({ ...prev, image: result.url }));
      setMessage({ text: "Image uploaded successfully!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Upload error", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill in the project title and description.");
      return;
    }

    try {
      const url = editingProject
        ? `${API_BASE}/projects/${editingProject.id}`
        : `${API_BASE}/projects`;
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save project");
      }

      await fetchProjects();
      setIsModalOpen(false);
      setMessage({
        text: editingProject ? "Project updated successfully!" : "New project added successfully!",
        type: "success",
      });
    } catch (err: any) {
      setMessage({ text: err.message || "Save error", type: "error" });
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete project");
      await fetchProjects();
      setMessage({ text: "Project deleted successfully!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Delete error", type: "error" });
    }
  };

  if (!token) {
    return (
      <div className="admin-root admin-login-wrapper">
        <div className="admin-card">
          <h2 className="admin-title">Admin Portal</h2>
          <p className="admin-subtitle">Sign in to manage projects and portfolio content</p>

          {loginError && <div className="admin-error">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label className="admin-label">Username / Email</label>
              <input
                type="text"
                className="admin-input"
                placeholder="admin or debojitdey037@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="admin-hint">
            <strong>Default Credentials:</strong><br />
            Username: <code>admin</code> or <code>debojitdey037@gmail.com</code><br />
            Password: <code>debojit2026</code>
          </p>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={onExit}
              className="admin-btn admin-btn-secondary"
              style={{ width: "100%" }}
            >
              <FiArrowLeft /> Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) { alert("Title and issuer required"); return; }
    try {
      const res = await fetch(`${API_BASE}/certifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(certForm),
      });
      if (!res.ok) throw new Error("Failed to add certification");
      await fetchCerts();
      setIsCertModalOpen(false);
      setCertForm({ title: "", issuer: "", issuedDate: "", credentialId: "", credentialUrl: "", logo: "" });
      setMessage({ text: "Certification added!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  const handleDeleteCert = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/certifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchCerts();
      setMessage({ text: "Certification deleted!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-header">
        <div>
          <h1 className="admin-title" style={{ fontSize: "2rem" }}>
            Debojit Dey – Portfolio Manager
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Manage projects and certifications shown on your live portfolio
          </p>
        </div>

        <div className="admin-header-actions">
          <button onClick={onExit} className="admin-btn admin-btn-secondary">
            <FiArrowLeft /> View Website
          </button>
          {activeTab === "projects" ? (
            <button onClick={openAddModal} className="admin-btn admin-btn-primary" style={{ width: "auto" }}>
              <FiPlus /> Add Project
            </button>
          ) : (
            <button onClick={() => setIsCertModalOpen(true)} className="admin-btn admin-btn-primary" style={{ width: "auto" }}>
              <FiPlus /> Add Certification
            </button>
          )}
          <button onClick={handleLogout} className="admin-btn admin-btn-danger">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #222", paddingBottom: "0" }}>
        <button
          onClick={() => setActiveTab("projects")}
          style={{
            background: "none", border: "none", color: activeTab === "projects" ? "#fff" : "#555",
            fontFamily: "inherit", fontSize: "15px", fontWeight: 600, padding: "12px 20px",
            cursor: "pointer", borderBottom: activeTab === "projects" ? "2px solid #9b59b6" : "2px solid transparent",
            transition: "0.2s",
          }}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("certifications")}
          style={{
            background: "none", border: "none", color: activeTab === "certifications" ? "#fff" : "#555",
            fontFamily: "inherit", fontSize: "15px", fontWeight: 600, padding: "12px 20px",
            cursor: "pointer", borderBottom: activeTab === "certifications" ? "2px solid #9b59b6" : "2px solid transparent",
            transition: "0.2s", display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          <FiAward /> Certifications ({certs.length})
        </button>
      </div>

      {message && (
        <div className={message.type === "success" ? "admin-success" : "admin-error"}>
          {message.text}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="admin-grid">
        {projects.map((p, idx) => (
          <div className="admin-project-card" key={p.id}>
            <img
              src={p.image || "/images/placeholder.webp"}
              alt={p.title}
              className="admin-project-img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/placeholder.webp";
              }}
            />
            <div className="admin-project-body">
              <span className="admin-project-category">0{idx + 1} • {p.category}</span>
              <h3 className="admin-project-title">{p.title}</h3>
              <p className="admin-project-desc">{p.description}</p>
              <div className="admin-project-tools">
                <strong>Tech:</strong> {p.tools}
              </div>

              <div className="admin-project-actions">
                <button
                  onClick={() => openEditModal(p)}
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1 }}
                >
                  <FiEdit2 /> Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(p.id, p.title)}
                  className="admin-btn admin-btn-danger"
                  style={{ flex: 1 }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {activeTab === "certifications" && (
        <div className="admin-grid">
          {certs.map((cert) => (
            <div className="admin-project-card" key={cert.id} style={{ minHeight: "auto" }}>
              <div style={{ padding: "20px", display: "flex", gap: "14px", alignItems: "center" }}>
                {cert.logo && (
                  <img src={cert.logo} alt={cert.issuer} style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 8, background: "#fff", padding: 4 }} />
                )}
                <div>
                  <span className="admin-project-category">{cert.issuer} · {cert.issuedDate}</span>
                  <h3 className="admin-project-title" style={{ margin: "4px 0 0" }}>{cert.title}</h3>
                  {cert.credentialId && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>ID: {cert.credentialId}</p>}
                </div>
              </div>
              <div className="admin-project-body" style={{ paddingTop: 0 }}>
                <div className="admin-project-actions">
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{ flex: 1, textAlign: "center" }}>
                      View
                    </a>
                  )}
                  <button onClick={() => handleDeleteCert(cert.id, cert.title)} className="admin-btn admin-btn-danger" style={{ flex: 1 }}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCertModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h2 className="admin-title" style={{ fontSize: "1.5rem", margin: 0 }}>Add Certification</h2>
              <button className="admin-modal-close" onClick={() => setIsCertModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCert}>
              <div className="admin-form-group">
                <label className="admin-label">Certificate Title *</label>
                <input type="text" className="admin-input" placeholder="e.g. Python (Basic)" value={certForm.title || ""} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Issuer *</label>
                <input type="text" className="admin-input" placeholder="e.g. HackerRank, MongoDB, Coursera" value={certForm.issuer || ""} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Issue Date</label>
                <input type="text" className="admin-input" placeholder="e.g. Jul 2026" value={certForm.issuedDate || ""} onChange={(e) => setCertForm({ ...certForm, issuedDate: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Credential ID</label>
                <input type="text" className="admin-input" placeholder="e.g. 42F88A64BDDB" value={certForm.credentialId || ""} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Credential URL</label>
                <input type="url" className="admin-input" placeholder="https://..." value={certForm.credentialUrl || ""} onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Logo URL</label>
                <input type="text" className="admin-input" placeholder="/images/cert-hackerrank.png" value={certForm.logo || ""} onChange={(e) => setCertForm({ ...certForm, logo: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button type="button" className="admin-btn admin-btn-secondary" style={{ flex: 1 }} onClick={() => setIsCertModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}><FiCheck /> Add Certification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h2 className="admin-title" style={{ fontSize: "1.5rem", margin: 0 }}>
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="admin-form-group">
                <label className="admin-label">Project Title *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Restaurant Order Management System"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Full-Stack Web App, Android App, AI/ML"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Tools & Tech Stack</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. React 19, Node.js, Express, MongoDB, JWT"
                  value={formData.tools || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tools: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description *</label>
                <textarea
                  rows={4}
                  className="admin-textarea"
                  placeholder="Brief description of what the project does and key engineering highlights..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">GitHub Repository URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://github.com/debojitdey037/..."
                  value={formData.github || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Live Demo / Preview URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://your-demo-app.vercel.app"
                  value={formData.link || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Cover Image</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="URL or /images/placeholder.webp"
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                  <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                    <FiUpload /> {uploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{ flex: 1 }}
                >
                  <FiCheck /> {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

