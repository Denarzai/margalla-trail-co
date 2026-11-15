// Automated tests for the operating rules.
// Run with:  node --test      (or: npm test)
//
// These tests import the SAME functions that the React application uses,
// so a passing test tells us the real rule works.

import test from 'node:test';
import assert from 'node:assert/strict';

import { checkSeatLimit, MAX_SEATS_PER_BOOKING } from './seatLimit.js';
import { checkAgeRule } from './ageRule.js';
import { calculateBookingFee, BOOKING_FEE, FREE_FEE_SUBTOTAL } from './bookingFee.js';

// ---------------------------------------------------------------
// Rule 1 - seat limit (the main tested rule)
// ---------------------------------------------------------------

test('seat limit: an ordinary valid request is allowed', () => {
  // 2 seats requested, 8 seats left
  const result = checkSeatLimit(2, 8);

  assert.equal(result.ok, true);
  assert.equal(result.message, '');
  assert.equal(result.maxAllowed, 6);
});

test('seat limit: exactly 6 seats (the booking limit) is allowed', () => {
  const result = checkSeatLimit(MAX_SEATS_PER_BOOKING, 8);

  assert.equal(result.ok, true);
  assert.equal(result.maxAllowed, 6);
});

test('seat limit: 7 seats breaks the booking limit', () => {
  const result = checkSeatLimit(7, 8);

  assert.equal(result.ok, false);
  assert.equal(result.message, 'One booking can include at most 6 seats per experience.');
});

test('seat limit: exactly the seats left is allowed', () => {
  // 2 seats requested, 2 seats left
  const result = checkSeatLimit(2, 2);

  assert.equal(result.ok, true);
  assert.equal(result.maxAllowed, 2);
});

test('seat limit: one more than the seats left is refused', () => {
  const result = checkSeatLimit(3, 2);

  assert.equal(result.ok, false);
  assert.equal(result.maxAllowed, 2);
  assert.equal(result.message, 'Only 2 seats are left for this experience.');
});

test('seat limit: a sold-out experience refuses every request', () => {
  const result = checkSeatLimit(1, 0);

  assert.deepEqual(result, { ok: false, maxAllowed: 0, message: 'This experience is sold out.' });
});

test('seat limit: zero seats is refused', () => {
  const result = checkSeatLimit(0, 8);

  assert.equal(result.ok, false);
  assert.equal(result.message, 'Choose at least 1 seat.');
});

// ---------------------------------------------------------------
// Rule 2 - minimum age
// ---------------------------------------------------------------

test('age rule: older than the minimum age is allowed', () => {
  assert.equal(checkAgeRule(20, 14).ok, true);
});

test('age rule: exactly the minimum age is allowed', () => {
  assert.equal(checkAgeRule(14, 14).ok, true);
});

test('age rule: one year below the minimum age is refused', () => {
  const result = checkAgeRule(13, 14);

  assert.equal(result.ok, false);
  assert.equal(
    result.message,
    'Everyone must be at least 14 years old. Your youngest participant is 13.'
  );
});

// ---------------------------------------------------------------
// Rule 3 - booking fee
// ---------------------------------------------------------------

test('booking fee: a small booking pays the fee', () => {
  const result = calculateBookingFee(2500);

  assert.equal(result.fee, BOOKING_FEE);
  assert.equal(result.amountNeededForFreeFee, 2500);
});

test('booking fee: exactly Rs 5,000 pays no fee', () => {
  assert.deepEqual(calculateBookingFee(FREE_FEE_SUBTOTAL), { fee: 0, amountNeededForFreeFee: 0 });
});

test('booking fee: Rs 4,999 still pays the fee', () => {
  assert.deepEqual(calculateBookingFee(4999), { fee: 300, amountNeededForFreeFee: 1 });
});

test('booking fee: an empty plan has no fee', () => {
  assert.equal(calculateBookingFee(0).fee, 0);
});
