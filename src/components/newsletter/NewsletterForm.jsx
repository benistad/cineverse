'use client';

import { useState } from 'react';
import { FiMail, FiCheck, FiLoader } from 'react-icons/fi';

export default function NewsletterForm({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Veuillez entrer une adresse email valide');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Inscription réussie !');
        setEmail('');
        setFirstName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  // Variante compacte pour le footer
  if (variant === 'compact') {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-white mb-3">
          📬 Newsletter
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Recevez nos recommandations de films directement dans votre boîte mail.
        </p>
        
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-lg">
            <FiCheck className="flex-shrink-0" />
            <span className="text-sm">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <FiLoader className="animate-spin" />
                  Inscription...
                </>
              ) : (
                <>
                  <FiMail />
                  S'inscrire
                </>
              )}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm">{message}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // Variante par défaut (plus grande, pour une section dédiée)
  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiMail className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Ne ratez aucun film
        </h2>
        <p className="text-gray-400 mb-6">
          Inscrivez-vous à notre newsletter et recevez nos recommandations de films dès leur publication.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 text-green-400 bg-green-400/10 px-6 py-4 rounded-xl">
            <FiCheck className="w-6 h-6 flex-shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom (optionnel)"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={status === 'loading'}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email *"
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {status === 'loading' ? (
                <>
                  <FiLoader className="animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <FiMail />
                  S'inscrire à la newsletter
                </>
              )}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-2">{message}</p>
            )}
          </form>
        )}
        
        <p className="text-gray-500 text-xs mt-4">
          Pas de spam, uniquement nos meilleures recommandations. Désabonnement en un clic.
        </p>
      </div>
    </div>
  );
}
