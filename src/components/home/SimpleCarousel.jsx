'use client';

import { useState, useEffect } from 'react';

export default function SimpleCarousel() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Marquer comme chargé côté client
    setLoaded(true);
    console.log('SimpleCarousel chargé côté client');
  }, []);

  return (
    <div className="bg-blue-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Carrousel Simple de Test</h2>
      <p>Ce composant est {loaded ? 'chargé côté client' : 'en cours de chargement'}.</p>
      {loaded && (
        <div className="bg-white p-4 rounded mt-4">
          <p>Si vous voyez ce message, le carrousel fonctionne correctement côté client.</p>
        </div>
      )}
    </div>
  );
}
