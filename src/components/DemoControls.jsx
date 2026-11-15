// Demonstration controls for marking and testing.
// They do not belong to the real business. They let a tester switch on
// situations that are otherwise hard to reproduce.
// Props:
//   settings - object with three true/false values
//   onChange - callback: onChange(settingName, newValue)
function DemoControls({ settings, onChange }) {
  function handleCheckboxChange(event) {
    // "name" tells us which checkbox was clicked, "checked" is its new value.
    onChange(event.target.name, event.target.checked);
  }

  return (
    <section className="demo-controls" aria-labelledby="demo-controls-title">
      <h2 id="demo-controls-title">Demo controls (testing only)</h2>
      <p>
        These switches are for the assignment demonstration. Changing one reloads the experience
        data.
      </p>

      <label className="check-row">
        <input
          type="checkbox"
          name="simulateFailure"
          checked={settings.simulateFailure}
          onChange={handleCheckboxChange}
        />
        Simulate loading failure
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          name="simulateChangedAvailability"
          checked={settings.simulateChangedAvailability}
          onChange={handleCheckboxChange}
        />
        Simulate changed availability (Trail 5 Sunrise Hike drops to 1 seat, Khanpur Lake Kayaking
        Day sells out)
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          name="simulateEmptyData"
          checked={settings.simulateEmptyData}
          onChange={handleCheckboxChange}
        />
        Simulate empty dataset (no experiences scheduled)
      </label>
    </section>
  );
}

export default DemoControls;
