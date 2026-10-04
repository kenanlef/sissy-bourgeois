import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="admin-page">
      <h1>Admin</h1>
      <p className="muted">Sign in to manage your boutique.</p>
      <LoginForm />
    </main>
  );
}
