import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ExperienceImage from '../components/ExperienceImage.jsx';
import AvailabilityBadge from '../components/AvailabilityBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AddToPlanPanel from '../components/AddToPlanPanel.jsx';
import { BOOKING_FEE, FREE_FEE_SUBTOTAL } from '../rules/bookingFee.js';
import { getSeatsInPlan } from '../utils/planHelpers.js';
import { formatDuration, formatPrice } from '../utils/format.js';

// Details page for one experience. The id comes from the URL,
// for example /experiences/trail-5-sunrise
// Props:
//   experiences      - all loaded records
//   planItems        - the customer's plan
//   onSetPlanSeats   - callback: onSetPlanSeats(experienceId, seats)
//   onRemoveFromPlan - callback: onRemoveFromPlan(experienceId)
function ExperienceDetailsPage({ experiences, planItems, onSetPlanSeats, onRemoveFromPlan }) {
  // useParams reads the ":id" part of the URL.
  const { id } = useParams();

  // find() returns the first record with this id, or undefined.
  const experience = experiences.find((item) => item.id === id);

  useEffect(() => {
    if (experience) {
      document.title = `${experience.name} | Margalla Trail Co.`;
    } else {
      document.title = 'Experience not found | Margalla Trail Co.';
    }
  }, [experience]);

  // Invalid id in the URL: explain and offer a way forward.
  if (!experience) {
    return (
      <div className="container section">
        <EmptyState
          title="We could not find that experience"
          message={`There is no experience with the address “${id}”. The link may be old or typed incorrectly.`}
        >
          <Link to="/experiences" className="button button-primary">
            Browse all experiences
          </Link>
          <Link to="/" className="button button-secondary">
            Go to the home page
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container section">
      <p className="breadcrumb">
        <Link to="/experiences">← Back to all experiences</Link>
      </p>

      <div className="details-layout">
        <div className="details-main">
          <ExperienceImage src={experience.image} alt={experience.imageAlt} />
          <p className="card-category">{experience.category}</p>
          <h1>{experience.name}</h1>
          <p className="details-summary">{experience.summary}</p>

          <h2>About this experience</h2>
          <p>{experience.description}</p>

          <h2>What is included</h2>
          {experience.includes.length > 0 ? (
            <ul>
              {experience.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="hint">
              The list of included items is being finalised. Call our office if you need it before
              you book.
            </p>
          )}

          <h2>What to bring</h2>
          <ul>
            {experience.bring.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="details-side" aria-label="Booking information">
          <div className="panel">
            <p className="price price-large">
              {formatPrice(experience.pricePerSeat)} <span className="price-unit">per seat</span>
            </p>
            <AvailabilityBadge seatsLeft={experience.seatsLeft} />

            <dl className="fact-table">
              <div>
                <dt>When</dt>
                <dd>
                  {experience.schedule}, {experience.startTime}
                </dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(experience.durationHours)}</dd>
              </div>
              <div>
                <dt>Difficulty</dt>
                <dd>{experience.difficulty}</dd>
              </div>
              <div>
                <dt>Minimum age</dt>
                <dd>{experience.minAge} years</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{experience.location}</dd>
              </div>
              <div>
                <dt>Meeting point</dt>
                <dd>{experience.meetingPoint}</dd>
              </div>
            </dl>

            {/* key={experience.id} gives every experience its own fresh
                panel, so the seat number never leaks from one to another. */}
            <AddToPlanPanel
              key={experience.id}
              experience={experience}
              seatsInPlan={getSeatsInPlan(planItems, experience.id)}
              onSetPlanSeats={onSetPlanSeats}
              onRemoveFromPlan={onRemoveFromPlan}
            />

            <p className="message message-info details-rule">
              <strong>Age rule:</strong> everyone in your group must be at least {experience.minAge}{' '}
              years old. We check the age of your youngest participant on the booking form.
            </p>

            <p className="hint">
              A {formatPrice(BOOKING_FEE)} booking fee applies to bookings under{' '}
              {formatPrice(FREE_FEE_SUBTOTAL)}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ExperienceDetailsPage;
