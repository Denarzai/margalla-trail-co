import { Link, NavLink } from 'react-router-dom';

// The header is shown on every page.
// Props:
//   planSeatCount - total number of seats in the customer's plan
function Header({ planSeatCount }) {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Margalla Trail Co. home">
          <span className="brand-mark" aria-hidden="true">
            ▲
          </span>
          <span className="brand-name">Margalla Trail Co.</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className="nav-link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/experiences" className="nav-link">
                Experiences
              </NavLink>
            </li>
            <li>
              <NavLink to="/plan" className="nav-link nav-link-plan">
                My plan
                <span className="plan-count">
                  {planSeatCount}
                  <span className="visually-hidden"> seats selected</span>
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
