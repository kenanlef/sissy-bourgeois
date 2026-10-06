"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export function AssetManager({initial}:{initial:any[]}){
  const [assets,setAssets]=useState(initial);
  const [key,setKey]=useState("");
  const [image,setImage]=useState("");
  const [uploading,setUploading]=useState(false);
  const router=useRouter();

  async function upload(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file)return;
    setUploading(true);
    const fd=new FormData();
    fd.append("file",file);
    const r=await fetch("/api/admin/upload",{method:"POST",body:fd});
    const d=await r.json();
    setUploading(false);
    if(r.ok)setImage(d.url);
    else alert(d.error||"Upload failed.");
  }

  async function save(){
    if(!key.trim()){
      alert("Please enter an image key.");
      return;
    }
    if(!image){
      alert("Please choose an image file first.");
      return;
    }

    const r=await fetch("/api/admin/assets",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({key:key.trim(),image})
    });
    const d=await r.json();

    if(r.ok){
      setAssets([d,...assets.filter(x=>x.key!==d.key)]);
      setKey("");
      setImage("");
      router.refresh();
    }else{
      alert(d.error||"Could not save image.");
    }
  }

  return <>
    <div className="form">
      <h2>Replace a site image</h2>

      <div className="field">
        <label>Key (example: hero)</label>
        <input
          value={key}
          onChange={e=>setKey(e.target.value)}
          placeholder="hero"
        />
      </div>

      <div className="field">
        <label>Upload image</label>
        <input
          type="file"
          accept="image/*"
          onChange={upload}
        />
        {uploading&&<div className="muted">Uploading...</div>}
        {image&&<img className="asset-preview" src={image} alt="Selected site image"/>}
      </div>

      <button
        className="button"
        onClick={save}
        disabled={uploading||!key||!image}
      >
        {uploading?"UPLOADING...":"SAVE SITE IMAGE"}
      </button>
    </div>

    <div className="admin-list">
      {assets.map(a=>
        <div className="order-card" key={a.id}>
          <strong>{a.key}</strong>
          <img className="asset-preview" src={a.image} alt=""/>
        </div>
      )}
    </div>
  </>;
}
