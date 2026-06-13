import { useState } from "react";
import { submitContactForm } from "../services/api";
import "../styles/HomePage.css"; // Reuse styling for container/neo-shadow

export function meta() {
  return [
    { title: "Contact Me | The Daily Newzlet" },
    { name: "description", content: "Contact The Daily Newzlet team." },
  ];
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      await submitContactForm(formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to send message. Please try again later.");
    }
  };

  return (
    <main className="container page-container" style={{ padding: '4rem var(--margin-mobile)' }}>
      <h1 className="text-display-md text-uppercase mb-4">Contact Me</h1>

      <div className="contact-grid" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

        {/* Contact Form */}
        <div className="neo-shadow" style={{ padding: '2rem', backgroundColor: 'var(--surface-container)' }}>
          <h2 className="text-headline-sm mb-4">Send me a Message</h2>

          {status === "success" ? (
            <div className="success-message text-body-lg" style={{ color: 'green' }}>
              Thank you for your message! I will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="name" className="text-label-lg" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--on-surface)', backgroundColor: 'var(--surface)' }}
                />
              </div>

              <div>
                <label htmlFor="email" className="text-label-lg" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--on-surface)', backgroundColor: 'var(--surface)' }}
                />
              </div>

              <div>
                <label htmlFor="message" className="text-label-lg" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--on-surface)', backgroundColor: 'var(--surface)' }}
                ></textarea>
              </div>

              {status === "error" && (
                <div className="error-message text-body-md" style={{ color: 'red' }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="neo-shadow text-label-caps font-bold"
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  cursor: status === "submitting" ? 'not-allowed' : 'pointer'
                }}
              >
                {status === "submitting" ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </div>

        {/* Links */}
        <div className="neo-shadow" style={{ padding: '2rem', backgroundColor: 'var(--surface-container)', height: 'fit-content' }}>
          <h2 className="text-headline-sm mb-4">Connect with Me</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <a href="https://github.com/dummy-repo" target="_blank" rel="noopener noreferrer" className="text-body-lg" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>
                GitHub Repository
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/dummy-profile" target="_blank" rel="noopener noreferrer" className="text-body-lg" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>
                LinkedIn Profile
              </a>
            </li>
          </ul>
        </div>

      </div>
    </main>
  );
}
