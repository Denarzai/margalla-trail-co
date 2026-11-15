// One labelled text input with an optional hint and error message.
// Props:
//   id, label, type  - basic input information (id is also used as the name)
//   value            - current text (controlled by the parent)
//   onChange, onBlur - event handlers from the parent
//   hint             - short help text shown under the label
//   error            - error message, or an empty string when there is none
//   inputMode, autoComplete - help phones show the right keyboard / suggestions
function FormField({ id, label, type, value, onChange, onBlur, hint, error, inputMode, autoComplete }) {
  const hasError = error !== '';

  // aria-describedby connects the hint and the error to the input, so a
  // screen reader reads them together with the label.
  const describedBy = hasError ? `${id}-hint ${id}-error` : `${id}-hint`;

  return (
    <div className={hasError ? 'field field-invalid' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <p className="field-hint" id={`${id}-hint`}>
        {hint}
      </p>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={describedBy}
      />
      {hasError && (
        <p className="field-error" id={`${id}-error`}>
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
