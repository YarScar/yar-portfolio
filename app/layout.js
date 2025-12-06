"use client";
import { useState, createContext, useContext, useEffect } from 'react';
import './globals.css';
import Link from 'next/link';
import CatSprite from "./components/CatSprite";
import SecretModal from "./components/SecretModal";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export default function RootLayout({ children }) {
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Load admin mode from localStorage on mount
  useEffect(() => {
    const savedAdminMode = localStorage.getItem('isAdminMode') === 'true';
    setIsAdminMode(savedAdminMode);
  }, []);

  const handleSecretTrigger = () => {
    setShowSecretModal(true);
  };

  const handleVerified = () => {
    setIsAdminMode(true);
    localStorage.setItem('isAdminMode', 'true');
    setShowSecretModal(false);
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    localStorage.removeItem('isAdminMode');
  };

  return (
    <html lang="en">
      <head>
        <title>Portfolio API - Showcase Express</title>
        <meta name="description" content="Showcase Express - Portfolio API with Next.js Routes + Database" />
      </head>
      <body>
        <AdminContext.Provider value={{ isAdminMode, exitAdminMode }}>
          <div className="page-root">
            <header className="site-header">
              <div className="site-header-inner">
                <div className="brand-with-sprite">
                  <div className="cat-abs-wrapper">
                    <CatSprite 
                      frameSize={32} 
                      fps={7} 
                      scale={1.5} 
                      className="cat-left"
                      onSecretTrigger={handleSecretTrigger}
                      isAdminMode={isAdminMode}
                    />
                  </div>
                  <Link href="/" className="brand">Showcase Express</Link>
                </div>
                <nav className="site-nav">
                  <Link href="/about" className="nav-link">About</Link>
                  <Link href="/projects" className="nav-link">Projects</Link>
                  <Link href="/contact" className="nav-link">Contact</Link>
                  {isAdminMode && (
                    <button
                      onClick={exitAdminMode}
                      className="nav-link admin-exit"
                    >
                      Exit Admin 👑
                    </button>
                  )}
                </nav>
              </div>
              {isAdminMode && (
                <div className="admin-banner">
                  👑 Admin Mode Active - You can now add and delete projects
                </div>
              )}
            </header>

            <main className="container">{children}</main>

            <footer className="site-footer" id="contact">
              <div className="site-footer-inner">
                <p>© {new Date().getFullYear()} Showcase Express — Built with Next.js</p>
              </div>
            </footer>
          </div>

          <SecretModal
            isOpen={showSecretModal}
            onClose={() => setShowSecretModal(false)}
            onVerified={handleVerified}
          />
        </AdminContext.Provider>
      </body>
    </html>
  );
}
