"use client";
import { useState, useEffect } from "react";

export default function EditProjectModal({ isOpen, onClose, project, onProjectUpdated }) {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    url: "",
    image: "",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setProjectData({
        title: project.title || "",
        description: project.description || "",
        url: project.url || "",
        image: project.image || "",
        tags: Array.isArray(project.tags) ? project.tags.join(", ") : ""
      });
    }
  }, [project]);

  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      throw new Error('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = projectData.image;

      // Upload image if a file was selected
      if (selectedFile) {
        imageUrl = await uploadImage();
      }

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectData.title,
          description: projectData.description,
          url: projectData.url || null,
          image: imageUrl || null,
          tags: projectData.tags ? projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }

      const updatedProject = await response.json();
      
      // Reset form
      setSelectedFile(null);
      
      // Notify parent component
      onProjectUpdated(updatedProject);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError("");
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 10, 31, 0.95)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      backdropFilter: 'blur(12px)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(192,132,252,0.15))',
        border: '3px solid rgba(168,85,247,0.4)',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 30px 100px rgba(168,85,247,0.5)',
        position: 'relative'
      }}>
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'linear-gradient(135deg, #A855F7, #C084FC)',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✏️</div>
          <h1 style={{
            background: 'linear-gradient(135deg, #FAF5FF, #E9D5FF, #D8B4FE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.2rem',
            marginBottom: '0.5rem'
          }}>
            Edit Project
          </h1>
          <p style={{
            color: 'var(--color-text)',
            fontSize: '1rem',
            opacity: 0.8
          }}>
            Update the details for "{project.title}"
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#fca5a5',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{
              color: 'var(--color-text-light)',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Project Title *
            </label>
            <input
              type="text"
              value={projectData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="e.g. AI Chat Application"
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: '2px solid rgba(168,85,247,0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--color-text)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{
              color: 'var(--color-text-light)',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Description *
            </label>
            <textarea
              value={projectData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              placeholder="Brief description of what this project does..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: '2px solid rgba(168,85,247,0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--color-text)',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{
              color: 'var(--color-text-light)',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Technologies/Tags
            </label>
            <input
              type="text"
              value={projectData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="React, Next.js, OpenAI API (comma-separated)"
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: '2px solid rgba(168,85,247,0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--color-text)',
                fontSize: '1rem'
              }}
            />
            <small style={{
              color: 'var(--color-text)',
              fontSize: '0.8rem',
              opacity: 0.7,
              marginTop: '0.5rem',
              display: 'block'
            }}>
              💡 Enter technologies/frameworks separated by commas
            </small>
          </div>

          <div>
            <label style={{
              color: 'var(--color-text-light)',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Project URL
            </label>
            <input
              type="url"
              value={projectData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://myproject.com"
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: '2px solid rgba(168,85,247,0.3)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--color-text)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{
              color: 'var(--color-text-light)',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Project Image
            </label>
            
            {projectData.image && !selectedFile && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                background: 'rgba(168,85,247,0.1)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: 'var(--color-text)'
              }}>
                Current: {projectData.image}
              </div>
            )}
            
            {/* File Upload Option */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                color: 'var(--color-text)',
                fontSize: '0.8rem',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Upload new image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(168,85,247,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              />
              {selectedFile && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: 'rgba(168,85,247,0.1)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--color-text)'
                }}>
                  New: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                </div>
              )}
            </div>

            {/* Or URL Option */}
            <div>
              <label style={{
                color: 'var(--color-text)',
                fontSize: '0.8rem',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Or update image URL:
              </label>
              <input
                type="url"
                value={projectData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/project-image.png"
                disabled={!!selectedFile}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(168,85,247,0.3)',
                  background: selectedFile ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  opacity: selectedFile ? 0.5 : 1
                }}
              />
            </div>
            
            <small style={{
              color: 'var(--color-text)',
              fontSize: '0.8rem',
              opacity: 0.7,
              marginTop: '0.5rem',
              display: 'block'
            }}>
              💡 Upload a file or update the URL (file upload takes priority)
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="btn"
              style={{
                flex: 1,
                fontSize: '1rem',
                padding: '1rem',
                opacity: (isSubmitting || uploadingImage) ? 0.7 : 1,
                cursor: (isSubmitting || uploadingImage) ? 'not-allowed' : 'pointer'
              }}
            >
              {uploadingImage ? 'Uploading Image...' : isSubmitting ? 'Updating...' : 'Update Project'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn secondary"
              style={{
                flex: '0 0 auto',
                fontSize: '1rem',
                padding: '1rem'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}