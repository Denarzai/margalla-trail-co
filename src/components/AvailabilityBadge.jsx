import { formatSeats } from '../utils/format.js';

// When this many seats (or fewer) remain we warn the customer.
const LOW_SEATS_LIMIT = 3;

// A small label that tells the customer how many seats remain.
// The status is always written in words, so it does not depend on colour.
// Props:
//   seatsLeft - number of seats that can still be booked
function AvailabilityBadge({ seatsLeft }) {
  if (seatsLeft <= 0) {
    return <span className="badge badge-unavailable">Sold out</span>;
  }

  if (seatsLeft <= LOW_SEATS_LIMIT) {
    return <span className="badge badge-warning">Only {formatSeats(seatsLeft)} left</span>;
  }

  return <span className="badge badge-available">{formatSeats(seatsLeft)} left</span>;
}

export default AvailabilityBadge;
