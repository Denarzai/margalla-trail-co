// A friendly box for "there is nothing to show here" situations.
// Props:
//   title    - short heading
//   message  - one sentence that explains the situation
//   children - buttons or links that give the customer a next step
function EmptyState({ title, message, children }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="button-row button-row-center">{children}</div>
    </div>
  );
}

export default EmptyState;
