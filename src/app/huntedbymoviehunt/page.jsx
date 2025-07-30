'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

export default function HuntedByMovieHuntPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Image 
            src="/images/badges/hunted-badge.png" 
            alt="Hunted by MovieHunt Badge" 
            width={200} 
            height={200}
            className="w-auto h-auto"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Hunted by MovieHunt</h1>
        <p className="text-xl text-gray-600 italic">Les Films Qu'il Ne Faut Surtout Pas Rater</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🎯 Découvrez le Badge "Hunted"</h2>
        <p className="mb-4">
          Chez MovieHunt.fr, notre mission est simple : vous aider à trouver l'idée de film parfaite pour chaque moment. 
          Face à la surabondance de contenus, nous savons combien il est difficile de choisir quel film regarder. 
          C'est pourquoi nous lançons aujourd'hui un tout nouveau badge exclusif : le badge "Hunted".
        </p>
      </div>
      
      <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🔥 Qu'est-ce que le badge #HuntedbyMovieHunt ?</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/3 flex justify-center">
            <Image 
              src="/images/badges/hunted-badge.png" 
              alt="Hunted by MovieHunt Badge" 
              width={150} 
              height={150}
              className="w-auto h-auto"
            />
          </div>
          <div className="md:w-2/3">
            <p className="mb-4">
              Le badge Hunted, c'est notre sceau d'approbation. Il s'agit d'un visuel en forme de ticket de cinéma abîmé. 
              Il est posé sur les affiches des films qui méritent réellement votre attention — des œuvres percutantes, 
              mémorables, parfois méconnues, mais toujours incontournables.
            </p>
            <p className="font-medium">
              Quand un film est "Hunted", c'est qu'il a été traqué, sélectionné et validé par notre radar à pépites cinématographiques.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🎬 Pourquoi ce badge ?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Parce que trop de films passent inaperçus.</li>
          <li>Parce qu'il est temps de sortir des sentiers battus.</li>
          <li>Parce que vous cherchez chaque jour quel film regarder — et que nous avons déjà fait le tri pour vous.</li>
        </ul>
      </div>
      
      <div className="bg-purple-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🔍 Où le trouver ?</h2>
        <p className="mb-4">
          Vous retrouverez ce badge sur les affiches des films directement sur notre site :
        </p>
        <div className="flex justify-center mb-4">
          <Link href="/advanced-search?hunted=true" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Voir les films Hunted <FiArrowRight className="ml-2" />
          </Link>
        </div>
        <p className="mb-2">
          Suivez aussi le hashtag #HuntedbyMovieHunt sur Instagram et Twitter pour découvrir les dernières perles que nous avons repérées.
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://instagram.com/explore/tags/huntedbymoviehunt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg">
            <FaInstagram className="mr-2" /> Instagram
          </a>
          <a href="https://twitter.com/hashtag/huntedbymoviehunt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
            <FaTwitter className="mr-2" /> Twitter
          </a>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🧠 En résumé</h2>
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="mb-2 font-medium">Vous cherchez une idée de film originale ?</p>
          <p className="mb-2 font-medium">Vous hésitez sur quel film regarder ce soir ?</p>
          <p className="font-bold text-blue-600">Faites confiance au badge Hunted : un gage de qualité, d'émotion et de surprise.</p>
        </div>
        <p className="text-center text-lg font-bold">
          📌 Rendez-vous sur <a href="https://www.moviehunt.fr" className="text-blue-600 hover:underline">www.moviehunt.fr</a> et laissez-vous guider par la chasse aux chefs-d'œuvre.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">#cinema</span>
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">#movies</span>
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">#film</span>
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">#huntedbymoviehunt</span>
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/advanced-search?hunted=true" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Voir tous les films Hunted <FiArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
