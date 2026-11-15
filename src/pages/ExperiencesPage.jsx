import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  DEFAULT_FILTERS,
  getVisibleExperiences,
  hasActiveFilters,
} from '../utils/filterExperiences.js';

// Listing page: browse, search, filter and sort all experiences.
// Props:
//   experiences     - all loaded records
//   filters         - current search / filter / sort choices (kept in App)
//   onFiltersChange - callback: onFiltersChange(newFilters)
function ExperiencesPage({ experiences, filters, onFiltersChange }) {
  useEffect(() => {
    document.title = 'Experiences | Margalla Trail Co.';
  }, []);

  // Derived value: calculated again on every render from the current data
  // and the current filters. It is not stored in state.
  const visibleExperiences = getVisibleExperiences(experiences, filters);

  function handleClearFilters() {
    // Keep the sort choice, reset everything else.
    onFiltersChange({ ...DEFAULT_FILTERS, sortBy: filters.sortBy });
  }

  function handleShowCategory(category) {
    onFiltersChange({ ...DEFAULT_FILTERS, sortBy: filters.sortBy, category: category });
  }

  // Empty state 1: the business has no experiences at all.
  if (experiences.length === 0) {
    return (
      <div className="container section">
        <h1>Experiences</h1>
        <EmptyState
          title="No experiences are scheduled right now"
          message="Our guides are planning the next season. Nothing is wrong with your search. Please check again in a few days or visit our office in G-9 Markaz."
        >
          <Link to="/" className="button button-secondary">
            Go to the home page
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Experiences</h1>
      <p className="page-lead">
        Every card shows the price per seat, duration, difficulty, minimum age and seats left.
      </p>

      <FilterBar filters={filters} onChange={onFiltersChange} />

      {/* aria-live makes screen readers announce the new count after a search */}
      <p className="result-count" aria-live="polite">
        Showing {visibleExperiences.length} of {experiences.length} experiences
        {hasActiveFilters(filters) && (
          <>
            {' '}
            <button type="button" className="link-button" onClick={handleClearFilters}>
              Clear search and filters
            </button>
          </>
        )}
      </p>

      {/* Empty state 2: there is data, but nothing matches the search/filters. */}
      {visibleExperiences.length === 0 ? (
        <EmptyState
          title="No experiences match your search"
          message={
            filters.searchText.trim() !== ''
              ? `We could not find anything for “${filters.searchText.trim()}” with the current filters. Check the spelling, or try one of these options.`
              : 'No experience fits the current filters. Try one of these options.'
          }
        >
          <button type="button" className="button button-primary" onClick={handleClearFilters}>
            Clear search and filters
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => handleShowCategory('Hiking')}
          >
            Show all hikes
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => handleShowCategory('Water')}
          >
            Show water activities
          </button>
        </EmptyState>
      ) : (
        <div className="card-grid">
          {visibleExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExperiencesPage;
