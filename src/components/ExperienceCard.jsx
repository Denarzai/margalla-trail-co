import { Link } from 'react-router-dom';
import ExperienceImage from './ExperienceImage.jsx';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import { formatDuration, formatPrice, formatSeats } from '../utils/format.js';

// One card in a list of experiences.
// The card shows everything a customer needs to compare options without
// opening the details page: price, duration, difficulty, minimum age and
// the number of seats left.
// Props:
//   experience     - one record from the data
//   seatsInPlan    - seats of this experience already in the plan (0 if none)
//   onSetPlanSeats - callback: onSetPlanSeats(experienceId, seats)
function ExperienceCard({ experience, seatsInPlan, onSetPlanSeats }) {
  // Destructuring: take the values we need out of the object.
  const { id, name, category, summary, durationHours, difficulty, minAge, pricePerSeat, seatsLeft } =
    experience;

  const isInPlan = seatsInPlan > 0;
  const isSoldOut = seatsLeft <= 0;

  return (
    <article className={isInPlan ? 'card card-selected' : 'card'}>
      <ExperienceImage src={experience.image} alt={experience.imageAlt} />

      <div className="card-body">
        <p className="card-category">{category}</p>
        <h3 className="card-title">
          <Link to={`/experiences/${id}`}>{name}</Link>
        </h3>
        <p className="card-summary">{summary}</p>

        <ul className="fact-list" aria-label="Key facts">
          <li>{formatDuration(durationHours)}</li>
          <li>{difficulty}</li>
          <li>Ages {minAge}+</li>
        </ul>

        <div className="card-price-row">
          <p className="price">
            {formatPrice(pricePerSeat)} <span className="price-unit">per seat</span>
          </p>
          <AvailabilityBadge seatsLeft={seatsLeft} />
        </div>

        {isInPlan && <p className="in-plan-note">✓ In your plan: {formatSeats(seatsInPlan)}</p>}

        <div className="card-actions">
          <Link to={`/experiences/${id}`} className="button button-secondary">
            View details
          </Link>

          {/* Only one of these three is shown. */}
          {isInPlan && (
            <Link to="/plan" className="button button-secondary">
              Review plan
            </Link>
          )}
          {!isInPlan && isSoldOut && (
            <button type="button" className="button button-primary" disabled>
              Sold out
            </button>
          )}
          {!isInPlan && !isSoldOut && (
            <button
              type="button"
              className="button button-primary"
              onClick={() => onSetPlanSeats(id, 1)}
              aria-label={`Add 1 seat for ${name} to my plan`}
            >
              Add 1 seat
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ExperienceCard;
