'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { useTranslations } from '@/hooks/useTranslations';

export default function HuntedByMovieHuntPage() {
  const { t } = useTranslations();
  
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-indigo-800">{t('hunted.title')}</h1>
        <p className="text-xl text-gray-600 italic">{t('hunted.subtitle')}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('hunted.discoverBadge')}</h2>
        <p className="mb-4">
          {t('hunted.discoverDescription')}
        </p>
      </div>
      
      <div className="bg-indigo-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('hunted.whatIs')}</h2>
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
              {t('hunted.whatIsDescription1')}
            </p>
            <p className="font-medium">
              {t('hunted.whatIsDescription2')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('hunted.why')}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('hunted.whyReason1')}</li>
          <li>{t('hunted.whyReason2')}</li>
          <li>{t('hunted.whyReason3')}</li>
        </ul>
      </div>
      
      <div className="bg-purple-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('hunted.whereToFind')}</h2>
        <p className="mb-4">
          {t('hunted.whereDescription')}
        </p>
        <div className="flex justify-center mb-4">
          <Link href="/advanced-search?hunted=true" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            {t('hunted.seeHuntedFilms')} <FiArrowRight className="ml-2" />
          </Link>
        </div>
        <p className="mb-2">
          {t('hunted.followHashtag')}
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://instagram.com/explore/tags/huntedbymoviehunt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg">
            <FaInstagram className="mr-2" /> Instagram
          </a>
          <a href="https://twitter.com/hashtag/huntedbymoviehunt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg">
            <FaTwitter className="mr-2" /> Twitter
          </a>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('hunted.summary')}</h2>
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="mb-2 font-medium">{t('hunted.summaryQuestion1')}</p>
          <p className="mb-2 font-medium">{t('hunted.summaryQuestion2')}</p>
          <p className="font-bold text-indigo-600">{t('hunted.summaryAnswer')}</p>
        </div>
        <p className="text-center text-lg font-bold">
          {t('hunted.visitSite')}
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
          {t('hunted.seeAll')} <FiArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
