import { experiences } from './data/experiences.js';

// First version of the app: it only proves that the project runs and that
// the local business data can be imported. Routes and pages come next.
function App() {
  return (
    <main>
      <h1>Margalla Trail Co.</h1>
      <p>Guided hikes and outdoor day experiences around Islamabad.</p>
      <p>{experiences.length} experiences in our local data.</p>
    </main>
  );
}

export default App;
