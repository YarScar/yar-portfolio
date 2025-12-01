import Link from "next/link";

const sampleProjects = [
  { id: 1, title: 'Najah', description: 'A React-based study app that brings together task management, a customizable Pomodoro timer, AI homework help, and lofi music in a smooth, productivity-focused workspace.', long: 'Najah combines essential productivity tools into one seamless experience: manage your tasks with a clean to-do interface, stay focused with a customizable Pomodoro timer, get instant AI-powered homework help using the Gemini API, and set the mood with integrated lofi music. Built with React and Vite for optimal performance.', tags: ['Vite','React', 'Gemini API'], url: 'https://404sleepnotfound.vercel.app/' },
  { id: 2, title: 'Immigo', description: 'An immigration support platform connecting immigrants with resources, legal assistance, and community support services.', long: 'Immigo is a comprehensive platform designed to help immigrants navigate their journey with confidence. The application connects users with vital resources including legal assistance, community support services, educational materials, and local immigrant support organizations. Built with Next.js and Prisma, it features a user-friendly interface that breaks down complex immigration processes into manageable steps.', tags: ['Next.js','React','Prisma'], url: 'https://immigo-pi.vercel.app/' },
  { id: 3, title: 'Agentic Data Quality Analysis Platform', description: 'AI-powered data quality analysis platform that helps business users understand and improve dataset quality with intelligent insights.', long: 'An intelligent data quality analysis platform built with Next.js that empowers business users and data analysts to understand their datasets without deep technical expertise. Features automated quality analysis for CSV, JSON, and Excel files, identifying missing values, outliers, and inconsistencies. Integrates OpenAI API for natural language explanations of data quality issues, interactive Chart.js dashboards for visual metrics, and professional report generation. Built with React 18, Papa Parse for data processing, and client-side storage for security.', tags: ['Next.js','React','OpenAI API','Chart.js'], url: 'https://data-analysis-tutorial-three.vercel.app/' }
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
