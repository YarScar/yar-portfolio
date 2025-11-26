import Link from "next/link";

const sampleProjects = [
  { id: 1, title: 'Portfolio Website', description: 'A personal portfolio showcasing projects and blog posts.', tags: ['Next.js','React'], url: '#' },
  { id: 2, title: 'E‑commerce Demo', description: 'Small shop demo with cart and checkout flow.', tags: ['React','Prisma'], url: '#' },
  { id: 3, title: 'Real‑time Chat', description: 'Websocket powered chat with rooms and online presence.', tags: ['Socket.io','Node'], url: '#' }
];

export default async function ProjectsPage() {
  let projects = [];
  try {
    const res = await fetch('/api/projects', { cache: 'no-store' });
    if (res.ok) projects = await res.json();
    else projects = sampleProjects;
  } catch (err) {
    projects = sampleProjects;
  }

  return (
    <section>
      <h1 style={{margin:0,color:'var(--color-text-light)'}}>Projects</h1>
      <p style={{marginTop:'0.5rem',color:'var(--color-text)'}}>Selected projects & case studies — click to view details.</p>

      <div className="projects-grid">
        {projects.map((p) => (
          <article className="card" key={p.id}>
            <h3 className="title">{p.title}</h3>
            <p className="desc">{p.description}</p>
            <div className="tags">
              {(p.tags || []).map((t, i) => (
                <span className="tag" key={i}>{t}</span>
              ))}
            </div>
            <div style={{marginTop:'1rem',display:'flex',gap:'0.5rem'}}>
              <Link href={`/projects/${p.id}`} className="btn">Details</Link>
              {p.url && <a className="btn secondary" href={p.url} target="_blank" rel="noreferrer">Live</a>}
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to Home</Link>
      </div>
    </section>
  );
}
