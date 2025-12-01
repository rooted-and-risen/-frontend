import React, { useState, useEffect } from "react";

/**
 * Rooted & Risen — App.jsx
 * Drop into a React app (Vite/CRA/Next). This is a single-file example.
 */

export default function App() {
  const [page, setPage] = useState("home");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Reflection");
  const [image, setImage] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("rar_token") || "");
  const apiBase = process.env.REACT_APP_API_BASE || "";

  useEffect(() => {
    // Load from backend if configured, otherwise from localStorage
    async function load() {
      if (apiBase) {
        try {
          const res = await fetch(apiBase + "/api/posts");
          if (res.ok) {
            const data = await res.json();
            setPosts(data.posts.reverse());
            return;
          }
        } catch (e) {
          console.warn("Backend unreachable, falling back to localStorage.");
        }
      }
      const stored = localStorage.getItem("rooted_posts");
      if (stored) setPosts(JSON.parse(stored));
    }
    load();
  }, [apiBase]);

  useEffect(() => {
    if (!apiBase) {
      localStorage.setItem("rooted_posts", JSON.stringify(posts));
    }
  }, [posts, apiBase]);

  const addPost = async () => {
    if (!title.trim() || !content.trim()) return alert("Title and content required.");
    const newPost = {
      id: Date.now(),
      title,
      content,
      category,
      image,
      date: new Date().toLocaleString(),
    };
    if (apiBase && token) {
      try {
        const res = await fetch(apiBase + "/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(newPost),
        });
        if (!res.ok) {
          const err = await res.json();
          return alert("Error saving post: " + (err.message || res.statusText));
        }
        const saved = await res.json();
        setPosts([saved.post, ...posts]);
      } catch (e) {
        alert("Network error. Saving locally.");
        setPosts([newPost, ...posts]);
      }
    } else {
      setPosts([newPost, ...posts]);
    }
    setTitle("");
    setContent("");
    setImage(null);
    setCategory("Reflection");
    setPage("home");
  };

  const loginDemo = async () => {
    if (!apiBase) return alert("No backend configured. Set REACT_APP_API_BASE to enable login.");
    const username = prompt("Enter demo username (default: talitha):", "talitha");
    const password = prompt("Enter demo password (default: rise123):", "rise123");
    try {
      const res = await fetch(apiBase + "/api/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({username,password}),
      });
      if (!res.ok) return alert("Login failed.");
      const data = await res.json();
      setToken(data.token);
      localStorage.setItem("rar_token", data.token);
      alert("Logged in (demo). You can now publish to backend.");
    } catch (e) {
      alert("Login network error.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight mb-2">Rooted & Risen</h1>
        <p className="text-lg italic text-gray-600 mb-4">Writing for the ones learning to rise again.</p>
        <nav className="flex justify-center gap-6 text-lg font-medium">
          <button onClick={()=>setPage("home")} className="hover:underline">Home</button>
          <button onClick={()=>setPage("create")} className="hover:underline">Create</button>
          <button onClick={()=>setPage("categories")} className="hover:underline">Categories</button>
          <button onClick={loginDemo} className="hover:underline">Author Login</button>
        </nav>
      </header>

      {page==="home" && (
        <section className="max-w-3xl mx-auto space-y-6">
          {posts.length===0 && <p className="text-center text-gray-500 italic">No posts yet.</p>}
          {posts.map(p=>(
            <article key={p.id} className="p-6 bg-white rounded-2xl shadow">
              {p.image && <img src={p.image} alt="post" className="rounded-xl mb-4" />}
              <h3 className="text-2xl font-bold mb-1">{p.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{p.date}</p>
              <span className="text-xs px-3 py-1 bg-gray-200 rounded-full inline-block mb-4">{p.category}</span>
              <p className="leading-relaxed whitespace-pre-wrap">{p.content}</p>
            </article>
          ))}
        </section>
      )}

      {page==="create" && (
        <section className="max-w-3xl mx-auto p-6 rounded-2xl shadow bg-gray-50">
          <h2 className="text-3xl font-semibold mb-6 text-center">Write a New Story</h2>
          <input type="text" placeholder="Post title..." value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-3 mb-4 border rounded-xl" />
          <textarea placeholder="Write your story..." value={content} onChange={(e)=>setContent(e.target.value)} className="w-full p-3 h-40 border rounded-xl mb-4" />
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 mb-4 border rounded-xl">
            <option>Reflection</option><option>Testimony</option><option>Prayer</option><option>Devotional</option><option>Story</option>
          </select>
          <input type="file" accept="image/*" onChange={(e)=>{
            const file = e.target.files[0];
            if(file){
              const reader = new FileReader();
              reader.onloadend = ()=> setImage(reader.result);
              reader.readAsDataURL(file);
            }
          }} className="mb-4" />
          {image && <img src={image} alt="preview" className="rounded-xl mb-4 max-h-60 mx-auto" />}
          <button onClick={addPost} className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition w-full">Publish Story</button>
        </section>
      )}

      {page==="categories" && (
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">Browse by Category</h2>
          {["Reflection","Testimony","Prayer","Devotional","Story"].map(cat=>(
            <div key={cat} className="mb-10">
              <h3 className="text-2xl font-bold mb-4">{cat}</h3>
              <div className="space-y-6">
                {posts.filter(p=>p.category===cat).map(p=>(
                  <article key={p.id} className="p-6 bg-white rounded-2xl shadow">
                    {p.image && <img src={p.image} alt="post" className="rounded-xl mb-4" />}
                    <h4 className="text-xl font-bold mb-1">{p.title}</h4>
                    <p className="text-sm text-gray-500 mb-1">{p.date}</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{p.content}</p>
                  </article>
                ))}
                {posts.filter(p=>p.category===cat).length===0 && <p className="text-gray-500 italic">No posts in this category yet.</p>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
