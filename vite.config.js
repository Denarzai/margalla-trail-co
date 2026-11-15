import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The website is hosted on GitHub Pages inside a sub-folder that has the
// same name as the repository: https://<user>.github.io/margalla-trail-co/
// "base" tells Vite to put that folder name in front of every asset link
// when we build. During development (npm run dev) we simply use "/".
const REPOSITORY_NAME = 'margalla-trail-co';

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'build' ? `/${REPOSITORY_NAME}/` : '/',
  };
});
