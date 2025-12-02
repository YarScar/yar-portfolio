"use client";
import { useAdmin } from '../layout';
import { useState, useEffect } from 'react';
import AddProjectModal from './AddProjectModal';
import ProjectCard from './ProjectCard';

const sampleProjects = [
  { id: 1, title: 'Najah', description: 'A React-based study app that brings together task management, a customizable Pomodoro timer, AI homework help, and lofi music in a smooth, productivity-focused workspace.', tags: ['Vite','React', 'Gemini API'], url: 'https://404sleepnotfound.vercel.app/', image: '/images/najah-logo.png' },
  { id: 2, title: 'Immigo', description: 'An immigration support platform connecting immigrants with resources, legal assistance, and community support services.', tags: ['Next.js','React','Prisma'], url: 'https://immigo-pi.vercel.app/', image: '/images/immigo-logo.png' },
  { id: 3, title: 'Agentic Data Quality Analysis Platform', description: 'AI-powered data quality analysis platform that helps business users understand and improve dataset quality with intelligent insights.', tags: ['Next.js','React','OpenAI API','Chart.js'], url: 'https://data-analysis-tutorial-three.vercel.app/', image: '/images/data-analysis-logo.png' }
];

export default function AdminProjectsWrapper({ children, initialProjects = [] }) {
  const { isAdminMode } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState(initialProjects.length > 0 ? initialProjects : sampleProjects);
  const [deletingProjects, setDeletingProjects] = useState(new Set());

  // Only manage projects state when in admin mode
  useEffect(() => {
    if (isAdminMode && initialProjects.length === 0) {
      // Fetch fresh data when admin mode is activated
      fetchProjects();
    }
  }, [isAdminMode]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        setProjects(sampleProjects);
      }
    } catch (err) {
      setProjects(sampleProjects);
    }
  };

  const handleProjectAdded = (newProject) => {
    // Add the new project to the beginning of the list
    setProjects(prev => [newProject, ...prev]);
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeletingProjects(prev => new Set(prev).add(projectId));

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        const errorData = await response.json();
        alert('Failed to delete project: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    } finally {
      setDeletingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  return (
    <>
      {isAdminMode && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '2rem' 
        }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              fontSize: '1rem',
              padding: '0.8rem 1.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            ➕ Add Project
          </button>
        </div>
      )}
      
      {isAdminMode ? (
        // In admin mode, show dynamic project list with admin controls
        <section>
          <h1 style={{margin:0,color:'var(--color-text-light)'}}>Projects</h1>
          <p style={{marginTop:'0.5rem',color:'var(--color-text)'}}>Selected projects & case studies — click to view details.</p>

          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                isAdminMode={isAdminMode}
                isDeleting={deletingProjects.has(p.id)}
                onDelete={() => handleDeleteProject(p.id)}
              />
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <a href="/">← Back to Home</a>
          </div>
        </section>
      ) : (
        // In normal mode, show the server-rendered children
        children
      )}

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProjectAdded={handleProjectAdded}
      />
    </>
  );
}