import Link from "next/link";

const sampleProjects = [
  { id: 1, title: 'Portfolio Website', description: 'A personal portfolio showcasing projects and blog posts.', long: 'Built with Next.js, responsive layout, and smooth animations.', tags: ['Next.js','React'], url: '#' },
  { id: 2, title: 'E‑commerce Demo', description: 'Small shop demo with cart and checkout flow.', long: 'Demo shop using Prisma and Stripe integration for payments.', tags: ['React','Prisma'], url: '#' },
  { id: 3, title: 'Real‑time Chat', description: 'Websocket powered chat with rooms and online presence.', long: 'Realtime features via Socket.io and scalable design.', tags: ['Socket.io','Node'], url: '#' }
];

export default async function ProjectDetailPage({ params }) {
  const id = Number(params.id);
  let project = null;

  try {
    const res = await fetch(`/api/projects/${id}`, { cache: 'no-store' });
    if (res.ok) project = await res.json();
  } catch (err) {
    // ignore and fall back to sample data
  }

  if (!project) project = sampleProjects.find((p) => p.id === id) || null;

  if (!project) {
    return (
      <section>
        <h1 style={{ color: 'var(--color-text-light)' }}>Project not found</h1>
        <p style={{ color: 'var(--color-text)' }}>We couldn't find the project you're looking for.</p>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/projects">← Back to Projects</Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="project-hero">
        <h1 style={{ margin: 0, color: 'var(--color-text-light)' }}>{project.title}</h1>
        <p style={{ margin: 0, color: 'var(--color-text)' }}>{project.description}</p>
        <div className="project-meta">
          {(project.tags || []).map((t, i) => (
            <span className="tag" key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 10, border: '1px solid rgba(55,48,163,0.06)' }}>
        <p style={{ color: 'var(--color-text)' }}>{project.long || project.description}</p>
        {project.url && (
          <p style={{ marginTop: '1rem' }}>
            <a className="project-link" href={project.url} target="_blank" rel="noreferrer">View Live</a>
          </p>
        )}
      </div>

      <nav style={{ marginTop: '2rem' }}>
        <Link href="/projects">← Back to Projects</Link>
      </nav>
    </section>
  );
}
