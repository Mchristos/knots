import React from 'react';
import { Knot, KnotCategory } from '../types';

interface KnotModalProps {
  knot: Knot | null;
  category: KnotCategory | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export const KnotModal: React.FC<KnotModalProps> = ({ knot, category, isOpen, onClose }) => {
  if (!isOpen || !knot) return null;

  return (
    <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <div id="modal-body">
          <div className="modal-header">
            <h2>{knot.name}</h2>
            <div className="modal-knot-image">
              <img 
                src={knot.mainImage} 
                alt={knot.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'block';
                }}
              />
              <span style={{ display: 'none', fontSize: '3rem' }}>🪢</span>
            </div>
            <div className="modal-info">
              <div className="modal-meta">
                <span className={`difficulty difficulty-${knot.difficulty.toLowerCase()}`}>
                  {knot.difficulty}
                </span>
                <span className="category">{category?.name || 'Unknown'}</span>
                <span className="strength">Strength: {knot.strength}/10</span>
              </div>
              <p><strong>Description:</strong> {knot.description}</p>
            </div>
          </div>

          <div className="instructions-section">
            <h3>How to Tie:</h3>
            <div className="instruction-steps">
              {knot.instructions.map((step, index) => (
                <div key={index} className="instruction-step">
                  <div className="step-number">{step.stepNumber}</div>
                  <div className="step-content">
                    {step.image && (
                      <div className="step-image">
                        <img 
                          src={step.image} 
                          alt={`Step ${step.stepNumber}`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <p className="step-instruction">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {knot.tips && knot.tips.length > 0 && (
            <div className="tips-section">
              <h3>Pro Tips:</h3>
              <ul>
                {knot.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="uses-section">
            <h3>Common Uses:</h3>
            <ul>
              {knot.uses.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>

          <div className="category-description">
            <h3>About {category?.name}:</h3>
            <p>{category?.description || 'No description available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};