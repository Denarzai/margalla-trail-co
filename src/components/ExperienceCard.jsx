import { Link } from 'react-router-dom';
import ExperienceImage from './ExperienceImage.jsx';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import { formatDuration, formatPrice } from '../utils/format.js';

// One card in a list of experiences.
// The card shows everything a customer needs to compare options without
// opening the details page: price, duration, difficulty, minimum age and
// the number of seats left.
// Props:
//   experience - one record from the data
function ExperienceCard({ experience }) {
  // Destructuring: take the values we need out of the object.
  const { id, name, category, summary, durationHours, difficulty, minAge, pricePerSeat, seatsLeft } =
    experience;

  return (
    <article className="card">
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

        <div className="card-actions">
          <Link to={`/experiences/${id}`} className="button button-secondary">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ExperienceCard;
