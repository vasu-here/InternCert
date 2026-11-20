import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "../style/CertificateVerification.css";

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const navLinks = [
  "About",
  "How It Works",
  "Internships",
  "Docs",
  "Blog",
  "Certificates",
  "Contact",
];

const quickLinks = [
  "Home",
  "About Us",
  "How It Works",
  "Internships",
  "Docs",
  "Blog",
  "Certificates",
  "Testimonials",
  "Contact",
];

const topInternships = [
  "AI & Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
  "Data Science",
  "Full Stack Development",
  "Internet of Things",
  "Python Programming",
];

const socialLinks = ["LinkedIn", "Instagram", "Facebook", "X"];

/* ---------------------------------- Icons --------------------------------- */

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M2 13h20" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1 0 16c-1.4 0-2.7-.4-3.9-1.1l-.4-.2-2.8.7.7-2.7-.2-.4A8 8 0 0 1 12 4z" />
    </svg>
  );
}

/* --------------------------------- Pieces --------------------------------- */

function Logo() {
  return (
    <a href="https://innovate.ind.in" className="cv-logo">
      <img className="cv-logo-img" src="/logo.jpg" alt="Innovate by Hexaind" />
    </a>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="cv-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function CertificateVerification({ certificateId }) {
  const [lookup, setLookup] = useState({
    loading: Boolean(certificateId && isSupabaseConfigured),
    certificate: null,
    error: !isSupabaseConfigured
      ? "Certificate verification is not configured."
      : !certificateId
        ? "A certificate ID is required to verify a record."
        : "",
  });

  useEffect(() => {
    if (!supabase || !certificateId) return undefined;

    let active = true;
    supabase
      .rpc("verify_certificate", { p_certificate_id: certificateId })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setLookup({ loading: false, certificate: null, error: error.message });
        } else if (data && data.length > 0) {
          setLookup({ loading: false, certificate: data[0], error: "" });
        } else {
          setLookup({
            loading: false,
            certificate: null,
            error: "No certificate was found with that ID.",
          });
        }
      })
      .catch((error) => {
        if (!active) return;
        setLookup({
          loading: false,
          certificate: null,
          error: error.message,
        });
      });

    return () => {
      active = false;
    };
  }, [certificateId]);

  const certificate = lookup.certificate;
  const internDetails = certificate
    ? [
        { label: "Intern Name", value: certificate.intern_name },
        { label: "Branch", value: certificate.branch },
        { label: "AICTE ID", value: certificate.aicte_id },
        { label: "Email", value: certificate.email },
        { label: "Phone", value: certificate.phone },
      ]
    : [];
  const internshipDetails = certificate
    ? [
        { label: "Domain", value: certificate.internship_domain },
        { label: "Duration", value: certificate.duration },
        { label: "Start Date", value: formatDate(certificate.start_date) },
        { label: "End Date", value: formatDate(certificate.end_date) },
        { label: "Status", value: "Completed" },
        { label: "Project Title", value: certificate.project_title },
      ]
    : [];

  return (
    <div className="cv-page">
      {/* Header */}
      <header className="cv-header">
        <div className="cv-container cv-header-inner">
          <a href="https://innovate.ind.in" >
            <Logo />
          </a>

          <nav className="cv-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link} href="https://innovate.ind.in">
                {link}
              </a>
            ))}
          </nav>

          <a href="https://apply.innovate.ind.in" style={{ color : 'white' }} className="cv-btn cv-btn--solid">
            Apply Now
          </a>
        </div>
      </header>

      <main className="cv-container">
        {/* Hero */}
        <section className="cv-hero">
          <p className="cv-eyebrow">Certificate record lookup</p>
          <h1>Certificate verification.</h1>
          <p className="cv-record-no">
            {certificateId ? `Record No. ${certificateId}` : "Certificate lookup"}
          </p>
        </section>

        {/* Verification card */}
        <section className="cv-card">
          {lookup.loading ? (
            <p role="status">Loading certificate record…</p>
          ) : lookup.error ? (
            <div role="alert">
              <h2>Certificate not verified.</h2>
              <p className="cv-card-sub">{lookup.error}</p>
            </div>
          ) : (
            <>
              <div className="cv-card-head">
                <h2>Certificate verified.</h2>
                <span className="cv-badge">Verified</span>
              </div>
              <p className="cv-card-sub">
                This certificate record is valid and available for verification.
              </p>

              <h3 className="cv-section-label">Intern Details</h3>
              <dl>
                {internDetails.map((row) => (
                  <DetailRow key={row.label} {...row} />
                ))}
              </dl>

              <h3 className="cv-section-label">Internship Details</h3>
              <dl>
                {internshipDetails.map((row) => (
                  <DetailRow key={row.label} {...row} />
                ))}
              </dl>

              <h3 className="cv-section-label">Certificate Details</h3>
              <dl>
                <DetailRow label="Certificate ID" value={certificate.certificate_id} />
              </dl>

              <div className="cv-actions">
                <button
                  type="button"
                  className="cv-btn cv-btn--solid"
                  onClick={() => window.print()}
                  aria-label="Print or save certificate verification as PDF"
                >
                  Print / Save PDF
                </button>
                <a className="cv-btn cv-btn--outline" href="/verify">
                  Verify Another Certificate
                </a>
              </div>
            </>
          )}
        </section>

        <p className="cv-note">
          The details provided here are solely for verification purposes. For
          more information, contact{" "}
          <a href="mailto:hello@innovate.ind.in">hello@innovate.ind.in</a>.
        </p>
      </main>

      {/* Floating action buttons */}
      <div className="cv-float">
        <button type="button" className="cv-float-jobs" aria-label="Internships">
          <BriefcaseIcon />
        </button>
        <button type="button" className="cv-float-chat" aria-label="Chat on WhatsApp">
          <ChatIcon />
        </button>
      </div>

      {/* Footer */}
      <footer className="cv-footer">
        <div className="cv-container">
          <div className="cv-footer-grid">
            <div className="cv-footer-brand">
              <Logo />
              <p>
                Transforming engineering internships. Learn, build, and grow
                through structured programs designed for practical outcomes.
              </p>

              <div className="cv-social">
                {socialLinks.map((s) => (
                  <a href="#" key={s}>
                    {s}
                  </a>
                ))}
              </div>

              <div className="cv-rating">
                <b>4.5</b>
                <span className="cv-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </span>
                <span className="cv-reviews">50 Reviews</span>
              </div>

              <div className="cv-msme">
                <span className="cv-msme-icon" aria-hidden="true"></span>
                <div>
                  <b>MSME Registered</b>
                  <span>UDYAM-TN-02-0397015</span>
                  <a href="#">View Certificate ↗</a>
                </div>
              </div>
            </div>

            <div className="cv-footer-col">
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cv-footer-col">
              <h4>Top Internships</h4>
              <ul>
                {topInternships.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cv-footer-col">
              <h4>Contact Us</h4>
              <ul>
                <li>
                  <a href="mailto:hello@innovate.ind.in">hello@innovate.ind.in</a>
                </li>
                <li>
                  <a href="tel:+919709703085">(+91) 970-970-3085</a>
                </li>
                <li>
                  <a href="https://wa.me/919709703085">
                    WhatsApp: (+91) 970-970-3085
                  </a>
                </li>
                <li>
                  <a href="tel:+16506703085">Chatbot: (+1) 650-670-3085</a>
                </li>
                <li>
                  <a href="#">View on Google Maps</a>
                </li>
              </ul>
            </div>
          </div>

          <p className="cv-watermark" aria-hidden="true">
            innovate
          </p>

          <div className="cv-footer-bottom">
            <span>© 2026 Innovate by Hexaind. All rights reserved.</span>
            <span>AICTE-Aligned Internship Programs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
