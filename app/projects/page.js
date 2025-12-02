import Link from "next/link";
import Image from "next/image";
import AdminProjectsWrapper from "../components/AdminProjectsWrapper";
import AdminDeleteOverlay from "../components/AdminDeleteOverlay";

const sampleProjects = [
  { id: 1, title: 'Najah', description: 'A React-based study app that brings together task management, a customizable Pomodoro timer, AI homework help, and lofi music in a smooth, productivity-focused workspace.', tags: ['Vite','React', 'Gemini API'], url: 'https://404sleepnotfound.vercel.app/', image: '/images/najah-logo.png' },
  { id: 2, title: 'Immigo', description: 'An immigration support platform connecting immigrants with resources, legal assistance, and community support services.', tags: ['Next.js','React','Prisma'], url: 'https://immigo-pi.vercel.app/', image: '/images/immigo-logo.png' },
  { id: 3, title: 'Agentic Data Quality Analysis Platform', description: 'AI-powered data quality analysis platform that helps business users understand and improve dataset quality with intelligent insights.', tags: ['Next.js','React','OpenAI API','Chart.js'], url: 'https://data-analysis-tutorial-three.vercel.app/', image: '/images/data-analysis-logo.png' }
];

async function getProjects() {
  try {
    // Try to fetch from database first
    const res = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL || 'http://localhost:3000' : 'http://localhost:3000'}/api/projects`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (res.ok) {
      const dbProjects = await res.json();
      // Combine database projects with sample projects, ensuring sample projects show first
      const combinedProjects = [...sampleProjects];
      
      // Add database projects that aren't already in sample projects
      dbProjects.forEach(dbProject => {
        const exists = sampleProjects.find(sample => sample.id === dbProject.id);
        if (!exists) {
          combinedProjects.push(dbProject);
        }
      });
      
      return combinedProjects;
    } else {
      return sampleProjects;
    }
  } catch (err) {
    console.log('Database fetch failed, using sample projects:', err.message);
    return sampleProjects;
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminProjectsWrapper initialProjects={projects}>
      <section>
        <h1 style={{margin:0,color:'var(--color-text-light)'}}>Projects</h1>
        <p style={{marginTop:'0.5rem',color:'var(--color-text)'}}>Selected projects & case studies — click to view details.</p>

        <div className="projects-grid">
          {projects.map((p) => (
            <article className="card" key={p.id} style={{ position: 'relative' }}>
              <AdminDeleteOverlay projectId={p.id} />
              {p.image && (
                <div style={{marginBottom:'1.2rem',display:'flex',justifyContent:'center'}}>
                  <div style={{position:'relative',padding:'8px',background:'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(192,132,252,0.08))',borderRadius:'16px',border:'1px solid rgba(168,85,247,0.2)',boxShadow:'0 8px 32px rgba(168,85,247,0.15)',transition:'transform 200ms ease, box-shadow 200ms ease'}} className="project-logo">
                    <Image src={p.image} alt={`${p.title} logo`} width={70} height={70} style={{borderRadius:'12px',display:'block'}} />
                  </div>
                </div>
              )}
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
    </AdminProjectsWrapper>
  );
}
