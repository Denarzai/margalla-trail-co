import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { formatPrice, formatSeats } from '../utils/format.js';

// Final page of the journey: shows the result of the simulated booking.
// Props:
//   booking - the booking object created by the booking form, or null
function ConfirmationPage({ booking }) {
  useEffect(() => {
    document.title = 'Booking confirmed | Margalla Trail Co.';
  }, []);

  // The booking only lives in memory. After a page refresh it is gone.
  if (booking === null) {
    return (
      <div className="container section">
        <EmptyState
          title="No recent booking to show"
          message="Booking details are not saved on this device, so they disappear when the page is refreshed. You can start a new booking at any time."
        >
          <Link to="/experiences" className="button button-primary">
            Browse experiences
          </Link>
        </EmptyState>
      </div>
    );
  }

  const { reference, customerName, email, lines, totals } = booking;

  return (
    <div className="container section">
      <div className="confirmation">
        <div className="message message-success" role="status">
          <h1>
            <span aria-hidden="true">✓ </span>Booking confirmed
          </h1>
          <p>
            Thank you, {customerName}. Your reference is <strong>{reference}</strong>.
          </p>
          <p>
            <strong>This is a simulated booking.</strong> No payment was taken, no seats were really
            reserved and no email was sent to {email}.
          </p>
        </div>

        <section className="panel" aria-labelledby="booked-title">
          <h2 id="booked-title">What you booked</h2>
          <ul className="confirmation-list">
            {lines.map((line) => (
              <li key={line.id}>
                <h3>{line.name}</h3>
                <p>
                  {formatSeats(line.seats)} · {formatPrice(line.lineTotal)}
                </p>
                <p className="hint">
                  {line.schedule}, {line.startTime}. Meet at: {line.meetingPoint}
                </p>
              </li>
            ))}
          </ul>

          <dl className="summary-totals">
            <div>
              <dt>Total seats</dt>
              <dd>{totals.totalSeats}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Booking fee</dt>
              <dd>{totals.fee === 0 ? 'Free' : formatPrice(totals.fee)}</dd>
            </div>
            <div className="summary-total-row">
              <dt>Total</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>
        </section>

        <div className="button-row button-row-center">
          <Link to="/experiences" className="button button-primary">
            Book another experience
          </Link>
          <Link to="/" className="button button-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
