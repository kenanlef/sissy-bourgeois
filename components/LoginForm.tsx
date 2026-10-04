"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label>Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="field"><label>Password</label><input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" type="submit">SIGN IN</button>
    </form>
  );
}
