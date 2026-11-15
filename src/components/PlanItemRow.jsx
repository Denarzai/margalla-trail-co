import { Link } from 'react-router-dom';
import SeatStepper from './SeatStepper.jsx';
import { formatPrice, formatSeats } from '../utils/format.js';

// One experience in the plan, with controls to change seats or remove it.
// Props:
//   line          - one plan line made by buildPlanLines()
//   onChangeSeats - callback: onChangeSeats(experienceId, newSeats)
//   onRemove      - callback: onRemove(experienceId)
function PlanItemRow({ line, onChangeSeats, onRemove }) {
  const { id, seats, experience, lineTotal, problem, maxAllowed } = line;

  // Case 1: the experience is not in the data any more.
  if (!experience) {
    return (
      <li className="plan-row plan-row-problem">
        <div className="plan-row-main">
          <h3>Unavailable experience</h3>
          <p className="field-error" role="alert">
            {problem}
          </p>
        </div>
        <button type="button" className="button button-danger" onClick={() => onRemove(id)}>
          Remove
        </button>
      </li>
    );
  }

  return (
    <li className={problem !== '' ? 'plan-row plan-row-problem' : 'plan-row'}>
      <div className="plan-row-main">
        <h3>
          <Link to={`/experiences/${id}`}>{experience.name}</Link>
        </h3>
        <p className="hint">
          {experience.schedule}, {experience.startTime} · Ages {experience.minAge}+ ·{' '}
          {formatPrice(experience.pricePerSeat)} per seat
        </p>

        {/* Case 2: the plan no longer fits the current seats. Explain the
            conflict and offer a one-click correction. */}
        {problem !== '' && (
          <div className="message message-error" role="alert">
            <p>
              <strong>Needs attention:</strong> {problem} You selected {formatSeats(seats)}.
            </p>
            <div className="button-row">
              {maxAllowed > 0 && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => onChangeSeats(id, maxAllowed)}
                >
                  Change to {formatSeats(maxAllowed)}
                </button>
              )}
              <button type="button" className="button button-danger" onClick={() => onRemove(id)}>
                Remove from plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Case 3: everything is fine. Show the normal controls. */}
      {problem === '' && (
        <div className="plan-row-controls">
          <SeatStepper
            seats={seats}
            seatsLeft={experience.seatsLeft}
            onChange={(newSeats) => onChangeSeats(id, newSeats)}
            itemName={experience.name}
          />
          <p className="plan-row-total">{formatPrice(lineTotal)}</p>
          <button type="button" className="button button-danger" onClick={() => onRemove(id)}>
            Remove
          </button>
        </div>
      )}
    </li>
  );
}

export default PlanItemRow;
