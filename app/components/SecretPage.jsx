"use client";

// This component is no longer used - admin features are now integrated into the main site
// Keeping for backward compatibility but it's effectively disabled
export default function SecretPage({ isVisible, onClose }) {
  // Admin mode is now handled through the layout context
  return null;
        
        <div style={{
          background: 'rgba(168,85,247,0.1)',
          border: '2px solid rgba(168,85,247,0.3)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            color: 'var(--color-text-light)',
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            Secret Developer Notes
          </h2>
          <p style={{
            color: 'var(--color-text)',
            fontSize: '1.1rem',
            lineHeight: '1.7'
          }}>
            This portfolio was built with Next.js, features a custom sprite animation system, and includes various interactive elements. The draggable cat sprite was created as a fun way to add personality to the site while hiding this secret area for curious visitors!
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(168,85,247,0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ color: 'var(--color-text-light)', margin: '0 0 0.5rem 0' }}>Easter Egg</h3>
            <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: 0 }}>
              You discovered the hidden feature!
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(168,85,247,0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
            <h3 style={{ color: 'var(--color-text-light)', margin: '0 0 0.5rem 0' }}>Innovation</h3>
            <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: 0 }}>
              Creative solutions to engage users
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(168,85,247,0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
            <h3 style={{ color: 'var(--color-text-light)', margin: '0 0 0.5rem 0' }}>Attention to Detail</h3>
            <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: 0 }}>
              Every interaction is thoughtfully designed
            </p>
          </div>
        </div>
        
        <p style={{
          color: 'var(--color-accent)',
          fontSize: '1rem',
          fontStyle: 'italic'
        }}>
          Thanks for exploring! 🐾
        </p>
      </div>
      
      <style jsx>{`
        @keyframes secretPageAppear {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}