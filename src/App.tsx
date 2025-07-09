import React, { useState, useEffect } from 'react';
import { KnotData, Knot, Category } from './types';
import { KnotTile } from './components/KnotTile';
import { KnotModal } from './components/KnotModal';
import AIChat from './components/AIChat';
import knotData from './data/knots.json';

/**
 * The main application component for the Knot Explorer.
 * Manages knot data, filtering, modal display, and hash-based routing.
 */
export const App: React.FC = () => {
  // State to hold all knot data loaded from knots.json
  const [data] = useState<KnotData>(knotData as KnotData);
  // State for knots currently displayed after filtering
  const [filteredKnots, setFilteredKnots] = useState<Knot[]>([]);
  // State for the currently selected knot to display in the modal
  const [selectedKnot, setSelectedKnot] = useState<Knot | null>(null);
  // State to control the visibility of the knot detail modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to manage filter criteria (category, difficulty, search term)
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  /**
   * useEffect hook to apply filters to the knot data.
   * Runs whenever the `data.knots` or `filters` state changes.
   */
  useEffect(() => {
    const filtered = data.knots.filter(knot => {
      // Check if the knot matches the selected category filter
      const matchesCategory = !filters.category || knot.categoryId === filters.category;
      // Check if the knot matches the selected difficulty filter
      const matchesDifficulty = !filters.difficulty || knot.difficulty === filters.difficulty;
      // Check if the knot matches the search term in name, description, or uses
      const matchesSearch = !filters.search || 
        knot.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        knot.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        knot.uses.some(use => use.toLowerCase().includes(filters.search.toLowerCase()));

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
    
    setFilteredKnots(filtered);
  }, [data.knots, filters]);

  /**
   * Handles the click event on a knot tile.
   * Sets the selected knot, opens the modal, and updates the URL hash.
   * @param {Knot} knot - The knot object that was clicked.
   */
  const handleKnotClick = (knot: Knot) => {
    setSelectedKnot(knot);
    setIsModalOpen(true);
    // Update URL hash to enable direct linking and refresh persistence
    window.location.hash = knot.id;
  };

  /**
   * Handles closing the knot detail modal.
   * Clears the selected knot, closes the modal, and removes the URL hash.
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedKnot(null);
    // Clear URL hash without adding a new entry to browser history
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  /**
   * useEffect hook to handle hash-based routing.
   * Checks the URL hash on component mount and listens for hash changes.
   * Opens the corresponding knot modal if a valid knot ID is found in the hash.
   */
  useEffect(() => {
    const handleHashChange = () => {
      // Extract knot ID from the URL hash (remove the leading '#')
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Find the knot corresponding to the ID in the hash
        const knotFromHash = data.knots.find(knot => knot.id === hash);
        if (knotFromHash) {
          // If found, set it as selected and open the modal
          setSelectedKnot(knotFromHash);
          setIsModalOpen(true);
        } else {
          // If hash exists but knot not found, close modal and clear hash
          setIsModalOpen(false);
          setSelectedKnot(null);
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      } else {
        // If no hash, ensure modal is closed
        setIsModalOpen(false);
        setSelectedKnot(null);
      }
    };

    // Perform initial check when the component mounts
    handleHashChange();

    // Add event listener for 'hashchange' to react to URL hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [data.knots]); // Dependency array: re-run effect if knot data changes

  // Determine the category of the selected knot for display in the modal
  const selectedCategory: Category | undefined = selectedKnot 
    ? data.categories.find(cat => cat.id === selectedKnot.categoryId)
    : undefined;

  return (
    <div className="container">
      <header>
        <h1>🪢 Knot Explorer</h1>
        <p>Discover different knots and their practical uses</p>
      </header>

      {/* AI Chat component for natural language knot suggestions */}
      <AIChat />

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
            aria-label="Search knots"
          />
        </div>
      </div>

      <div className="knots-grid">
        {/* Render KnotTile components for each filtered knot */}
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

      {/* Knot detail modal, displayed when a knot is selected */}
      <KnotModal
        knot={selectedKnot}
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};