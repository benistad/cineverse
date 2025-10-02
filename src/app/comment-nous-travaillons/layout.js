export const metadata = {
  title: 'MovieHunt – Comment nous choisissons chaque critique de film et idée de film à voir',
  description: 'Découvrez comment MovieHunt sélectionne chaque film : critiques en VO, analyse de la réalisation, du scénario, du jeu des acteurs, de la musique et de la photographie. Trouvez votre prochaine idée de film à voir dans notre liste de films recommandés.',
  keywords: 'critique de film, idée de film à voir, liste de films, film à voir, version originale, VO, réalisation, scénario, photographie, musique de film',
  openGraph: {
    title: 'Comment nous travaillons chez MovieHunt',
    description: 'Découvrez notre méthode de sélection et d\'analyse des films',
    type: 'website',
    url: 'https://www.moviehunt.fr/comment-nous-travaillons',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comment nous travaillons chez MovieHunt',
    description: 'Découvrez notre méthode de sélection et d\'analyse des films',
  },
  alternates: {
    canonical: 'https://www.moviehunt.fr/comment-nous-travaillons',
  },
};

export default function CommentNousTravaillonsLayout({ children }) {
  return children;
}
