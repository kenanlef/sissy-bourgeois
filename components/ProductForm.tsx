"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProductForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", compareAt: "",
    category: "Bras", color: "Lilac", image: "/products/lilac-bra.svg"
  });
  const [message, setMessage] = useState("");

  function set(key: string, value: string) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Math.round(Number(form.price) * 100),
        compareAt: form.compareAt ? Math.round(Number(form.compareAt) * 100) : null
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Could not create product.");
      return;
    }
    setMessage("Product created.");
    setForm({ name:"", slug:"", description:"", price:"", compareAt:"", category:"Bras", color:"Lilac", image:"/products/lilac-bra.svg" });
    router.refresh();
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Add product</h2>
      {message ? <div className="notice">{message}</div> : null}
      <div className="field"><label>Name</label><input required value={form.name} onChange={e => set("name", e.target.value)} /></div>
      <div className="field"><label>Slug</label><input required value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="lila-studio-bra" /></div>
      <div className="field"><label>Description</label><textarea required value={form.description} onChange={e => set("description", e.target.value)} /></div>
      <div className="field"><label>Price (€)</label><input required type="number" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} /></div>
      <div className="field"><label>Compare-at price (€)</label><input type="number" step="0.01" value={form.compareAt} onChange={e => set("compareAt", e.target.value)} /></div>
      <div className="field"><label>Category</label><select value={form.category} onChange={e => set("category", e.target.value)}><option>Bras</option><option>Tops</option><option>Bottoms</option><option>Leggings</option></select></div>
      <div className="field"><label>Color</label><input required value={form.color} onChange={e => set("color", e.target.value)} /></div>
      <div className="field"><label>Image path</label><input required value={form.image} onChange={e => set("image", e.target.value)} /></div>
      <button className="button" type="submit">CREATE PRODUCT</button>
    </form>
  );
}
