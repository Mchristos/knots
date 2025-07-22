import React from 'react';
import { Knot, KnotCategory } from '../types';

interface KnotTileProps {
  knot: Knot;
  category: KnotCategory | undefined;
  onClick: () => void;
}

export const KnotTile: React.FC<KnotTileProps> = ({ knot, category, onClick }) => {
  return (
    <div className="knot-tile" onClick={onClick}>
      <div className="knot-graphic">
        <img 
          src={knot.mainImage} 
          alt={knot.name}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.currentTarget.style.display = 'none';
            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
            if (nextElement) nextElement.style.display = 'block';
          }}
        />
        <span style={{ display: 'none', fontSize: '2rem' }}>🪢</span>
      </div>
      <div className="knot-header">
        <h3>{knot.name}</h3>
        <span className={`difficulty difficulty-${knot.difficulty.toLowerCase()}`}>
          {knot.difficulty}
        </span>
      </div>
      <div className="knot-category">{category?.name || 'Unknown'}</div>
      <div className="knot-strength">
        <span>Strength: </span>
        <div className="strength-bar">
          <div 
            className="strength-fill" 
            style={{ width: `${knot.strength * 10}%` }}
          />
        </div>
        <span>{knot.strength}/10</span>
      </div>
      <div className="knot-uses">
        <strong>Uses:</strong> {knot.uses.slice(0, 2).join(', ')}
        {knot.uses.length > 2 ? '...' : ''}
      </div>
    </div>
  );
};