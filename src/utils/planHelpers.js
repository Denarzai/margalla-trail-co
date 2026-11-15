// Functions that turn the plan (ids and seat counts) into the information
// the pages show: names, prices, problems and totals.
// Everything here is DERIVED: it is calculated from the current plan and
// the current data, and never stored in state.

import { checkSeatLimit } from '../rules/seatLimit.js';
import { calculateBookingFee } from '../rules/bookingFee.js';

// Returns how many seats of one experience are in the plan (0 if none).
// planItems - array like [{ id: 'trail-5-sunrise', seats: 2 }]
export function getSeatsInPlan(planItems, experienceId) {
  const planItem = planItems.find((item) => item.id === experienceId);
  return planItem ? planItem.seats : 0;
}

// planItems   - array like [{ id: 'trail-5-sunrise', seats: 2 }]
// experiences - all loaded records
// Returns one "plan line" per plan item. A line joins the plan item with
// its experience record and checks it against the seat rule.
export function buildPlanLines(planItems, experiences) {
  return planItems.map((item) => {
    const experience = experiences.find((record) => record.id === item.id);

    // The saved plan may contain an experience that no longer exists.
    if (!experience) {
      return {
        id: item.id,
        seats: item.seats,
        experience: null,
        lineTotal: 0,
        maxAllowed: 0,
        problem: 'This experience is no longer offered. Please remove it from your plan.',
      };
    }

    // Seats may have been booked by other people since the plan was saved.
    const seatCheck = checkSeatLimit(item.seats, experience.seatsLeft);

    return {
      id: item.id,
      seats: item.seats,
      experience: experience,
      lineTotal: experience.pricePerSeat * item.seats,
      maxAllowed: seatCheck.maxAllowed,
      problem: seatCheck.ok ? '' : seatCheck.message,
    };
  });
}

// Adds up the plan lines. reduce() walks through the array and keeps a
// running sum.
export function calculateTotals(planLines) {
  const totalSeats = planLines.reduce((sum, line) => sum + line.seats, 0);
  const subtotal = planLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const { fee, amountNeededForFreeFee } = calculateBookingFee(subtotal);

  return {
    totalSeats,
    subtotal,
    fee,
    amountNeededForFreeFee,
    total: subtotal + fee,
  };
}

// The strictest minimum age in the plan. The whole group must be at least
// this old to book everything in the plan.
export function getHighestMinAge(planLines) {
  return planLines.reduce((highest, line) => {
    if (line.experience && line.experience.minAge > highest) {
      return line.experience.minAge;
    }
    return highest;
  }, 0);
}
