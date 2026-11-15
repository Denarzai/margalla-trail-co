import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

// This is where the React application starts.
// 1. We find the empty <div id="root"> in index.html.
// 2. We tell React to draw our <App /> component inside it.
// BrowserRouter lets every component inside it use routes and links.
// "basename" is the folder the site is hosted in ("/" on our computer,
// "/margalla-trail-co/" on GitHub Pages). Vite fills in BASE_URL for us.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
