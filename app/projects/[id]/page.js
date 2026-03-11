import Link from "next/link";
import Image from "next/image";
import prisma from '../../../lib/prisma';

export default async function ProjectDetailPage({ params }) {
  const { id: paramId } = await params;
  const id = Number(paramId);

  // Server-side: fetch directly from the database
  let project = null;
  try {
    project = await prisma.project.findUnique({ where: { id } });
  } catch (err) {
    console.error('Error fetching project from DB:', err);
  }

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
        {project.image && (
          <div style={{marginBottom:'1.5rem',display:'flex',justifyContent:'center'}}>
            <div style={{position:'relative',padding:'12px',background:'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(192,132,252,0.1))',borderRadius:'24px',border:'2px solid rgba(168,85,247,0.3)',boxShadow:'0 12px 48px rgba(168,85,247,0.25), 0 0 40px rgba(192,132,252,0.15)',animation:'logoFloat 6s ease-in-out infinite'}}>
              <Image src={project.image} alt={`${project.title} logo`} width={100} height={100} style={{borderRadius:'16px',display:'block'}} />
            </div>
          </div>
        )}
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
