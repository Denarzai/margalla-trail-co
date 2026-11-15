// OPERATING RULE 1 - Availability / capacity
//
// A booking can hold between 1 and 6 seats for one experience, and never
// more seats than the experience has left.
//
// This file contains no React code. The function only receives numbers and
// returns a result object, so it can be tested with "node --test" and used
// by the website at the same time.

export const MAX_SEATS_PER_BOOKING = 6;

// requestedSeats - how many seats the customer wants
// seatsLeft      - how many seats the experience still has
// Returns an object:
//   ok         - true when the request is allowed
//   maxAllowed - the largest number of seats this customer may choose
//   message    - explanation for the customer when ok is false
export function checkSeatLimit(requestedSeats, seatsLeft) {
  // The smaller of the two limits is the real limit.
  const maxAllowed = Math.max(0, Math.min(seatsLeft, MAX_SEATS_PER_BOOKING));

  if (seatsLeft <= 0) {
    return { ok: false, maxAllowed: 0, message: 'This experience is sold out.' };
  }

  if (!Number.isInteger(requestedSeats) || requestedSeats < 1) {
    return { ok: false, maxAllowed, message: 'Choose at least 1 seat.' };
  }

  if (requestedSeats > seatsLeft) {
    const seatWord = seatsLeft === 1 ? 'seat is' : 'seats are';
    return {
      ok: false,
      maxAllowed,
      message: `Only ${seatsLeft} ${seatWord} left for this experience.`,
    };
  }

  if (requestedSeats > MAX_SEATS_PER_BOOKING) {
    return {
      ok: false,
      maxAllowed,
      message: `One booking can include at most ${MAX_SEATS_PER_BOOKING} seats per experience.`,
    };
  }

  return { ok: true, maxAllowed, message: '' };
}
