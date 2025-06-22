import React, { useState, useEffect } from 'react';
import { KnotData, Knot } from './types';
import { KnotTile } from './components/KnotTile';
import { KnotModal } from './components/KnotModal';
import knotData from './data/knots.json';

export const App: React.FC = () => {
  const [data] = useState<KnotData>(knotData as KnotData);
  const [filteredKnots, setFilteredKnots] = useState<Knot[]>([]);
  const [selectedKnot, setSelectedKnot] = useState<Knot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    const filtered = data.knots.filter(knot => {
      const matchesCategory = !filters.category || knot.categoryId === filters.category;
      const matchesDifficulty = !filters.difficulty || knot.difficulty === filters.difficulty;
      const matchesSearch = !filters.search || 
        knot.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        knot.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        knot.uses.some(use => use.toLowerCase().includes(filters.search.toLowerCase()));

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
    
    setFilteredKnots(filtered);
  }, [data.knots, filters]);

  const handleKnotClick = (knot: Knot) => {
    setSelectedKnot(knot);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedKnot(null);
  };

  const selectedCategory = selectedKnot 
    ? data.categories.find(cat => cat.id === selectedKnot.categoryId)
    : undefined;

  return (
    <div className="container">
      <header>
        <h1>🪢 Knot Explorer</h1>
        <p>Discover different knots and their practical uses</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select 
            id="category-filter"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            {data.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="difficulty-filter">Difficulty:</label>
          <select 
            id="difficulty-filter"
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        
        <div className="filter-group">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search knots..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      <div className="knots-grid">
        {filteredKnots.map(knot => {
          const category = data.categories.find(cat => cat.id === knot.categoryId);
          return (
            <KnotTile
              key={knot.id}
              knot={knot}
              category={category}
              onClick={() => handleKnotClick(knot)}
            />
          );
        })}
      </div>

      <KnotModal
        knot={selectedKnot}
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};