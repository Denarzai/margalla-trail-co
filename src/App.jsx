import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LoadStatus from './components/LoadStatus.jsx';
import HomePage from './pages/HomePage.jsx';
import ExperiencesPage from './pages/ExperiencesPage.jsx';
import ExperienceDetailsPage from './pages/ExperienceDetailsPage.jsx';
import PlanPage from './pages/PlanPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { loadExperiences } from './services/experienceLoader.js';
import { DEFAULT_FILTERS } from './utils/filterExperiences.js';
import { buildPlanLines, calculateTotals } from './utils/planHelpers.js';
import { loadSavedPlan, PLAN_STORAGE_KEY, writeStorage } from './utils/storage.js';
import { EMPTY_BOOKING_FORM } from './utils/validation.js';

const DEFAULT_DEMO_SETTINGS = {
  simulateFailure: false,
  simulateChangedAvailability: false,
  simulateEmptyData: false,
};

// App is the top component. It owns the data that several pages share
// (the "single source of truth") and passes it down to them with props.
// Pages never change this data directly. They call the handler functions
// below, which App passes to them as callback props.
function App() {
  // ----- Data loaded by the mock loader -----
  const [experiences, setExperiences] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [loadError, setLoadError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  // ----- Demo controls (testing only) -----
  const [demoSettings, setDemoSettings] = useState(DEFAULT_DEMO_SETTINGS);

  // ----- Search / filter / sort choices -----
  // Kept here (not inside ExperiencesPage) so the choices are still there
  // when the customer opens a details page and comes back.
  const [browseFilters, setBrowseFilters] = useState(DEFAULT_FILTERS);

  // ----- The customer's plan: an array like [{ id: 'trail-5-sunrise', seats: 2 }] -----
  // We pass the function loadSavedPlan (without calling it). React calls it
  // once, on the first render, to read the plan saved in localStorage.
  const [planItems, setPlanItems] = useState(loadSavedPlan);

  // ----- Booking form values -----
  // Kept here so typed details survive a visit to the plan page and back.
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING_FORM);

  // ----- The last completed (simulated) booking, for the confirmation page -----
  const [lastBooking, setLastBooking] = useState(null);

  const location = useLocation();

  // Effect 1: load the experiences.
  // It runs when the app starts, and again whenever the customer presses
  // "Try again" (reloadCount changes) or a demo control changes.
  useEffect(() => {
    // "ignore" becomes true when this effect is cleaned up. It stops an
    // old, slow request from overwriting the result of a newer one.
    let ignore = false;

    async function fetchExperiences() {
      setLoadStatus('loading');
      try {
        const records = await loadExperiences({
          shouldFail: demoSettings.simulateFailure,
          returnEmptyList: demoSettings.simulateEmptyData,
          useReducedSeats: demoSettings.simulateChangedAvailability,
        });
        if (!ignore) {
          setExperiences(records);
          setLoadStatus('success');
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message);
          setLoadStatus('error');
        }
      }
    }

    fetchExperiences();

    // Cleanup function.
    return () => {
      ignore = true;
    };
  }, [reloadCount, demoSettings]);

  // Effect 2: save the plan in localStorage every time it changes.
  useEffect(() => {
    writeStorage(PLAN_STORAGE_KEY, planItems);
  }, [planItems]);

  // Effect 3: start every new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ----- Derived values: calculated from state on every render -----
  const planLines = buildPlanLines(planItems, experiences);
  const totals = calculateTotals(planLines);
  const isDataReady = loadStatus === 'success';
  const problemCount = isDataReady ? planLines.filter((line) => line.problem !== '').length : 0;

  // ----- Handlers (passed to children as callback props) -----

  function handleRetryLoad() {
    // Functional update: the next value depends on the previous value.
    setReloadCount((previousCount) => previousCount + 1);
  }

  function handleDemoSettingChange(settingName, newValue) {
    // Copy the old object and replace one property. [settingName] uses the
    // value of the variable as the property name.
    setDemoSettings((previousSettings) => ({ ...previousSettings, [settingName]: newValue }));
  }

  // Adds an experience to the plan, or changes its seats if it is already there.
  function handleSetPlanSeats(experienceId, seats) {
    setPlanItems((previousItems) => {
      const isAlreadyInPlan = previousItems.some((item) => item.id === experienceId);

      if (isAlreadyInPlan) {
        // map() makes a new array. Only the matching item is replaced by a copy.
        return previousItems.map((item) => {
          if (item.id === experienceId) {
            return { ...item, seats: seats };
          }
          return item;
        });
      }

      // Spread the old items into a new array and add the new one at the end.
      return [...previousItems, { id: experienceId, seats: seats }];
    });
  }

  function handleRemoveFromPlan(experienceId) {
    // filter() makes a new array without the removed item.
    setPlanItems((previousItems) => previousItems.filter((item) => item.id !== experienceId));
  }

  function handleClearPlan() {
    setPlanItems([]);
  }

  function handleFormChange(fieldName, newValue) {
    setBookingForm((previousForm) => ({ ...previousForm, [fieldName]: newValue }));
  }

  function handleCompleteBooking(booking) {
    setLastBooking(booking);

    // Take the booked seats away from the experiences, so the listing
    // shows the new availability straight away.
    setExperiences((previousExperiences) =>
      previousExperiences.map((experience) => {
        const bookedLine = booking.lines.find((line) => line.id === experience.id);
        if (!bookedLine) {
          return experience;
        }
        return { ...experience, seatsLeft: experience.seatsLeft - bookedLine.seats };
      })
    );

    setPlanItems([]);
    setBookingForm(EMPTY_BOOKING_FORM);
  }

  // This box replaces page content while the data is loading or has failed.
  const loadStatusBox = isDataReady ? null : (
    <LoadStatus
      status={loadStatus}
      errorMessage={loadError}
      onRetry={handleRetryLoad}
      isDemoFailureOn={demoSettings.simulateFailure}
      onTurnOffFailure={() => handleDemoSettingChange('simulateFailure', false)}
    />
  );
  const loadStatusPage = <div className="container section">{loadStatusBox}</div>;

  return (
    <div className="app-shell">
      <Header planSeatCount={totals.totalSeats} />

      {problemCount > 0 && location.pathname !== '/plan' && (
        <div className="notice-bar" role="status">
          <div className="container">
            {problemCount === 1
              ? '1 experience in your plan needs attention. '
              : `${problemCount} experiences in your plan need attention. `}
            <Link to="/plan">Review my plan</Link>
          </div>
        </div>
      )}

      <main id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                experiences={experiences}
                planItems={planItems}
                onSetPlanSeats={handleSetPlanSeats}
                loadStatusBox={loadStatusBox}
              />
            }
          />
          <Route
            path="/experiences"
            element={
              isDataReady ? (
                <ExperiencesPage
                  experiences={experiences}
                  filters={browseFilters}
                  onFiltersChange={setBrowseFilters}
                  planItems={planItems}
                  onSetPlanSeats={handleSetPlanSeats}
                />
              ) : (
                loadStatusPage
              )
            }
          />
          <Route
            path="/experiences/:id"
            element={
              isDataReady ? (
                <ExperienceDetailsPage
                  experiences={experiences}
                  planItems={planItems}
                  onSetPlanSeats={handleSetPlanSeats}
                  onRemoveFromPlan={handleRemoveFromPlan}
                />
              ) : (
                loadStatusPage
              )
            }
          />
          <Route
            path="/plan"
            element={
              isDataReady ? (
                <PlanPage
                  planLines={planLines}
                  totals={totals}
                  onChangeSeats={handleSetPlanSeats}
                  onRemove={handleRemoveFromPlan}
                  onClearPlan={handleClearPlan}
                />
              ) : (
                loadStatusPage
              )
            }
          />
          <Route
            path="/checkout"
            element={
              isDataReady ? (
                <CheckoutPage
                  planLines={planLines}
                  totals={totals}
                  formData={bookingForm}
                  onFormChange={handleFormChange}
                  onRemoveFromPlan={handleRemoveFromPlan}
                  onCompleteBooking={handleCompleteBooking}
                />
              ) : (
                loadStatusPage
              )
            }
          />
          <Route path="/confirmation" element={<ConfirmationPage booking={lastBooking} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer demoSettings={demoSettings} onDemoSettingChange={handleDemoSettingChange} />
    </div>
  );
}

export default App;
