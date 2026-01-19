'use client';

import { useState } from 'react';
import { FiMail, FiX, FiCheck, FiLoader } from 'react-icons/fi';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Email invalide');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Inscription réussie !');
        setEmail('');
        // Masquer le bandeau après 3 secondes
        setTimeout(() => setIsVisible(false), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 relative">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          {/* Message */}
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Nouveau
            </span>
            <span className="text-sm sm:text-base font-medium">
              Recevez un mail à chaque nouveau film noté !
            </span>
          </div>

          {/* Form */}
          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="pl-9 pr-3 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white w-48 sm:w-56 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  "S'abonner"
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-yellow-300 font-medium">
              <FiCheck className="w-5 h-5" />
              {message}
            </div>
          )}

          {/* Error message */}
          {status === 'error' && (
            <span className="text-red-300 text-sm">{message}</span>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
}
