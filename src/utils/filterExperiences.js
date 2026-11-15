// Search + filter + sort for the Experiences page.
// The function receives the full list and the current filter choices and
// returns a NEW array. It never changes the original list.

export const DEFAULT_FILTERS = {
  searchText: '',
  category: 'All',
  onlyAvailable: false,
  sortBy: 'recommended',
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'duration-short', label: 'Duration: shortest first' },
  { value: 'seats-most', label: 'Most seats left' },
];

export function getVisibleExperiences(experiences, filters) {
  const searchText = filters.searchText.trim().toLowerCase();

  // Step 1: filter() keeps only the records that pass all three checks.
  const matchingExperiences = experiences.filter((experience) => {
    // We search in the name, location, category and summary together.
    const searchableText =
      `${experience.name} ${experience.location} ${experience.category} ${experience.summary}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchText);
    const matchesCategory = filters.category === 'All' || experience.category === filters.category;
    const matchesAvailability = !filters.onlyAvailable || experience.seatsLeft > 0;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Step 2: sort. sort() changes the array it is called on, so we sort a
  // copy made with the spread syntax.
  const sortedExperiences = [...matchingExperiences];

  if (filters.sortBy === 'price-low') {
    sortedExperiences.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
  } else if (filters.sortBy === 'price-high') {
    sortedExperiences.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
  } else if (filters.sortBy === 'duration-short') {
    sortedExperiences.sort((a, b) => a.durationHours - b.durationHours);
  } else if (filters.sortBy === 'seats-most') {
    sortedExperiences.sort((a, b) => b.seatsLeft - a.seatsLeft);
  }
  // "recommended" keeps the order of the data file.

  return sortedExperiences;
}

// True when the customer has changed at least one filter control.
export function hasActiveFilters(filters) {
  return filters.searchText.trim() !== '' || filters.category !== 'All' || filters.onlyAvailable;
}
