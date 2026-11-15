import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { checkAgeRule } from '../rules/ageRule.js';
import { getHighestMinAge } from '../utils/planHelpers.js';
import { MAX_NOTE_LENGTH, validateBookingForm } from '../utils/validation.js';

// Booking form page: the customer enters contact details, sees the
// calculated summary and confirms the simulated booking.
// Props:
//   planLines         - lines made by buildPlanLines() in App
//   totals            - object made by calculateTotals() in App
//   formData          - the form values (kept in App so they survive a visit to the plan page)
//   onFormChange      - callback: onFormChange(fieldName, newValue)
//   onRemoveFromPlan  - callback: onRemoveFromPlan(experienceId)
//   onCompleteBooking - callback: onCompleteBooking(bookingObject)
function CheckoutPage({ planLines, totals, formData, onFormChange, onRemoveFromPlan, onCompleteBooking }) {
  // Which fields the customer has already visited, for example { phone: true }.
  const [touchedFields, setTouchedFields] = useState({});
  // Becomes true after the first press of the submit button.
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Booking form | Margalla Trail Co.';
  }, []);

  // ----- Derived values (calculated on every render) -----
  const errors = validateBookingForm(formData);
  const errorCount = Object.keys(errors).length;

  const problemLines = planLines.filter((line) => line.problem !== '');
  const highestMinAge = getHighestMinAge(planLines);

  // Rule 2 (eligibility): once a valid age is typed, find the experiences
  // in the plan that need an older group.
  const youngestAge = Number(formData.youngestAge);
  const hasValidAge = errors.youngestAge === undefined;
  const ageConflictLines = hasValidAge
    ? planLines.filter((line) => {
        return line.experience !== null && !checkAgeRule(youngestAge, line.experience.minAge).ok;
      })
    : [];

  const canComplete = errorCount === 0 && ageConflictLines.length === 0 && problemLines.length === 0;

  // An error is shown after the customer leaves the field, or after the
  // first submit attempt. This avoids showing errors while they still type.
  function getVisibleError(fieldName) {
    const shouldShow = submitAttempted || touchedFields[fieldName] === true;
    if (shouldShow && errors[fieldName]) {
      return errors[fieldName];
    }
    return '';
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    // A checkbox keeps its value in "checked", other inputs in "value".
    onFormChange(name, type === 'checkbox' ? checked : value);
  }

  function handleInputBlur(event) {
    const fieldName = event.target.name;
    setTouchedFields((previousTouched) => ({ ...previousTouched, [fieldName]: true }));
  }

  function handleSubmit(event) {
    // Stop the browser from reloading the page (its default form behaviour).
    event.preventDefault();
    setSubmitAttempted(true);

    // All three operating rules and the form rules must pass.
    if (!canComplete) {
      return;
    }

    const booking = {
      reference: 'MTC-' + String(Date.now()).slice(-6),
      customerName: formData.fullName.trim(),
      email: formData.email.trim(),
      youngestAge: youngestAge,
      lines: planLines.map((line) => ({
        id: line.id,
        name: line.experience.name,
        seats: line.seats,
        lineTotal: line.lineTotal,
        schedule: line.experience.schedule,
        startTime: line.experience.startTime,
        meetingPoint: line.experience.meetingPoint,
      })),
      totals: totals,
    };

    onCompleteBooking(booking);
    navigate('/confirmation');
  }

  if (planLines.length === 0) {
    return (
      <div className="container section">
        <h1>Booking form</h1>
        <EmptyState
          title="There is nothing to book yet"
          message="Add at least one experience to your plan before you fill in the booking form."
        >
          <Link to="/experiences" className="button button-primary">
            Browse experiences
          </Link>
        </EmptyState>
      </div>
    );
  }

  const notesError = getVisibleError('notes');
  const agreeError = getVisibleError('agreeToTerms');

  return (
    <div className="container section">
      <p className="breadcrumb">
        <Link to="/plan">← Back to my plan</Link>
      </p>
      <h1>Booking form</h1>
      <p className="page-lead">
        Simulated booking: nothing is sent and no payment is taken. All fields are required unless
        marked optional.
      </p>

      {problemLines.length > 0 && (
        <div className="message message-error" role="alert">
          <p>
            <strong>Your plan needs attention before you can book.</strong> Seats have changed for{' '}
            {problemLines.length === 1 ? '1 experience' : `${problemLines.length} experiences`}.
          </p>
          <Link to="/plan" className="button button-secondary">
            Fix my plan
          </Link>
        </div>
      )}

      <div className="two-column">
        {/* noValidate switches off the browser's own messages so that our
            specific messages are shown instead. */}
        <form className="panel booking-form" onSubmit={handleSubmit} noValidate>
          <h2>Your details</h2>

          {submitAttempted && errorCount > 0 && (
            <div className="message message-error" role="alert">
              <p>
                <strong>
                  {errorCount === 1
                    ? 'Please correct 1 field below.'
                    : `Please correct ${errorCount} fields below.`}
                </strong>{' '}
                Everything you typed correctly has been kept.
              </p>
            </div>
          )}

          <FormField
            id="fullName"
            label="Full name"
            type="text"
            hint="The name of the person making the booking."
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={getVisibleError('fullName')}
            autoComplete="name"
          />

          <FormField
            id="phone"
            label="Mobile number"
            type="tel"
            hint="11 digits starting with 03, for example 0300 1234567."
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={getVisibleError('phone')}
            inputMode="tel"
            autoComplete="tel"
          />

          <FormField
            id="email"
            label="Email address"
            type="email"
            hint="We would send the booking confirmation here."
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={getVisibleError('email')}
            inputMode="email"
            autoComplete="email"
          />

          <FormField
            id="youngestAge"
            label="Age of the youngest participant"
            type="text"
            hint={`Your plan needs everyone to be at least ${highestMinAge} years old.`}
            value={formData.youngestAge}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={getVisibleError('youngestAge')}
            inputMode="numeric"
            autoComplete="off"
          />

          {/* Rule 2: name every experience the group is too young for and
              let the customer remove it without leaving the form. */}
          {ageConflictLines.length > 0 && (
            <div className="message message-error" role="alert">
              <p>
                <strong>Age limit:</strong> a participant aged {youngestAge} cannot join{' '}
                {ageConflictLines.length === 1 ? 'this experience' : 'these experiences'}. Remove{' '}
                {ageConflictLines.length === 1 ? 'it' : 'them'} from your plan, or correct the age.
              </p>
              <ul className="conflict-list">
                {ageConflictLines.map((line) => (
                  <li key={line.id}>
                    <span>
                      {line.experience.name} (ages {line.experience.minAge}+)
                    </span>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => onRemoveFromPlan(line.id)}
                    >
                      Remove from plan
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasValidAge && ageConflictLines.length === 0 && (
            <p className="message message-success">
              ✓ Age check passed for every experience in your plan.
            </p>
          )}

          <div className={notesError !== '' ? 'field field-invalid' : 'field'}>
            <label htmlFor="notes">Notes for the guide (optional)</label>
            <p className="field-hint" id="notes-hint">
              Allergies, medical conditions or questions. {formData.notes.length} of{' '}
              {MAX_NOTE_LENGTH} characters used.
            </p>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              aria-invalid={notesError !== ''}
              aria-describedby={notesError !== '' ? 'notes-hint notes-error' : 'notes-hint'}
            />
            {notesError !== '' && (
              <p className="field-error" id="notes-error">
                <span aria-hidden="true">⚠ </span>
                {notesError}
              </p>
            )}
          </div>

          <div className="field">
            <label className="check-row">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                aria-invalid={agreeError !== ''}
                aria-describedby={agreeError !== '' ? 'agree-error' : undefined}
              />
              I understand that this is a simulated booking for a student project and that no
              payment is taken.
            </label>
            {agreeError !== '' && (
              <p className="field-error" id="agree-error">
                <span aria-hidden="true">⚠ </span>
                {agreeError}
              </p>
            )}
          </div>

          <button type="submit" className="button button-primary button-large button-full">
            Confirm simulated booking
          </button>

          {submitAttempted && !canComplete && (
            <p className="field-error" role="alert">
              The booking was not completed. Please fix the problems shown above.
            </p>
          )}
        </form>

        <div className="side-column">
          <OrderSummary planLines={planLines} totals={totals} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
