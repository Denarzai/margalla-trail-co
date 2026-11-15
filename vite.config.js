import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// "base" is the folder the website is served from.
// - On our own computer, and on hosts like Vercel or Netlify, that is "/".
// - On GitHub Pages the site lives in a sub-folder with the repository
//   name, so the deploy workflow (.github/workflows/deploy.yml) sets the
//   BASE_PATH variable to "/margalla-trail-co/" before it builds.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
});
