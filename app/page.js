import Link from "next/link";

export default function Home() {
  return (
    <section>
      <div className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Crafting elegant interfaces with code</h1>
          <p className="hero-sub">I build web experiences — React & Next.js developer focused on clean design, performance, and delightful interactions.</p>

          <div style={{display:'flex',gap:'0.75rem'}}>
            <Link href="/projects" className="btn">View Projects</Link>
            <a href="#contact" className="btn secondary">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
}
