// Mock data loader.
// A real website would ask a server for this data and wait for the answer.
// We have no server, so we copy that behaviour: the function returns a
// Promise that finishes after a short delay. It can also fail on purpose,
// so we can build and test the loading, error and retry screens.

import { experiences } from '../data/experiences.js';

const LOADING_DELAY_MS = 900;

// Used by the "Simulate changed availability" demo control.
// These seat numbers replace the normal ones, as if other customers had
// booked seats since the last visit.
const REDUCED_SEATS = {
  'trail-5-sunrise': 1,
  'khanpur-kayaking': 0,
};

export function loadExperiences(options) {
  const { shouldFail, returnEmptyList, useReducedSeats } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('We could not load the experiences. Please try again.'));
        return;
      }

      if (returnEmptyList) {
        resolve([]);
        return;
      }

      if (useReducedSeats) {
        // map() builds a new array. Records that are in REDUCED_SEATS are
        // copied with a new seatsLeft value. The original data is not changed.
        const changedRecords = experiences.map((experience) => {
          const reducedSeats = REDUCED_SEATS[experience.id];
          if (reducedSeats === undefined) {
            return experience;
          }
          return { ...experience, seatsLeft: reducedSeats };
        });
        resolve(changedRecords);
        return;
      }

      resolve(experiences);
    }, LOADING_DELAY_MS);
  });
}
