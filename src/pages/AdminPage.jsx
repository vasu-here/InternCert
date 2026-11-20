import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./AdminPage.css";

const emptyForm = {
  internName: "",
  branch: "",
  aicteId: "",
  email: "",
  phone: "",
  domain: "",
  duration: "",
  startDate: "",
  endDate: "",
  projectTitle: "",
  certificateId: "",
};

const formFields = [
  { name: "internName", label: "Intern name", autoComplete: "name" },
  { name: "branch", label: "Branch" },
  { name: "aicteId", label: "AICTE ID" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "domain", label: "Internship domain" },
  { name: "duration", label: "Duration", placeholder: "e.g. 6 weeks" },
  { name: "startDate", label: "Start date", type: "date" },
  { name: "endDate", label: "End date", type: "date" },
  { name: "certificateId", label: "Certificate ID" },
  { name: "projectTitle", label: "Project title", wide: true },
];

function AdminPage() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [form, setForm] = useState(emptyForm);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let active = true;
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setAuthLoading(false);
      },
    );

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) setError(sessionError.message);
        setSession(data.session);
        setAuthLoading(false);
      })
      .catch((sessionError) => {
        if (!active) return;
        setError(sessionError.message);
        setAuthLoading(false);
      });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) setError(signInError.message);
    } catch (signInError) {
      setError(signInError.message);
    }
  }

  async function handleSignOut() {
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) setError(signOutError.message);
    } catch (signOutError) {
      setError(signOutError.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Object.values(form).some((value) => !value.trim())) {
      setError("Please complete all certificate fields.");
      return;
    }

    if (form.startDate > form.endDate) {
      setError("The end date must be on or after the start date.");
      return;
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase.from("certificates").insert({
        certificate_id: form.certificateId.trim(),
        intern_name: form.internName.trim(),
        branch: form.branch.trim(),
        aicte_id: form.aicteId.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        internship_domain: form.domain.trim(),
        duration: form.duration.trim(),
        start_date: form.startDate,
        end_date: form.endDate,
        project_title: form.projectTitle.trim(),
      });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      window.location.assign(
        `/verify?id=${encodeURIComponent(form.certificateId.trim())}`,
      );
    } catch (insertError) {
      setError(insertError.message);
      setSaving(false);
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <a href="/verify" aria-label="Certificate verification home">
          <img src="/logo.jpg" alt="Innovate by Hexaind" />
        </a>
        <a className="admin-home-link" href="/verify">
          View verification page
        </a>
      </header>

      <section className="admin-card">
        <p className="admin-eyebrow">Certificate records</p>
        <h1>Admin page</h1>
        <p className="admin-intro">
          Sign in to create a certificate record and open its public
          verification page.
        </p>

        {!isSupabaseConfigured ? (
          <p className="admin-message admin-message--error" role="alert">
            Supabase is not configured. Add VITE_SUPABASE_URL and
            either VITE_SUPABASE_PUBLISHABLE_KEY or
            VITE_SUPABASE_ANON_KEY to .env.local, then restart the app.
          </p>
        ) : authLoading ? (
          <p className="admin-message" role="status">
            Checking admin session…
          </p>
        ) : !session ? (
          <form className="admin-form admin-login" onSubmit={handleSignIn}>
            {error && (
              <p className="admin-message admin-message--error" role="alert">
                {error}
              </p>
            )}
            <label>
              Admin email
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button className="admin-submit" type="submit">
              Sign in
            </button>
          </form>
        ) : (
          <>
            <div className="admin-session">
              <span>Signed in as {session.user.email}</span>
              <button type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              {error && (
                <p className="admin-message admin-message--error" role="alert">
                  {error}
                </p>
              )}
              <div className="admin-fields">
                {formFields.map(({ name, label, type, placeholder, wide, autoComplete }) => (
                  <label
                    className={wide ? "admin-field admin-field--wide" : "admin-field"}
                    key={name}
                  >
                    {label}
                    <input
                      type={type || "text"}
                      name={name}
                      value={form[name]}
                      onChange={updateField}
                      placeholder={placeholder}
                      autoComplete={autoComplete || "off"}
                      required
                    />
                  </label>
                ))}
              </div>
              <p className="admin-privacy-note">
                Email and phone are masked on the public verification page.
              </p>
              <button className="admin-submit" type="submit" disabled={saving}>
                {saving ? "Saving certificate…" : "Submit and view certificate"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminPage;
