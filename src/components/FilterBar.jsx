import { CATEGORIES } from '../data/experiences.js';
import { SORT_OPTIONS } from '../utils/filterExperiences.js';

// Search box, category buttons, availability checkbox and sort menu.
// This component does not own the filter values. It receives them as a
// prop and reports every change to its parent with the onChange callback.
// Props:
//   filters  - object: { searchText, category, onlyAvailable, sortBy }
//   onChange - callback: onChange(newFiltersObject)
function FilterBar({ filters, onChange }) {
  function handleSearchChange(event) {
    // Copy the old filters and replace only searchText.
    onChange({ ...filters, searchText: event.target.value });
  }

  function handleCategoryClick(category) {
    onChange({ ...filters, category: category });
  }

  function handleAvailableChange(event) {
    onChange({ ...filters, onlyAvailable: event.target.checked });
  }

  function handleSortChange(event) {
    onChange({ ...filters, sortBy: event.target.value });
  }

  return (
    <section className="filter-bar" aria-label="Search, filter and sort experiences">
      <div className="filter-row">
        <div className="field field-search">
          <label htmlFor="search-text">Search experiences</label>
          <input
            id="search-text"
            type="search"
            placeholder="Try “hike”, “Khanpur” or “fort”"
            value={filters.searchText}
            onChange={handleSearchChange}
          />
        </div>

        <div className="field field-sort">
          <label htmlFor="sort-by">Sort by</label>
          <select id="sort-by" value={filters.sortBy} onChange={handleSortChange}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-row filter-row-wrap">
        <div className="chip-group" role="group" aria-label="Filter by category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={filters.category === category ? 'chip chip-selected' : 'chip'}
              aria-pressed={filters.category === category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="check-row">
          <input type="checkbox" checked={filters.onlyAvailable} onChange={handleAvailableChange} />
          Hide sold-out experiences
        </label>
      </div>
    </section>
  );
}

export default FilterBar;
