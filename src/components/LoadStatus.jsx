// Shown instead of page content while the data is loading or after the
// loading failed.
// Props:
//   status           - 'loading' or 'error'
//   errorMessage     - text of the error (only used when status is 'error')
//   onRetry          - callback: try to load the data again
//   isDemoFailureOn  - true when the "Simulate loading failure" switch is on
//   onTurnOffFailure - callback: switch the demo failure off (this also reloads)
function LoadStatus({ status, errorMessage, onRetry, isDemoFailureOn, onTurnOffFailure }) {
  if (status === 'loading') {
    // role="status" makes screen readers announce the message politely.
    return (
      <div className="status-box" role="status">
        <span className="spinner" aria-hidden="true"></span>
        <p>Loading experiences…</p>
      </div>
    );
  }

  return (
    <div className="status-box status-box-error" role="alert">
      <h2>Something went wrong</h2>
      <p>{errorMessage}</p>

      <div className="button-row">
        <button type="button" className="button button-primary" onClick={onRetry}>
          Try again
        </button>

        {isDemoFailureOn && (
          <button type="button" className="button button-secondary" onClick={onTurnOffFailure}>
            Turn off demo failure and reload
          </button>
        )}
      </div>

      {isDemoFailureOn && (
        <p className="hint">
          The “Simulate loading failure” demo control is switched on, so “Try again” will keep
          failing until it is turned off.
        </p>
      )}
    </div>
  );
}

export default LoadStatus;
