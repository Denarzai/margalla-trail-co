import { useState } from 'react';

// Shows the picture of an experience.
// If the record has no picture, or the picture file fails to load, we show
// a simple fallback box with text instead of a broken image icon.
// Props:
//   src - image address (may be an empty string)
//   alt - text that describes the image for screen readers
function ExperienceImage({ src, alt }) {
  const [hasFailed, setHasFailed] = useState(false);

  if (!src || hasFailed) {
    return (
      <div className="image-fallback" role="img" aria-label="Photo coming soon">
        <span aria-hidden="true">▲</span>
        <span>Photo coming soon</span>
      </div>
    );
  }

  // onError runs when the browser cannot load the file.
  return <img className="experience-image" src={src} alt={alt} onError={() => setHasFailed(true)} />;
}

export default ExperienceImage;
