import { useState } from 'react';
import { checkSeatLimit, MAX_SEATS_PER_BOOKING } from '../rules/seatLimit.js';
import { formatSeats } from '../utils/format.js';

// A minus button, the current number of seats and a plus button.
// The stepper does not own the number. It receives it as a prop and asks
// its parent to change it through the onChange callback.
// Props:
//   seats     - current number of seats
//   seatsLeft - seats the experience still has (for the seat rule)
//   onChange  - callback: onChange(newSeats)
//   itemName  - experience name, used in the button labels for screen readers
function SeatStepper({ seats, seatsLeft, onChange, itemName }) {
  // Message shown when the customer tries to go past the limit.
  const [limitMessage, setLimitMessage] = useState('');

  // Rule 1 tells us the highest number this customer may choose.
  const { maxAllowed } = checkSeatLimit(seats, seatsLeft);

  function handleDecrease() {
    setLimitMessage('');
    onChange(seats - 1);
  }

  function handleIncrease() {
    // Ask the rule before changing anything.
    const result = checkSeatLimit(seats + 1, seatsLeft);

    if (result.ok) {
      setLimitMessage('');
      onChange(seats + 1);
    } else {
      setLimitMessage(result.message);
    }
  }

  return (
    <div className="stepper-block">
      <div className="stepper">
        <button
          type="button"
          className="stepper-button"
          onClick={handleDecrease}
          disabled={seats <= 1}
          aria-label={`Remove one seat for ${itemName}`}
        >
          −
        </button>
        {/* aria-live reads the new number aloud after a change */}
        <span className="stepper-value" aria-live="polite">
          {formatSeats(seats)}
        </span>
        <button
          type="button"
          className="stepper-button"
          onClick={handleIncrease}
          aria-label={`Add one seat for ${itemName}`}
        >
          +
        </button>
      </div>

      {/* Rule 1 is explained right beside the control it limits. */}
      <p className="field-hint">
        Limit: {MAX_SEATS_PER_BOOKING} seats per booking. {formatSeats(seatsLeft)} left, so you can
        choose up to {maxAllowed}.
      </p>

      {limitMessage !== '' && (
        <p className="field-error" role="alert">
          {limitMessage}
        </p>
      )}
    </div>
  );
}

export default SeatStepper;
