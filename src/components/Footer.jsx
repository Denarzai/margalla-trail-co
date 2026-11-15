import DemoControls from './DemoControls.jsx';

// The footer is shown on every page. It also holds the demo controls.
// Props:
//   demoSettings        - passed down to DemoControls
//   onDemoSettingChange - callback passed down to DemoControls
function Footer({ demoSettings, onDemoSettingChange }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">Margalla Trail Co.</p>
          <p>Guided hikes and outdoor day experiences around Islamabad.</p>
          <p>Office: G-9 Markaz, Islamabad. Open daily 9 AM to 6 PM.</p>
          <p className="footer-note">
            Student project for CS4032 Web Programming. The business is fictional and every booking
            is simulated. No payment is taken and no data is sent anywhere.
          </p>
        </div>

        <DemoControls settings={demoSettings} onChange={onDemoSettingChange} />
      </div>
    </footer>
  );
}

export default Footer;
