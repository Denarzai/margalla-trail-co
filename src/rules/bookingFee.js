// OPERATING RULE 3 - Pricing
//
// A booking fee of Rs 300 is added to every booking with a subtotal
// under Rs 5,000. When the subtotal is Rs 5,000 or more the fee is Rs 0.

export const BOOKING_FEE = 300;
export const FREE_FEE_SUBTOTAL = 5000;

// subtotal - price of all selected seats, before the fee
// Returns an object:
//   fee                    - the booking fee for this subtotal
//   amountNeededForFreeFee - how many more rupees remove the fee (0 if none)
export function calculateBookingFee(subtotal) {
  // An empty plan has nothing to charge.
  if (subtotal <= 0) {
    return { fee: 0, amountNeededForFreeFee: 0 };
  }

  if (subtotal >= FREE_FEE_SUBTOTAL) {
    return { fee: 0, amountNeededForFreeFee: 0 };
  }

  return { fee: BOOKING_FEE, amountNeededForFreeFee: FREE_FEE_SUBTOTAL - subtotal };
}
