"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ProjectCard({ project, isAdminMode = false, isDeleting = false, onDelete }) {
  const [imageError, setImageError] = useState(false);
  
  // Check if the image URL is valid (not a local file path)
  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const shouldShowImage = project.image && isValidImageUrl(project.image) && !imageError;

  return (
    <article className="card" style={{ position: 'relative' }}>
      {isAdminMode && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: isDeleting ? 'rgba(239, 68, 68, 0.5)' : 'linear-gradient(135deg, #EF4444, #DC2626)',
            border: 'none',
            color: 'white',
            fontSize: '1rem',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            opacity: isDeleting ? 0.7 : 1
          }}
          title="Delete project"
        >
          {isDeleting ? '⏳' : '🗑️'}
        </button>
      )}
      
      {shouldShowImage && (
        <div style={{marginBottom:'1.2rem',display:'flex',justifyContent:'center'}}>
          <div style={{position:'relative',padding:'8px',background:'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(192,132,252,0.08))',borderRadius:'16px',border:'1px solid rgba(168,85,247,0.2)',boxShadow:'0 8px 32px rgba(168,85,247,0.15)',transition:'transform 200ms ease, box-shadow 200ms ease'}} className="project-logo">
            <Image 
              src={project.image} 
              alt={`${project.title} logo`} 
              width={70} 
              height={70} 
              style={{borderRadius:'12px',display:'block'}} 
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}
      
      <h3 className="title">{project.title}</h3>
      <p className="desc">{project.description}</p>
      <div className="tags">
        {(project.tags || []).map((t, i) => (
          <span className="tag" key={i}>{t}</span>
        ))}
      </div>
      <div style={{marginTop:'1rem',display:'flex',gap:'0.5rem'}}>
        <Link href={`/projects/${project.id}`} className="btn">Details</Link>
        {project.url && <a className="btn secondary" href={project.url} target="_blank" rel="noreferrer">Live</a>}
      </div>
    </article>
  );
}