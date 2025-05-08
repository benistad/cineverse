'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DatabaseMigrationPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  React.useEffect(() => {
    if (!user) {
      router.push('/admin');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  const sqlScript = `
-- Migration pour ajouter les colonnes release_date et genres à la table films

-- Ajouter la colonne release_date (date de sortie du film)
ALTER TABLE films ADD COLUMN IF NOT EXISTS release_date DATE;

-- Ajouter la colonne genres (liste des genres du film)
ALTER TABLE films ADD COLUMN IF NOT EXISTS genres TEXT;

-- Commentaires sur les colonnes
COMMENT ON COLUMN films.release_date IS 'Date de sortie officielle du film';
COMMENT ON COLUMN films.genres IS 'Liste des genres du film, séparés par des virgules';
  `;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Migration de la base de données</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        
        <div className="mb-6">
          <p className="mb-4">
            Pour que les fonctionnalités d'affichage des dates de sortie et des genres fonctionnent correctement, 
            vous devez ajouter deux nouvelles colonnes à la table <code className="bg-gray-100 px-1 py-0.5 rounded">films</code> dans votre base de données Supabase.
          </p>
          
          <ol className="list-decimal pl-6 space-y-4 mb-4">
            <li>
              <p>Connectez-vous à votre <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dashboard Supabase</a></p>
            </li>
            <li>
              <p>Sélectionnez votre projet MovieHunt</p>
            </li>
            <li>
              <p>Dans le menu de gauche, cliquez sur <strong>SQL Editor</strong></p>
            </li>
            <li>
              <p>Cliquez sur <strong>+ New Query</strong></p>
            </li>
            <li>
              <p>Copiez et collez le script SQL ci-dessous dans l'éditeur</p>
            </li>
            <li>
              <p>Cliquez sur <strong>Run</strong> pour exécuter la migration</p>
            </li>
            <li>
              <p>Une fois la migration terminée, retournez à la page <Link href="/admin/update-films" className="text-blue-600 hover:underline">Mise à jour des films</Link> et lancez à nouveau la mise à jour</p>
            </li>
          </ol>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Script SQL à exécuter :</h3>
          <div className="bg-gray-800 text-white p-4 rounded-md overflow-auto">
            <pre className="whitespace-pre-wrap">{sqlScript}</pre>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            <strong>Note :</strong> Cette migration est sécuritaire et n'affectera pas vos données existantes. 
            Elle ajoute simplement de nouvelles colonnes à la table films.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Retour au tableau de bord
        </button>
        
        <Link
          href="/admin/update-films"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
        >
          Aller à la page de mise à jour des films
        </Link>
      </div>
    </div>
  );
}
