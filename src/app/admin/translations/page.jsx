'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FiGlobe, FiEdit2, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

export default function TranslationsPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [translation, setTranslation] = useState({
    title: '',
    synopsis: '',
    why_watch_content: '',
    what_we_didnt_like: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      // Récupérer tous les films avec les champs nécessaires
      const { data: filmsData, error: filmsError } = await supabase
        .from('films')
        .select('id, title, slug, why_watch_content, not_liked_content, why_watch_enabled, not_liked_enabled')
        .order('title');

      if (filmsError) throw filmsError;

      // Récupérer toutes les traductions anglaises
      const { data: translationsData } = await supabase
        .from('film_translations')
        .select('film_id')
        .eq('locale', 'en');

      // Créer un set des films traduits
      const translatedFilmIds = new Set(
        translationsData?.map(t => t.film_id) || []
      );

      // Marquer les films qui ont une traduction et trier (non traduits en premier)
      const filmsWithStatus = filmsData.map(film => ({
        ...film,
        hasTranslation: translatedFilmIds.has(film.id)
      })).sort((a, b) => {
        // Trier : films non traduits en premier
        if (a.hasTranslation === b.hasTranslation) {
          return a.title.localeCompare(b.title);
        }
        return a.hasTranslation ? 1 : -1;
      });

      setFilms(filmsWithStatus);
    } catch (error) {
      console.error('Error loading films:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des films' });
    } finally {
      setLoading(false);
    }
  };

  const loadTranslation = async (film) => {
    try {
      setSelectedFilm(film);

      const { data, error } = await supabase
        .from('film_translations')
        .select('*')
        .eq('film_id', film.id)
        .eq('locale', 'en')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setTranslation({
          title: data.title || '',
          synopsis: data.synopsis || '',
          why_watch_content: data.why_watch_content || '',
          what_we_didnt_like: data.what_we_didnt_like || ''
        });
      } else {
        // Pas de traduction, pré-remplir avec les champs français du film
        setTranslation({
          title: '',
          synopsis: '',
          why_watch_content: film.why_watch_enabled ? (film.why_watch_content || '') : '',
          what_we_didnt_like: film.not_liked_enabled ? (film.not_liked_content || '') : ''
        });
      }
    } catch (error) {
      console.error('Error loading translation:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement de la traduction' });
    }
  };

  const autoTranslate = async () => {
    if (!selectedFilm) return;

    try {
      setSaving(true);
      setMessage({ type: 'info', text: 'Traduction automatique en cours...' });

      const response = await fetch('/api/translate-film', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filmId: selectedFilm.id }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la traduction automatique');
      }

      const data = await response.json();

      // Recharger le film depuis la base pour avoir les données à jour
      const { data: updatedFilm, error: filmError } = await supabase
        .from('films')
        .select('id, title, slug, why_watch_content, not_liked_content, why_watch_enabled, not_liked_enabled')
        .eq('id', selectedFilm.id)
        .single();

      if (filmError) throw filmError;

      // Charger la traduction générée avec le film à jour
      await loadTranslation(updatedFilm);

      setMessage({ type: 'success', text: '✨ Traduction automatique réussie ! (TMDB + DeepL)' });
      
      // Recharger la liste des films
      await loadFilms();
    } catch (error) {
      console.error('Error auto-translating:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la traduction automatique' });
    } finally {
      setSaving(false);
    }
  };

  const saveTranslation = async () => {
    if (!selectedFilm) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('film_translations')
        .upsert({
          film_id: selectedFilm.id,
          locale: 'en',
          ...translation
        }, {
          onConflict: 'film_id,locale'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Traduction sauvegardée avec succès !' });
      
      // Recharger la liste des films pour mettre à jour le statut
      await loadFilms();
      
      // Fermer le formulaire après 2 secondes
      setTimeout(() => {
        setSelectedFilm(null);
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error('Error saving translation:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiGlobe className="mr-3" />
          Gestion des traductions
        </h1>
        <p className="mt-2 text-gray-600">
          Gérez les traductions anglaises des films. Les films avec une icône verte ont déjà une traduction.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Liste des films */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Films ({films.length})</h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center text-orange-600">
                <FiAlertCircle className="mr-1" />
                {films.filter(f => !f.hasTranslation).length} à traduire
              </span>
              <span className="flex items-center text-green-600">
                <FiCheck className="mr-1" />
                {films.filter(f => f.hasTranslation).length} traduits
              </span>
            </div>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {films.map(film => (
              <button
                key={film.id}
                onClick={() => loadTranslation(film)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedFilm?.id === film.id
                    ? 'bg-indigo-100 border-2 border-indigo-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="font-medium">{film.title}</span>
                {film.hasTranslation && (
                  <FiCheck className="text-green-600 flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire de traduction */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {selectedFilm ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Traduction anglaise : {selectedFilm.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre (EN)
                  </label>
                  <input
                    type="text"
                    value={translation.title}
                    onChange={(e) => setTranslation({ ...translation, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="English title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Synopsis (EN)
                  </label>
                  <textarea
                    value={translation.synopsis}
                    onChange={(e) => setTranslation({ ...translation, synopsis: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="English synopsis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pourquoi regarder (EN)
                  </label>
                  <textarea
                    value={translation.why_watch_content}
                    onChange={(e) => setTranslation({ ...translation, why_watch_content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Why watch this film (English)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ce qu'on n'a pas aimé (EN)
                  </label>
                  <textarea
                    value={translation.what_we_didnt_like}
                    onChange={(e) => setTranslation({ ...translation, what_we_didnt_like: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="What we didn't like (English)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={autoTranslate}
                    disabled={saving}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Traduction automatique via TMDB + DeepL"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traduction...
                      </>
                    ) : (
                      <>
                        <FiGlobe className="mr-2" />
                        ✨ Auto-traduire
                      </>
                    )}
                  </button>
                  <button
                    onClick={saveTranslation}
                    disabled={saving}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilm(null);
                      setMessage(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <FiX className="mr-2" />
                    Annuler
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <FiGlobe className="mx-auto text-4xl mb-4" />
              <p>Sélectionnez un film pour gérer sa traduction</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
