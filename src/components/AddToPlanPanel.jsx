import { useState } from 'react';
import { Link } from 'react-router-dom';
import SeatStepper from './SeatStepper.jsx';
import { checkSeatLimit } from '../rules/seatLimit.js';
import { formatPrice, formatSeats } from '../utils/format.js';

// The "choose seats and add to plan" box on the details page.
// Props:
//   experience       - the record being viewed
//   seatsInPlan      - seats already in the plan for this experience (0 if none)
//   onSetPlanSeats   - callback: onSetPlanSeats(experienceId, seats)
//   onRemoveFromPlan - callback: onRemoveFromPlan(experienceId)
function AddToPlanPanel({ experience, seatsInPlan, onSetPlanSeats, onRemoveFromPlan }) {
  // The number shown in the stepper. It starts at the number already in the
  // plan, or at 1. It only goes into the shared plan when the button is pressed.
  const [selectedSeats, setSelectedSeats] = useState(seatsInPlan > 0 ? seatsInPlan : 1);

  const isInPlan = seatsInPlan > 0;
  const seatCheck = checkSeatLimit(selectedSeats, experience.seatsLeft);

  if (experience.seatsLeft <= 0) {
    return (
      <div className="message message-warning">
        <p>
          <strong>Sold out.</strong> All seats for this experience are taken, so it cannot be added
          to a plan.
        </p>
        {isInPlan && (
          <button
            type="button"
            className="button button-danger"
            onClick={() => onRemoveFromPlan(experience.id)}
          >
            Remove from my plan
          </button>
        )}
        <p>
          <Link to="/experiences">See other experiences</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="add-panel">
      <p className="field-label">How many seats?</p>
      <SeatStepper
        seats={selectedSeats}
        seatsLeft={experience.seatsLeft}
        onChange={setSelectedSeats}
        itemName={experience.name}
      />

      {/* The saved plan can hold more seats than are left now. */}
      {!seatCheck.ok && (
        <p className="field-error" role="alert">
          {seatCheck.message} Reduce the seats to continue.
        </p>
      )}

      <p className="add-panel-total">
        {formatSeats(selectedSeats)} × {formatPrice(experience.pricePerSeat)} ={' '}
        <strong>{formatPrice(selectedSeats * experience.pricePerSeat)}</strong>
      </p>

      <button
        type="button"
        className="button button-primary button-full"
        disabled={!seatCheck.ok || selectedSeats === seatsInPlan}
        onClick={() => onSetPlanSeats(experience.id, selectedSeats)}
      >
        {isInPlan ? `Update plan to ${formatSeats(selectedSeats)}` : 'Add to my plan'}
      </button>

      {isInPlan && (
        <div className="message message-success" role="status">
          <p>
            <strong>✓ In your plan: {formatSeats(seatsInPlan)}.</strong>
          </p>
          <div className="button-row">
            <Link to="/plan" className="button button-secondary">
              Review my plan
            </Link>
            <button
              type="button"
              className="button button-danger"
              onClick={() => onRemoveFromPlan(experience.id)}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddToPlanPanel;
