"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {id:string;name:string;nameFr?:string|null;nameDe?:string|null;slug:string;description:string;descriptionFr?:string|null;descriptionDe?:string|null;price:number;compareAt:number|null;category:string;color:string;image:string;images:string;featured:boolean;active:boolean};

export function AdminProductEditor({product}:{product:Product}) {
  const router=useRouter();
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({...product,nameFr:product.nameFr||"",nameDe:product.nameDe||"",descriptionFr:product.descriptionFr||"",descriptionDe:product.descriptionDe||"",price:(product.price/100).toFixed(2),compareAt:product.compareAt ? (product.compareAt/100).toFixed(2):""});
  const [msg,setMsg]=useState("");
  const set=(k:string,v:any)=>setForm(x=>({...x,[k]:v}));
  async function upload(e:React.ChangeEvent<HTMLInputElement>, key:string) {
    const file=e.target.files?.[0]; if(!file)return;
    const fd=new FormData(); fd.append("file",file);
    const r=await fetch("/api/admin/upload",{method:"POST",body:fd}); const d=await r.json();
    if(r.ok) set(key,d.url); else setMsg(d.error||"Upload failed.");
  }
  async function save(){
    setMsg("Saving...");
    const r=await fetch("/api/admin/products",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      ...form,id:product.id,price:Number(form.price)*100,compareAt:form.compareAt?Number(form.compareAt)*100:null
    })});
    const d=await r.json(); setMsg(r.ok?"Saved successfully.":d.error||"Error."); if(r.ok){router.refresh(); setTimeout(()=>setOpen(false),350);}
  }
  async function remove(){
    if(!confirm("Delete this product?"))return;
    const r=await fetch("/api/admin/products",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:product.id})});
    if(r.ok)router.refresh(); else setMsg((await r.json()).error||"Error.");
  }
  return <div className="admin-product">
    <div className="admin-product-row">
      <img src={product.image} className="admin-thumb" alt="" />
      <div><strong>{product.name}</strong><div className="muted">{(product.price/100).toFixed(2)} € · {product.category}</div></div>
      <span className={product.active?"pill":"pill off"}>{product.active?"Published":"Hidden"}</span>
      <button className="small-btn" onClick={()=>setOpen(!open)}>Edit</button>
      <button className="small-btn danger" onClick={remove}>Delete</button>
    </div>
    {open && <div className="admin-edit-grid">
      <div className="field"><label>Name</label><input value={form.name} onChange={e=>set("name",e.target.value)}/></div>
      <div className="field"><label>French name</label><input value={form.nameFr} onChange={e=>set("nameFr",e.target.value)}/></div>
      <div className="field"><label>German name</label><input value={form.nameDe} onChange={e=>set("nameDe",e.target.value)}/></div>
      <div className="field"><label>Slug</label><input value={form.slug} onChange={e=>set("slug",e.target.value)}/></div>
      <div className="field"><label>Price €</label><input type="number" step="0.01" value={form.price} onChange={e=>set("price",e.target.value)}/></div>
      <div className="field"><label>Compare-at €</label><input type="number" step="0.01" value={form.compareAt} onChange={e=>set("compareAt",e.target.value)}/></div>
      <div className="field"><label>Category</label><input value={form.category} onChange={e=>set("category",e.target.value)}/></div>
      <div className="field"><label>Product color</label><input value={form.color} onChange={e=>set("color",e.target.value)}/></div>
      <div className="field wide"><label>English description</label><textarea value={form.description} onChange={e=>set("description",e.target.value)}/></div>
      <div className="field"><label>French description</label><textarea value={form.descriptionFr} onChange={e=>set("descriptionFr",e.target.value)}/></div>
      <div className="field"><label>German description</label><textarea value={form.descriptionDe} onChange={e=>set("descriptionDe",e.target.value)}/></div>
      <div className="field"><label>Main photo URL</label><input value={form.image} onChange={e=>set("image",e.target.value)}/><input type="file" accept="image/*" onChange={e=>upload(e,"image")}/></div>
      <div className="field"><label>Other photo URLs (one per line)</label><textarea value={(form.images||"").replaceAll("|","\n")} onChange={e=>set("images",e.target.value.replaceAll("\n","|"))}/><input type="file" accept="image/*" multiple onChange={async e=>{for(const f of Array.from(e.target.files||[])){const fd=new FormData();fd.append("file",f);const r=await fetch("/api/admin/upload",{method:"POST",body:fd});const d=await r.json();if(r.ok)set("images",[...(form.images?form.images.split("|"):[]),d.url].filter(Boolean).join("|"));}}}/></div>
      <label className="check"><input type="checkbox" checked={form.featured} onChange={e=>set("featured",e.target.checked)}/> Featured</label>
      <label className="check"><input type="checkbox" checked={form.active} onChange={e=>set("active",e.target.checked)}/> Published</label>
      <div className="wide">{msg&&<div className="notice">{msg}</div>}<button className="button" onClick={save}>SAVE PRODUCT</button></div>
    </div>}
  </div>
}
