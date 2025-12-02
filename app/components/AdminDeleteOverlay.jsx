"use client";
import { useAdmin } from '../layout';
import { useState } from 'react';

export default function AdminDeleteOverlay({ projectId, onEdit }) {
  const { isAdminMode } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Reload the page to reflect changes from the database
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert('Failed to delete project: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdminMode) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      display: 'flex',
      gap: '0.5rem',
      zIndex: 10
    }}>
      <button
        onClick={() => onEdit && onEdit()}
        style={{
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          border: 'none',
          color: 'white',
          fontSize: '1rem',
          cursor: 'pointer',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Edit project"
      >
        ✏️
      </button>
      <button
        onClick={handleDeleteProject}
        disabled={isDeleting}
        style={{
          background: isDeleting 
            ? 'linear-gradient(135deg, #6B7280, #9CA3AF)' 
            : 'linear-gradient(135deg, #EF4444, #DC2626)',
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
          opacity: isDeleting ? 0.7 : 1
        }}
        title={isDeleting ? "Deleting..." : "Delete project"}
      >
        {isDeleting ? '⏳' : '🗑️'}
      </button>
    </div>
  );
}