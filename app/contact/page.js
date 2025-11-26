"use client";

import { useState } from 'react';

export default function Contact() {
  const [state, setState] = useState({ name: '', email: '', message: '', status: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setState(s => ({ ...s, status: 'sending' }));
    try {
      // Try sending to API route if available
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: state.name, email: state.email, message: state.message }) });
      if (res.ok) setState(s => ({ ...s, status: 'sent', name: '', email: '', message: '' }));
      else setState(s => ({ ...s, status: 'error' }));
    } catch (err) {
      setState(s => ({ ...s, status: 'error' }));
    }
  }

  return (
    <section>
      <h1 style={{margin:0,color:'var(--color-text-light)'}}>Contact</h1>
      <p style={{color:'var(--color-text)',marginTop:'0.5rem'}}>Want to work together or have a question? Send a message and I'll get back to you.</p>

      <form onSubmit={handleSubmit} style={{marginTop:'1rem',display:'grid',gridTemplateColumns:'1fr 320px',gap:'1rem',alignItems:'start'}}>
        <div>
          <label style={{display:'block',color:'var(--color-text)',marginBottom:'0.4rem'}}>Name</label>
          <input value={state.name} onChange={e => setState(s=>({...s,name:e.target.value}))} className="input" required />

          <label style={{display:'block',color:'var(--color-text)',margin:'0.75rem 0 0.4rem'}}>Email</label>
          <input value={state.email} onChange={e => setState(s=>({...s,email:e.target.value}))} className="input" type="email" required />

          <label style={{display:'block',color:'var(--color-text)',margin:'0.75rem 0 0.4rem'}}>Message</label>
          <textarea value={state.message} onChange={e => setState(s=>({...s,message:e.target.value}))} className="input" rows={6} required />

          <div style={{marginTop:'0.75rem'}}>
            <button type="submit" className="btn">Send Message</button>
            <span style={{marginLeft:'0.6rem',color:'var(--color-text)'}}>{state.status === 'sending' ? 'Sending…' : state.status === 'sent' ? 'Sent — thank you!' : state.status === 'error' ? 'Error sending' : ''}</span>
          </div>
        </div>

        <aside style={{padding:'1rem',borderRadius:10,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(55,48,163,0.06)'}}>
          <h4 style={{marginTop:0,color:'var(--color-text-light)'}}>Other ways to reach me</h4>
          <p style={{color:'var(--color-text)'}}>Email: <a href="mailto:your.email@example.com" className="project-link">your.email@example.com</a></p>
          <p style={{color:'var(--color-text)'}}>Twitter: <a className="project-link" href="#">@yourhandle</a></p>
        </aside>
      </form>
    </section>
  );
}
