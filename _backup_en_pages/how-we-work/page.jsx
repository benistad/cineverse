'use client';

import { FiFilm, FiMusic, FiEye, FiFeather, FiCamera, FiAward } from 'react-icons/fi';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HowWeWorkPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How We Work
          </h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        </header>

        <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 space-y-8">
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">
              At MovieHunt, we're passionate about cinema and we want to share our discoveries with you. Our goal is simple: help you find exceptional films, whether they're well-known masterpieces or hidden gems you might have missed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <FiFilm className="mr-3 text-indigo-600" />
              Known and Unknown Films
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We don't just focus on blockbusters. While we do review popular films, our real passion lies in discovering and sharing lesser-known gems that deserve your attention.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These hidden treasures often offer unique experiences, original storytelling, and memorable performances that you won't find in mainstream cinema. Our mission is to bring these films to light.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FiAward className="mr-3 text-indigo-600" />
              Our Review Criteria
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Every film we review is analyzed according to several key criteria. Here's what we pay attention to:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FiFilm className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Direction</h3>
                  <p className="text-gray-700">The director's vision, their ability to tell a story visually, and their unique style.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMusic className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Soundtrack</h3>
                  <p className="text-gray-700">The music and sound design that enhance the emotional impact of the film.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiEye className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Acting</h3>
                  <p className="text-gray-700">The performances of the actors and their ability to bring characters to life.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiFeather className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Screenplay</h3>
                  <p className="text-gray-700">The quality of the writing, dialogue, and narrative structure.</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiCamera className="mr-3 mt-1 text-indigo-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Cinematography</h3>
                  <p className="text-gray-700">The visual composition, lighting, and camera work that create the film's aesthetic.</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-6">
              Each film receives a rating out of 10, along with a detailed review explaining what we loved and what could have been better. Our reviews are honest, personal, and free from any studio influence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Original Version?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strongly recommend watching films in their original language with subtitles. Here's why:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You experience the actors' authentic performances and voice work</li>
              <li>The original soundtrack and sound design remain intact</li>
              <li>Cultural nuances and wordplay are preserved</li>
              <li>You get the director's intended viewing experience</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              While dubbed versions can be convenient, they often lose the emotional depth and authenticity of the original performances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Independence
            </h2>
            <p className="text-gray-700 leading-relaxed">
              MovieHunt is completely independent. We don't receive any compensation from studios, distributors, or streaming platforms. Our reviews reflect only our genuine opinions and passion for cinema. This independence allows us to be completely honest in our recommendations and criticisms.
            </p>
          </section>

          <section className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MovieHunt is more than just a review site—it's a community of film lovers. We're here to help you discover your next favorite movie, whether it's a recent release or a forgotten classic.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Have a film recommendation or want to share your thoughts? We'd love to hear from you!
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
