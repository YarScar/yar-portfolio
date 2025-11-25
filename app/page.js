import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>🚀 Showcase Express</h1>
      <p>Portfolio API with Next.js Routes + Database</p>
      <nav style={{ marginTop: '2rem' }}>
        <Link href="/projects" style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          View Projects
        </Link>
      </nav>
    </div>
  );
}
