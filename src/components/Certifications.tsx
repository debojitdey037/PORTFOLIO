import { useEffect, useState } from "react";
import "./styles/Certifications.css";
import { FiExternalLink, FiAward } from "react-icons/fi";
import { API_BASE } from "../config/api";

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
}

const defaultCertifications: Certification[] = [
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

const Certifications = () => {
  const [certs, setCerts] = useState<Certification[]>(defaultCertifications);

  useEffect(() => {
    fetch(`${API_BASE}/certifications`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCerts(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="cert-section section-container" id="certifications">
      <h2 className="cert-heading">
        My <span>Certifications</span>
      </h2>
      <p className="cert-subheading">
        Verified credentials &amp; licenses from industry-leading platforms
      </p>

      <div className="cert-grid">
        {certs.map((cert, i) => (
          <div className="cert-card" key={cert.id} style={{ "--i": i } as React.CSSProperties}>
            <div className="cert-card-top">
              <div className="cert-icon">
                {cert.logo ? (
                  <img src={cert.logo} alt={cert.issuer} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <FiAward />
                )}
              </div>
              <div className="cert-meta">
                <span className="cert-issuer">{cert.issuer}</span>
                <span className="cert-date">Issued {cert.issuedDate}</span>
              </div>
            </div>

            <h3 className="cert-title">{cert.title}</h3>

            {cert.credentialId && (
              <p className="cert-id">
                <span>Credential ID</span> {cert.credentialId}
              </p>
            )}

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-link"
              >
                <FiExternalLink /> Show Credential
              </a>
            )}

            <div className="cert-badge">Verified</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
export { defaultCertifications };

