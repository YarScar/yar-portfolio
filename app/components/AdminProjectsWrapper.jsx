"use client";
import { useAdmin } from '../layout';
import { useState } from 'react';
import AddProjectModal from './AddProjectModal';

export default function AdminProjectsWrapper({ children, initialProjects = [] }) {
  const { isAdminMode } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleProjectAdded = () => {
    // Force a page refresh to show the new project from database
    window.location.reload();
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
      
      {children}

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProjectAdded={handleProjectAdded}
      />
    </>
  );
}