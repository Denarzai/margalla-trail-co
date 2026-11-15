// Helpers for the browser's localStorage.
// localStorage can only keep text, so we turn our data into JSON text when
// saving and back into JavaScript values when reading.

export const PLAN_STORAGE_KEY = 'margalla-trail-plan';

// Reads a value. Returns fallbackValue when nothing is saved or when the
// saved text is damaged and cannot be understood.
export function readStorage(key, fallbackValue) {
  try {
    const savedText = localStorage.getItem(key);
    if (savedText === null) {
      return fallbackValue;
    }
    return JSON.parse(savedText);
  } catch (error) {
    return fallbackValue;
  }
}

// Saves a value. If the browser blocks storage (for example in private
// mode) the website keeps working, it just does not remember the plan.
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Nothing to do: saving is a convenience, not a requirement.
  }
}

// Reads the saved plan and removes anything that does not look like a
// real plan item. This protects the app from old or hand-edited data.
export function loadSavedPlan() {
  const savedPlan = readStorage(PLAN_STORAGE_KEY, []);

  if (!Array.isArray(savedPlan)) {
    return [];
  }

  return savedPlan.filter((item) => {
    return (
      item !== null &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      Number.isInteger(item.seats) &&
      item.seats >= 1
    );
  });
}
