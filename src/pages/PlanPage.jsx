import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PlanItemRow from '../components/PlanItemRow.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import EmptyState from '../components/EmptyState.jsx';

// "My plan" page: review the selection, change seats, remove experiences.
// Props:
//   planLines     - lines made by buildPlanLines() in App
//   totals        - object made by calculateTotals() in App
//   onChangeSeats - callback: onChangeSeats(experienceId, newSeats)
//   onRemove      - callback: onRemove(experienceId)
//   onClearPlan   - callback: remove everything from the plan
function PlanPage({ planLines, totals, onChangeSeats, onRemove, onClearPlan }) {
  useEffect(() => {
    document.title = 'My plan | Margalla Trail Co.';
  }, []);

  // Lines that break the seat rule or no longer exist.
  const problemLines = planLines.filter((line) => line.problem !== '');
  const hasProblems = problemLines.length > 0;

  if (planLines.length === 0) {
    return (
      <div className="container section">
        <h1>My plan</h1>
        <EmptyState
          title="Your plan is empty"
          message="You have not added any experience yet. Browse the list and add the ones you like."
        >
          <Link to="/experiences" className="button button-primary">
            Browse experiences
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>My plan</h1>
      <p className="page-lead">
        Change seats or remove an experience. Your plan is saved on this device.
      </p>

      {hasProblems && (
        <div className="message message-error" role="alert">
          <p>
            <strong>
              {problemLines.length === 1
                ? '1 experience in your plan needs attention.'
                : `${problemLines.length} experiences in your plan need attention.`}
            </strong>{' '}
            Availability has changed since you saved your plan. Fix the highlighted items to
            continue.
          </p>
        </div>
      )}

      <div className="two-column">
        <div>
          <ul className="plan-list">
            {planLines.map((line) => (
              <PlanItemRow
                key={line.id}
                line={line}
                onChangeSeats={onChangeSeats}
                onRemove={onRemove}
              />
            ))}
          </ul>

          <div className="button-row">
            <Link to="/experiences" className="button button-secondary">
              Add more experiences
            </Link>
            <button type="button" className="button button-danger" onClick={onClearPlan}>
              Clear my plan
            </button>
          </div>
        </div>

        <div className="side-column">
          <OrderSummary planLines={planLines} totals={totals} />

          {hasProblems ? (
            <>
              <button type="button" className="button button-primary button-large button-full" disabled>
                Continue to booking form
              </button>
              <p className="field-error">Fix the highlighted items in your plan to continue.</p>
            </>
          ) : (
            <Link to="/checkout" className="button button-primary button-large button-full">
              Continue to booking form
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanPage;
