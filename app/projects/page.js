'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminProjectsWrapper from "../components/AdminProjectsWrapper";
import AdminDeleteOverlay from "../components/AdminDeleteOverlay";
import EditProjectModal from "../components/EditProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // 3D Cube Card Component
  const CubeCard = ({ project }) => {
    const cubeRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
      if (e.target.closest('a, button')) return;
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      // Much lower sensitivity and clamped rotation
      const sensitivity = 0.2;
      const maxRotation = 45; // Limit rotation to 45 degrees
      
      let newRotationY = rotation.y + deltaX * sensitivity;
      let newRotationX = rotation.x - deltaY * sensitivity;
      
      // Clamp rotations to prevent spinning out of control
      newRotationX = Math.max(-maxRotation, Math.min(maxRotation, newRotationX));
      newRotationY = Math.max(-maxRotation, Math.min(maxRotation, newRotationY));
      
      setRotation({ x: newRotationX, y: newRotationY });
      setStartPos({ x: e.clientX, y: e.clientY }); // Update start position for smoother control
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Optionally reset rotation after a delay for better UX
      setTimeout(() => {
        setRotation({ x: 0, y: 0 });
      }, 2000);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, startPos, rotation]);

    return (
      <div 
        className="card-container"
        ref={cubeRef}
        onMouseDown={handleMouseDown}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDragging ? 'none' : 'transform 0.4s ease'
        }}
      >
        {/* Front face - main content */}
        <div className="card card-front">
          <AdminDeleteOverlay 
            projectId={project.id} 
            onEdit={() => handleEditProject(project)}
          />
          <div>
            {project.image && (
              <div style={{marginBottom:'0.5rem',display:'flex',justifyContent:'center'}}>
                <div style={{position:'relative',padding:'4px',background:'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(192,132,252,0.08))',borderRadius:'8px',border:'1px solid rgba(168,85,247,0.2)',boxShadow:'0 4px 16px rgba(168,85,247,0.15)',transition:'transform 200ms ease, box-shadow 200ms ease'}} className="project-logo">
                  <Image src={project.image} alt={`${project.title} logo`} width={40} height={40} style={{borderRadius:'6px',display:'block'}} />
                </div>
              </div>
            )}
            <h3 className="title" style={{fontSize: '0.95rem', margin: '0 0 0.4rem 0', textAlign: 'center'}}>{project.title}</h3>
            <p className="desc" style={{fontSize: '0.7rem', lineHeight: '1.2', margin: '0 0 0.5rem 0', textAlign: 'center'}}>
              {project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}
            </p>
          </div>
          
          <div>
            <div className="tags" style={{marginBottom: '0.5rem', justifyContent: 'center'}}>
              {(project.tags || []).slice(0, 2).map((t, i) => (
                <span className="tag" key={i} style={{fontSize: '0.65rem', padding: '0.15rem 0.3rem'}}>{t}</span>
              ))}
            </div>
            <div style={{display:'flex',gap:'0.4rem',justifyContent:'center'}}>
              <Link href={`/projects/${project.id}`} className="btn" style={{fontSize: '0.7rem', padding: '0.3rem 0.6rem'}}>Details</Link>
              {project.url && <a className="btn secondary" href={project.url} target="_blank" rel="noreferrer" style={{fontSize: '0.7rem', padding: '0.3rem 0.6rem'}}>Live</a>}
            </div>
          </div>
        </div>

        {/* Back face */}
        <div className="card card-back">
          <div style={{textAlign: 'center'}}>
            <h3 style={{marginBottom: '0.75rem', fontSize: '1rem'}}>Tech Stack</h3>
            <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap',justifyContent:'center', marginBottom: '0.75rem'}}>
              {(project.tags || []).map((t, i) => (
                <span className="tag" key={i} style={{fontSize: '0.65rem', padding: '0.2rem 0.4rem'}}>{t}</span>
              ))}
            </div>
            {project.url && (
              <div style={{marginTop: '1rem'}}>
                <a href={project.url} target="_blank" rel="noreferrer" className="btn" style={{fontSize: '0.7rem', padding: '0.4rem 0.8rem'}}>
                  View Live
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Side faces with decorative content */}
        <div className="card card-left">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', transform: 'rotateY(90deg)', fontSize: '2rem', opacity: 0.3}}>
            ⚡
          </div>
        </div>
        <div className="card card-right">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', transform: 'rotateY(-90deg)', fontSize: '2rem', opacity: 0.3}}>
            🚀
          </div>
        </div>
        <div className="card card-top">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', transform: 'rotateX(-90deg)', fontSize: '2rem', opacity: 0.3}}>
            💻
          </div>
        </div>
        <div className="card card-bottom">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', transform: 'rotateX(90deg)', fontSize: '2rem', opacity: 0.3}}>
            ✨
          </div>
        </div>
      </div>
    );
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', { 
        cache: 'no-store'
      });
      
      if (res.ok) {
        const dbProjects = await res.json();
        setProjects(dbProjects);
      } else {
        console.error('Failed to fetch projects from database');
        setProjects([]);
      }
    } catch (err) {
      console.error('Database fetch failed:', err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleProjectUpdated = () => {
    // Refresh projects after edit
    fetchProjects();
  };

  return (
    <AdminProjectsWrapper>
      <section>
        <h1 style={{margin:0,color:'var(--color-text-light)'}}>Projects</h1>
        <p style={{marginTop:'0.5rem',color:'var(--color-text)'}}>Selected projects & case studies — click to view details.</p>

        <div className="projects-grid">
          {projects.map((p) => (
            <CubeCard key={p.id} project={p} />
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link href="/">← Back to Home</Link>
        </div>
      </section>

      <EditProjectModal
        isOpen={showEditModal}
        project={editingProject}
        onClose={() => {
          setShowEditModal(false);
          setEditingProject(null);
        }}
        onProjectUpdated={handleProjectUpdated}
      />
    </AdminProjectsWrapper>
  );
}
