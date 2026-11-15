import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

// Shown for any address that does not match one of our routes.
function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | Margalla Trail Co.';
  }, []);

  return (
    <div className="container section">
      <EmptyState
        title="Page not found"
        message="This address does not exist on our website. The link may be old or typed incorrectly."
      >
        <Link to="/experiences" className="button button-primary">
          Browse experiences
        </Link>
        <Link to="/" className="button button-secondary">
          Go to the home page
        </Link>
      </EmptyState>
    </div>
  );
}

export default NotFoundPage;
