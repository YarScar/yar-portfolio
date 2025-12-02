"use client";
import { useState } from "react";

export default function SecretModal({ isOpen, onClose, onVerified }) {
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);

  const correctAnswer = "abundalakaka"; // Change this to your secret answer
  const question = "What is your secret key?";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.toLowerCase().trim() === correctAnswer) {
      onVerified();
      onClose();
      setAnswer("");
      setIsWrong(false);
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 2000);
    }
  };

  const handleClose = () => {
    setAnswer("");
    setIsWrong(false);
    onClose();
  };

  if (!isOpen) return null;

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
      zIndex: 100000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(192,132,252,0.1))',
        border: '2px solid rgba(168,85,247,0.3)',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 80px rgba(168,85,247,0.4)',
        position: 'relative'
      }}>
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text)',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{
          color: 'var(--color-text-light)',
          marginBottom: '1rem',
          fontSize: '1.8rem'
        }}>
          Secret Access
        </h2>
        
        <p style={{
          color: 'var(--color-text)',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          {question}
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            autoFocus
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: `2px solid ${isWrong ? '#ff6b6b' : 'rgba(168,85,247,0.3)'}`,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--color-text)',
              fontSize: '1.1rem',
              marginBottom: '1.5rem',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
          />
          
          {isWrong && (
            <p style={{
              color: '#ff6b6b',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              ❌ Incorrect answer. Try again!
            </p>
          )}
          
          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}
          >
            Verify Access
          </button>
        </form>
      </div>
    </div>
  );
}