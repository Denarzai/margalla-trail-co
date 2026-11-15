import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LoadStatus from './components/LoadStatus.jsx';
import HomePage from './pages/HomePage.jsx';
import ExperiencesPage from './pages/ExperiencesPage.jsx';
import ExperienceDetailsPage from './pages/ExperienceDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { loadExperiences } from './services/experienceLoader.js';
import { DEFAULT_FILTERS } from './utils/filterExperiences.js';

const DEFAULT_DEMO_SETTINGS = {
  simulateFailure: false,
  simulateChangedAvailability: false,
  simulateEmptyData: false,
};

// App is the top component. It owns the data that several pages share
// and passes it down to them with props.
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

  // Effect 2: start every new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  function handleRetryLoad() {
    // Functional update: the next value depends on the previous value.
    setReloadCount((previousCount) => previousCount + 1);
  }

  function handleDemoSettingChange(settingName, newValue) {
    // Copy the old object and replace one property. [settingName] uses the
    // value of the variable as the property name.
    setDemoSettings((previousSettings) => ({ ...previousSettings, [settingName]: newValue }));
  }

  const isDataReady = loadStatus === 'success';

  // This box replaces page content while the data is loading or has failed.
  const loadStatusBox = isDataReady ? null : (
    <div className="container section">
      <LoadStatus
        status={loadStatus}
        errorMessage={loadError}
        onRetry={handleRetryLoad}
        isDemoFailureOn={demoSettings.simulateFailure}
        onTurnOffFailure={() => handleDemoSettingChange('simulateFailure', false)}
      />
    </div>
  );

  return (
    <div className="app-shell">
      <Header planSeatCount={0} />

      <main id="main-content">
        <Routes>
          <Route
            path="/"
            element={<HomePage experiences={experiences} loadStatusBox={loadStatusBox} />}
          />
          <Route
            path="/experiences"
            element={
              isDataReady ? (
                <ExperiencesPage
                  experiences={experiences}
                  filters={browseFilters}
                  onFiltersChange={setBrowseFilters}
                />
              ) : (
                loadStatusBox
              )
            }
          />
          <Route
            path="/experiences/:id"
            element={
              isDataReady ? <ExperienceDetailsPage experiences={experiences} /> : loadStatusBox
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer demoSettings={demoSettings} onDemoSettingChange={handleDemoSettingChange} />
    </div>
  );
}

export default App;
