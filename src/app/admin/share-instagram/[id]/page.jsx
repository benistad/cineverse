'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { FiCopy, FiDownload, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

// Fonction pour préparer le texte à partager sur Instagram
const prepareInstagramCaption = (film) => {
  const year = film.release_date ? new Date(film.release_date).getFullYear() : '';
  const genres = film.genres ? film.genres.split(',')[0] : '';
  const synopsis = film.synopsis ? film.synopsis.substring(0, 150) + (film.synopsis.length > 150 ? '...' : '') : '';
  
  return `🎥 ${film.title} ${year ? `(${year})` : ''}
🔵 Note: ${film.note_sur_10}/10
${genres ? `🎬 Genre: ${genres}` : ''}
🔍 ${synopsis}

👉 Voir plus sur MovieHunt: https://moviehunt.fr/films/${film.slug || film.id}

#moviehunt #cinema #film #critique`;
};

export default function ShareInstagramPage() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  useEffect(() => {
    async function fetchFilm() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('films')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setFilm(data);
        setCaption(prepareInstagramCaption(data));
        
        // Copier automatiquement le texte dans le presse-papiers
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(prepareInstagramCaption(data));
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du film:', err);
        setError('Impossible de charger les données du film.');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchFilm();
    }
  }, [id]);
  
  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie du texte:', err);
      alert('Impossible de copier le texte. Veuillez le copier manuellement.');
    }
  };
  
  const handleDownloadImage = () => {
    try {
      if (!film || !film.poster_url) return;
      
      const imageUrl = film.poster_url.startsWith('http') 
        ? film.poster_url 
        : `https://www.moviehunt.fr${film.poster_url}`;
      
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${film.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_moviehunt.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error('Erreur lors du téléchargement de l\'image:', err);
      alert('Impossible de télécharger l\'image. Veuillez la télécharger manuellement.');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }
  
  if (error || !film) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Film non trouvé.'}</p>
          <Link href="/admin" className="text-red-700 font-bold underline mt-2 inline-block">
            Retour à l'administration
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href={`/admin/edit-rated/${film.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
          <FiArrowLeft className="mr-2" />
          Retour à l'édition du film
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Partager "{film.title}" sur Instagram</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">1. Télécharger l'affiche</h2>
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto mb-4 border rounded overflow-hidden">
              {film.poster_url && (
                <>
                  <Image
                    src={film.poster_url.startsWith('http') ? film.poster_url : `https://www.moviehunt.fr${film.poster_url}`}
                    alt={film.title}
                    fill
                    className="object-cover"
                  />
                  {film.is_hunted_by_moviehunt && (
                    <div className="absolute top-2 left-2 z-10">
                      {typeof Link !== 'undefined' ? (
                        <Link 
                          href="/huntedbymoviehunt" 
                          className="block transition-transform hover:scale-110"
                          title="En savoir plus sur Hunted by MovieHunt"
                        >
                          <Image 
                            src="/images/badges/hunted-badge.png" 
                            alt="Hunted by MovieHunt" 
                            width={80} 
                            height={80}
                            className="w-auto h-auto cursor-pointer" 
                            style={{ transform: 'scale(0.6)' }}
                          />
                        </Link>
                      ) : (
                        <Image 
                          src="/images/badges/hunted-badge.png" 
                          alt="Hunted by MovieHunt" 
                          width={80} 
                          height={80}
                          className="w-auto h-auto" 
                          style={{ transform: 'scale(0.6)' }}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              onClick={handleDownloadImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
            >
              {downloaded ? <FiCheck className="mr-2" /> : <FiDownload className="mr-2" />}
              {downloaded ? 'Image téléchargée' : 'Télécharger l\'image'}
            </button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Instructions :</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Téléchargez l'affiche du film en cliquant sur le bouton ci-dessus</li>
              <li>Copiez le texte de la légende en cliquant sur le bouton de copie</li>
              <li>Ouvrez Instagram sur votre téléphone ou sur le web</li>
              <li>Créez un nouveau post et sélectionnez l'image téléchargée</li>
              <li>Collez le texte copié dans la section "Légende"</li>
              <li>Publiez votre post</li>
            </ol>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">2. Copier la légende</h2>
            <p className="text-sm text-gray-500 mb-2">Le texte a été automatiquement copié dans votre presse-papiers. Si vous avez besoin de le copier à nouveau, utilisez le bouton ci-dessous.</p>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-4 whitespace-pre-wrap text-sm font-mono">
              {caption}
            </div>
            
            <button
              onClick={handleCopyCaption}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center justify-center"
            >
              {copied ? <FiCheck className="mr-2" /> : <FiCopy className="mr-2" />}
              {copied ? 'Texte copié' : 'Copier le texte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
