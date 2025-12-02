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
        <div style={{background:'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.05))',padding:'2rem',borderRadius:'16px',border:'1px solid rgba(168,85,247,0.2)',boxShadow:'0 8px 32px rgba(168,85,247,0.1)'}}>
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

        <aside style={{padding:'1.75rem',borderRadius:'16px',background:'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(192,132,252,0.08))',border:'2px solid rgba(168,85,247,0.25)',boxShadow:'0 12px 48px rgba(168,85,247,0.2)'}}>
          <h4 style={{marginTop:0,color:'var(--color-text-light)'}}>Other ways to reach me</h4>
          <p style={{color:'var(--color-text)'}}>Email: <a href="mailto:yarascarlet45@gmail.com" className="project-link">yarascarlet45@gmail.com</a></p>
          <p style={{color:'var(--color-text)'}}>LinkedIn: <a className="project-link" href="https://www.linkedin.com/in/yara-kemeh-09b310319/">Yara Kemeh</a></p>
        </aside>
      </form>
    </section>
  );
}
