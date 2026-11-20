import AdminPage from "./pages/AdminPage";
import CertificateVerification from "./pages/CertificateVerification";

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/admin") {
    return <AdminPage />;
  }

  if (pathname === "/" || pathname === "/verify") {
    const query = new URLSearchParams(window.location.search);
    const certificateId =
      query.get("id") ||
      (query.has("id") ? "" : query.keys().next().value || "");

    return <CertificateVerification certificateId={certificateId} />;
  }

  return (
    <main className="route-not-found">
      <h1>Page not found</h1>
      <a href="/verify">Go to certificate verification</a>
    </main>
  );
}

export default App;
