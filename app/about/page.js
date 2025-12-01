import Link from 'next/link';

export default function About() {
  return (
    <section>
      <div style={{marginBottom:'3rem',textAlign:'center',padding:'2rem 0'}}>
        <h1 style={{margin:0,fontSize:'2.5rem',color:'var(--color-text-light)',background:'linear-gradient(135deg, #FAF5FF, #E9D5FF, #D8B4FE)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>About Me</h1>
        <p style={{marginTop:'1rem',fontSize:'1.15rem',color:'var(--color-text)',opacity:0.9,maxWidth:'700px',margin:'1rem auto 0'}}>Full-stack developer passionate about creating innovative solutions that blend cutting-edge technology with intuitive user experiences.</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 350px',gap:'2rem',alignItems:'start',marginBottom:'2rem'}}>
        <div>
          <div style={{background:'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.05))',padding:'2rem',borderRadius:'16px',border:'1px solid rgba(168,85,247,0.2)',marginBottom:'2rem',boxShadow:'0 8px 32px rgba(168,85,247,0.1)'}}>
            <h2 style={{color:'var(--color-text-light)',fontSize:'1.8rem',marginTop:0,marginBottom:'1rem'}}>What I Do</h2>
            <p style={{color:'var(--color-text)',lineHeight:'1.7',fontSize:'1.05rem'}}>I build full-stack web applications with a focus on creating seamless user experiences. From AI-powered productivity tools to immigration support platforms, I specialize in turning complex problems into elegant, accessible solutions using modern web technologies.</p>
          </div>

          <div style={{background:'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.05))',padding:'2rem',borderRadius:'16px',border:'1px solid rgba(168,85,247,0.2)',marginBottom:'2rem',boxShadow:'0 8px 32px rgba(168,85,247,0.1)'}}>
            <h3 style={{color:'var(--color-text-light)',fontSize:'1.5rem',marginTop:0,marginBottom:'1.25rem'}}>Technical Skills</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:'0.75rem'}}>
              <div style={{background:'rgba(168,85,247,0.1)',padding:'0.75rem 1rem',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.25)',color:'var(--color-accent)',fontWeight:'500'}}>⚛️ React & Vite</div>
              <div style={{background:'rgba(168,85,247,0.1)',padding:'0.75rem 1rem',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.25)',color:'var(--color-accent)',fontWeight:'500'}}>▲ Next.js</div>
              <div style={{background:'rgba(168,85,247,0.1)',padding:'0.75rem 1rem',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.25)',color:'var(--color-accent)',fontWeight:'500'}}>🤖 AI Integration</div>
              <div style={{background:'rgba(168,85,247,0.1)',padding:'0.75rem 1rem',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.25)',color:'var(--color-accent)',fontWeight:'500'}}>🗄️ Prisma & PostgreSQL</div>
              <div style={{background:'rgba(168,85,247,0.1)',padding:'0.75rem 1rem',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.25)',color:'var(--color-accent)',fontWeight:'500'}}>💻 JavaScript/TypeScript</div>
              <div style={{background:'rgba(168,85,247,0.1)',padding:'0.75rem 1rem',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.25)',color:'var(--color-accent)',fontWeight:'500'}}>🎨 UI/UX Design</div>
            </div>
          </div>

          <div style={{background:'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.05))',padding:'2rem',borderRadius:'16px',border:'1px solid rgba(168,85,247,0.2)',boxShadow:'0 8px 32px rgba(168,85,247,0.1)'}}>
            <h3 style={{color:'var(--color-text-light)',fontSize:'1.5rem',marginTop:0,marginBottom:'1rem'}}>My Approach</h3>
            <p style={{color:'var(--color-text)',lineHeight:'1.7',fontSize:'1.05rem',marginBottom:'1.5rem'}}>I believe in building products that solve real problems. Whether it's creating study tools that help students succeed or platforms that support immigrants in their journey, I focus on user-centric design and clean, maintainable code.</p>
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              <Link href="/projects" className="btn">View My Work</Link>
              <Link href="/contact" className="btn secondary">Let's Connect</Link>
            </div>
          </div>
        </div>

        <aside style={{position:'sticky',top:'2rem'}}>
          <div style={{padding:'1.75rem',borderRadius:'16px',background:'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(192,132,252,0.08))',border:'2px solid rgba(168,85,247,0.25)',boxShadow:'0 12px 48px rgba(168,85,247,0.2)',marginBottom:'1.5rem'}}>
            <h4 style={{marginTop:0,marginBottom:'1.5rem',color:'var(--color-text-light)',fontSize:'1.3rem',textAlign:'center'}}>Quick Info</h4>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{padding:'0.75rem',background:'rgba(255,255,255,0.03)',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.15)'}}>
                <div style={{fontSize:'0.85rem',color:'var(--color-accent)',marginBottom:'0.25rem',fontWeight:'600'}}>📍 Location</div>
                <div style={{color:'var(--color-text)',fontWeight:'500'}}>Remote</div>
              </div>
              <div style={{padding:'0.75rem',background:'rgba(255,255,255,0.03)',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.15)'}}>
                <div style={{fontSize:'0.85rem',color:'var(--color-accent)',marginBottom:'0.25rem',fontWeight:'600'}}>💼 Available For</div>
                <div style={{color:'var(--color-text)',fontWeight:'500'}}>Contract / Full-Time</div>
              </div>
              <div style={{padding:'0.75rem',background:'rgba(255,255,255,0.03)',borderRadius:'10px',border:'1px solid rgba(168,85,247,0.15)'}}>
                <div style={{fontSize:'0.85rem',color:'var(--color-accent)',marginBottom:'0.25rem',fontWeight:'600'}}>✉️ Email</div>
                <a href="mailto:your.email@example.com" className="project-link" style={{fontSize:'0.95rem',wordBreak:'break-word'}}>your.email@example.com</a>
              </div>
            </div>
          </div>
          
          <div style={{padding:'1.5rem',borderRadius:'16px',background:'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.05))',border:'1px solid rgba(168,85,247,0.2)',textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>🚀</div>
            <p style={{color:'var(--color-text)',fontSize:'0.95rem',margin:0,lineHeight:'1.6'}}>Let's build something amazing together</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
