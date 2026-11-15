// Small helper functions that turn numbers into text for the screen.

// 2500 -> "Rs 2,500"
export function formatPrice(amount) {
  return 'Rs ' + amount.toLocaleString('en-US');
}

// 1 -> "1 hour", 2.5 -> "2.5 hours"
export function formatDuration(hours) {
  if (hours === 1) {
    return '1 hour';
  }
  return `${hours} hours`;
}

// 1 -> "1 seat", 3 -> "3 seats"
export function formatSeats(count) {
  if (count === 1) {
    return '1 seat';
  }
  return `${count} seats`;
}
