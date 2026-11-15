import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard.jsx';
import heroImage from '../assets/images/hero.svg';

const FEATURED_COUNT = 3;

// Home page: explains the business and points to the main task.
// Props:
//   experiences   - all loaded records (an empty array while loading)
//   loadStatusBox - loading / error box made by App, or null when data is ready
function HomePage({ experiences, loadStatusBox }) {
  useEffect(() => {
    document.title = 'Margalla Trail Co. | Guided hikes around Islamabad';
  }, []);

  // Derived value: the first three experiences that still have seats.
  const featuredExperiences = experiences
    .filter((experience) => experience.seatsLeft > 0)
    .slice(0, FEATURED_COUNT);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="eyebrow">Guided hikes and day trips from Islamabad</p>
            <h1>Small-group adventures in the Margalla Hills and beyond</h1>
            <p className="hero-lead">
              Pick an experience, choose your seats and reserve in a few minutes. Every price, age
              limit and seat count is shown before you book.
            </p>
            <Link to="/experiences" className="button button-primary button-large">
              Browse experiences
            </Link>
          </div>
          <img
            className="hero-image"
            src={heroImage}
            alt="Illustration of a trail leading through pine trees towards hills at sunrise"
          />
        </div>
      </section>

      <section className="container section" aria-labelledby="how-title">
        <h2 id="how-title">How booking works</h2>
        <ol className="steps">
          <li>
            <h3>1. Choose</h3>
            <p>Search and compare experiences by price, duration, difficulty and seats left.</p>
          </li>
          <li>
            <h3>2. Plan</h3>
            <p>Add seats to your plan. You can change seats or remove an experience at any time.</p>
          </li>
          <li>
            <h3>3. Reserve</h3>
            <p>Fill in a short form, check the total and confirm your simulated booking.</p>
          </li>
        </ol>
      </section>

      <section className="container section" aria-labelledby="featured-title">
        <div className="section-heading">
          <h2 id="featured-title">Popular this month</h2>
          <Link to="/experiences">See all experiences</Link>
        </div>

        {loadStatusBox}

        {!loadStatusBox && featuredExperiences.length === 0 && (
          <p>No experiences are open for booking right now. Please check again soon.</p>
        )}

        <div className="card-grid">
          {featuredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
