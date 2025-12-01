import Link from 'next/link';

export default function About() {
  return (
    <section>
      <header style={{marginBottom:'1rem'}}>
        <h1 style={{margin:0,color:'var(--color-text-light)'}}>About Me</h1>
        <p style={{marginTop:'0.5rem',color:'var(--color-text)'}}>I'm a frontend engineer who loves building interfaces that feel fast, polished, and human.</p>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'1.25rem',alignItems:'start'}}>
        <div>
          <h2 style={{color:'var(--color-text-light)'}}>What I do</h2>
          <p style={{color:'var(--color-text)'}}>I build web applications using React and Next.js with attention to performance, accessibility, and delightful UI micro-interactions. My work spans from design collaboration to implementing production-ready features and APIs.</p>

          <h3 style={{color:'var(--color-text-light)'}}>Selected Skills</h3>
          <ul style={{color:'var(--color-text)',marginTop:'0.5rem'}}>
            <li>Next.js & React</li>
            <li>Modern JavaScript</li>
            <li>HTML & CSS</li>
            <li>Prisma & PostgreSQL</li>
            <li>Responsive design & animations</li>
            <li>Testing & CI</li>
          </ul>

          <h3 style={{color:'var(--color-text-light)',marginTop:'1rem'}}>Approach</h3>
          <p style={{color:'var(--color-text)'}}>I focus on shipping reliable features while keeping interfaces accessible and maintainable. I like to prototype quickly and iterate with user feedback.</p>

          <div style={{marginTop:'1rem',display:'flex',gap:'0.6rem'}}>
            <Link href="/projects" className="btn">View Projects</Link>
            <Link href="/contact" className="btn secondary">Get in touch</Link>
          </div>
        </div>

        <aside style={{padding:'1rem',borderRadius:10,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(55,48,163,0.06)'}}>
          <h4 style={{marginTop:0,color:'var(--color-text-light)'}}>Quick Info</h4>
          <p style={{color:'var(--color-text)'}}><strong>Location:</strong> Remote</p>
          <p style={{color:'var(--color-text)'}}><strong>Available for:</strong> Contract / Part-Time</p>
          <p style={{color:'var(--color-text)'}}><strong>Email:</strong> <a href="mailto:yarascarlet45@gmail.com" className="project-link">yarascarlet45@gmail.com</a></p>
        </aside>
      </div>
    </section>
  );
}
