import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiMail, FiFilm, FiBell, FiCheck, FiArrowRight } from 'react-icons/fi';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

export const revalidate = 86400; // Revalidate every 24 hours

export const metadata = {
  title: 'Newsletter - Nouveaux films notés',
  description: 'Inscrivez-vous à la newsletter MovieHunt pour recevoir un email à chaque nouveau film noté. Suivez l\'actualité du site et découvrez de nouveaux films à voir.',
  keywords: ['newsletter', 'films', 'nouveautés', 'actualité cinéma', 'MovieHunt'],
  alternates: {
    canonical: 'https://www.moviehunt.fr/newsletter',
  },
  openGraph: {
    title: 'Newsletter - Nouveaux films notés',
    description: 'Inscrivez-vous pour recevoir un email à chaque nouveau film noté sur MovieHunt.',
    url: 'https://www.moviehunt.fr/newsletter',
    type: 'website',
  },
};

async function getFilmStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Get films from the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const { data: films, error } = await supabase
    .from('films')
    .select('id, created_at')
    .gte('created_at', threeMonthsAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error || !films) {
    return { averagePerMonth: 8, totalLast3Months: 24 }; // Fallback values
  }

  const totalLast3Months = films.length;
  const averagePerMonth = Math.round(totalLast3Months / 3);

  return { averagePerMonth, totalLast3Months };
}

export default async function NewsletterPage() {
  const { averagePerMonth, totalLast3Months } = await getFilmStats();

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
          <FiMail className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          La Newsletter MovieHunt
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Recevez un email à chaque nouveau film noté sur le site
        </p>
      </header>

      {/* Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 mb-12 text-white text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div>
            <p className="text-5xl font-bold mb-2">{averagePerMonth}</p>
            <p className="text-indigo-200">emails par mois en moyenne</p>
          </div>
          <div className="hidden md:block w-px h-16 bg-indigo-400"></div>
          <div>
            <p className="text-5xl font-bold mb-2">{totalLast3Months}</p>
            <p className="text-indigo-200">films notés ces 3 derniers mois</p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FiBell className="text-indigo-600" />
          Comment ça fonctionne ?
        </h2>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            La règle est simple : <strong className="text-indigo-700">1 nouveau film noté = 1 newsletter envoyée</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Peu importe la note attribuée au film, qu'elle soit excellente ou décevante, vous recevrez un email. 
            Il ne s'agit pas d'une newsletter de recommandations, mais d'un moyen de <strong>suivre l'actualité du site</strong>{' '}
            sans avoir à venir vérifier régulièrement s'il a été mis à jour.
          </p>
          <p className="text-gray-600 leading-relaxed">
            L'objectif ? Vous permettre de <strong>découvrir de nouveaux films</strong> au fil de nos publications, 
            qu'ils soient connus ou méconnus, toujours dans l'idée de vous aider à trouver votre prochain film à voir.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FiFilm className="text-indigo-600" />
          Pourquoi s'inscrire ?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Ne ratez aucun film</h3>
              <p className="text-gray-600 text-sm">Soyez informé dès qu'un nouveau film est noté sur MovieHunt</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Découvrez des pépites</h3>
              <p className="text-gray-600 text-sm">Films méconnus, classiques oubliés, nouveautés... variez les plaisirs</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Fréquence raisonnable</h3>
              <p className="text-gray-600 text-sm">Environ {averagePerMonth} emails par mois, pas de spam</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Désabonnement facile</h3>
              <p className="text-gray-600 text-sm">Un lien de désabonnement dans chaque email, en un clic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Inscrivez-vous maintenant
        </h2>
        <div className="max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </section>

      {/* Back to home */}
      <div className="text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <FiArrowRight className="rotate-180" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
