'use client';

import { FiFilm, FiMusic, FiEye, FiFeather, FiCamera, FiAward } from 'react-icons/fi';
import { useTranslations } from '@/hooks/useTranslations';

export default function CommentNousTravaillonsPage() {
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('howWeWork.title')}
          </h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        </header>

        {/* Contenu principal */}
        <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 space-y-8">
          {/* Accroche */}
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('howWeWork.intro')}
            </p>
          </section>

          {/* Films connus et méconnus */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <FiFilm className="mr-3 text-indigo-600" />
              {t('howWeWork.knownAndUnknown')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('howWeWork.knownDescription1')}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {t('howWeWork.knownDescription2')}
            </p>
          </section>

          {/* Critères de critique */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FiAward className="mr-3 text-indigo-600" />
              {t('howWeWork.criteria')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('howWeWork.criteriaIntro')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FiFilm className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('howWeWork.direction')}</h3>
                  <p className="text-gray-700">{t('howWeWork.directionDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMusic className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('howWeWork.soundtrack')}</h3>
                  <p className="text-gray-700">{t('howWeWork.soundtrackDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiEye className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('howWeWork.acting')}</h3>
                  <p className="text-gray-700">{t('howWeWork.actingDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiFeather className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('howWeWork.screenplay')}</h3>
                  <p className="text-gray-700">{t('howWeWork.screenplayDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiCamera className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('howWeWork.cinematography')}</h3>
                  <p className="text-gray-700">{t('howWeWork.cinematographyDescription')}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-6">
              {t('howWeWork.criteriaConclusion')}
            </p>
          </section>

          {/* Pourquoi la VO */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-600">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t('howWeWork.whyOV')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('howWeWork.whyOVDescription')}
            </p>
          </section>

          {/* Liste de films qui inspire */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t('howWeWork.inspiringList')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('howWeWork.inspiringDescription')}
            </p>
            <p className="text-lg text-gray-900 font-medium">
              {t('howWeWork.companion')}
            </p>
          </section>

          {/* CTA */}
          <section className="text-center pt-6 border-t border-gray-200">
            <a
              href="/all-films"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t('howWeWork.discoverList')}
            </a>
          </section>
        </article>
      </div>
    </div>
  );
}
