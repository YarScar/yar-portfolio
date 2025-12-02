export const metadata = {
  title: "Portfolio API",
  description: "Showcase Express - Portfolio API with Next.js Routes + Database",
};

import './globals.css';
import Link from 'next/link';
import CatSprite from "./components/CatSprite";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

         {/* 🔥 Global Sprite (stays on every page) */}
        <CatSprite
          frameWidth={64}
          frameHeight={64}
          steps={8}
          fps={10}
        />
        
        <div className="page-root">
          <header className="site-header">
            <div className="site-header-inner">
              <Link href="/" className="brand">Showcase Express</Link>
              <nav className="site-nav">
                <Link href="/about" className="nav-link">About</Link>
                <Link href="/projects" className="nav-link">Projects</Link>
                <Link href="/contact" className="nav-link">Contact</Link>
              </nav>
            </div>
          </header>

          <main className="container">{children}</main>

          <footer className="site-footer" id="contact">
            <div className="site-footer-inner">
              <p>© {new Date().getFullYear()} Showcase Express — Built with Next.js</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
