// OPERATING RULE 2 - Eligibility
//
// Every experience has a minimum age. The youngest person in the group
// must be at least that old, otherwise the group cannot book it.

// youngestAge - age of the youngest participant (a number)
// minAge      - minimum age of the experience
// Returns an object:
//   ok      - true when the group is old enough
//   message - explanation for the customer when ok is false
export function checkAgeRule(youngestAge, minAge) {
  if (youngestAge >= minAge) {
    return { ok: true, message: '' };
  }

  return {
    ok: false,
    message: `Everyone must be at least ${minAge} years old. Your youngest participant is ${youngestAge}.`,
  };
}
