import { BOOKING_FEE, FREE_FEE_SUBTOTAL } from '../rules/bookingFee.js';
import { formatPrice, formatSeats } from '../utils/format.js';

// The calculated summary: one row per experience, then subtotal, booking
// fee and total. It is used on the plan page and on the booking page, so
// both pages always show the same numbers.
// Props:
//   planLines - lines made by buildPlanLines()
//   totals    - object made by calculateTotals()
function OrderSummary({ planLines, totals }) {
  return (
    <section className="panel summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Booking summary</h2>

      <ul className="summary-lines">
        {planLines.map((line) => (
          <li key={line.id}>
            <span>
              {line.experience ? line.experience.name : 'Unavailable experience'}
              <span className="summary-seats"> × {formatSeats(line.seats)}</span>
            </span>
            <span>{formatPrice(line.lineTotal)}</span>
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
          <dt>Total to pay</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {/* Rule 3 is explained right next to the numbers it changes. */}
      {totals.fee > 0 && (
        <p className="message message-info">
          A {formatPrice(BOOKING_FEE)} booking fee applies to bookings under{' '}
          {formatPrice(FREE_FEE_SUBTOTAL)}. Add {formatPrice(totals.amountNeededForFreeFee)} more
          to remove it.
        </p>
      )}

      {totals.fee === 0 && totals.subtotal > 0 && (
        <p className="message message-success">
          No booking fee: your subtotal is {formatPrice(FREE_FEE_SUBTOTAL)} or more.
        </p>
      )}

      <p className="hint">Simulated booking. No payment is taken on this website.</p>
    </section>
  );
}

export default OrderSummary;
