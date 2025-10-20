/**
 * Script pour traduire automatiquement le contenu de la page Halloween avec DeepL
 * Usage: node scripts/translate-halloween-page.js
 */

import 'dotenv/config';
import { translateText } from '../src/lib/translation/deepl.js';

// Contenu français à traduire
const frenchContent = {
  films: [
    {
      title: "Funny Games US",
      category: "Le coup de maître",
      description: "Si vous cherchez un film qui vous laisse sans voix, Funny Games US est incontournable. Brutal, dérangeant et sans concession, il bouleverse tous les codes du cinéma d'horreur. Avec sa note parfaite de 10/10, c'est le choix ultime pour un Halloween qui reste gravé dans la mémoire."
    },
    {
      title: "Destination Finale : Bloodlines",
      category: "Les sensations fortes",
      description: "Un retour réussi de la saga culte, avec toujours cette mécanique implacable où le destin frappe de manière inventive et sanglante."
    },
    {
      title: "Until Dawn : La Mort sans fin",
      category: "Les sensations fortes",
      description: "Inspiré de l'univers vidéoludique, ce film mise sur l'immersion et la tension. Une expérience efficace pour ceux qui aiment se sentir au cœur de l'action."
    },
    {
      title: "Heretic",
      category: "La révélation",
      description: "Avec son badge HuntedByMovieHunt, Heretic est un thriller psychologique qui ne ressemble à rien d'autre. Hugh Grant y livre une performance glaçante dans un huis clos oppressant où la foi et la raison s'affrontent."
    },
    {
      title: "1BR : The Apartment",
      category: "L'angoisse psychologique",
      description: "Un immeuble en apparence idéal cache une communauté aux méthodes terrifiantes. Ce film explore les mécanismes de manipulation et de contrôle avec une tension croissante."
    },
    {
      title: "Triangle",
      category: "Le mystère déstabilisant",
      description: "Un yacht, une tempête, un bateau fantôme… et une boucle temporelle cauchemardesque. Triangle est un puzzle horrifique qui ne lâche jamais prise."
    },
    {
      title: "Vivarium",
      category: "L'étrangeté oppressante",
      description: "Un couple se retrouve piégé dans un lotissement surréaliste et sans issue. Vivarium joue sur l'absurde et l'angoisse existentielle avec une efficacité glaçante."
    },
    {
      title: "Barbarian",
      category: "La surprise horrifique",
      description: "Une maison Airbnb réserve bien plus que ce que l'on attend. Barbarian multiplie les rebondissements et les descentes dans l'horreur pure."
    },
    {
      title: "Blood Star",
      category: "L'horreur décalée",
      description: "Un film d'horreur qui mélange humour noir et violence graphique. Blood Star propose une expérience unique, à la fois dérangeante et fascinante."
    },
    {
      title: "Vicious",
      category: "Film Bonus",
      description: "Un thriller horrifique qui joue avec vos peurs intérieures. Polly reçoit une mystérieuse boîte accompagnée d'une consigne étrange : y placer une chose dont elle a besoin, une chose qu'elle déteste et une chose qu'elle aime. Ce rituel se transforme vite en cauchemar où elle doit affronter les ténèbres, non seulement autour d'elle, mais aussi en elle."
    }
  ],
  intro: {
    p1: "Halloween, c'est la nuit idéale pour frissonner devant un bon film d'horreur. Mais plutôt que de revoir toujours les mêmes classiques, pourquoi ne pas plonger dans une sélection originale, mêlant expériences dérangeantes, thrillers psychologiques et découvertes marquantes ?",
    p2: "Sur MovieHunt.fr, nous prenons le temps de visionner chaque film, de les noter selon nos critères (réalisation, scénario, jeu des acteurs, photographie, bande-son et impact émotionnel) et de mettre en avant les véritables pépites grâce au badge HuntedByMovieHunt.",
    p3: "Voici notre liste de films d'horreur à voir pour Halloween 2025."
  },
  conclusion: {
    title: "Conclusion : quelle idée de film d'horreur pour Halloween 2025 ?",
    intro: "Cette année, notre sélection MovieHunt vous propose une palette variée :",
    items: [
      "L'excellence dérangeante avec Funny Games US",
      "Le grand spectacle avec Destination Finale : Bloodlines",
      "Les révélations audacieuses comme Heretic",
      "Les cauchemars psychologiques tels que 1BR ou Triangle",
      "Et des expériences atypiques comme Vivarium ou Barbarian"
    ],
    outro1: "Autant d'idées de films à voir pour Halloween qui transformeront votre soirée en expérience inoubliable.",
    outro2: "Alors, préparez vos pop-corn, baissez les lumières… et laissez la peur vous envelopper.",
    ctaButton: "Découvrez tous nos films d'horreur"
  },
  whatToWatch: {
    title: "Vous ne savez pas quel film regarder ce soir ?",
    text: "Au-delà de l'horreur, découvrez notre sélection variée de pépites méconnues pour tous les goûts : comédies noires, westerns surprenants, thrillers fascinants et bien plus encore. Chaque film est noté, analysé et recommandé par MovieHunt.",
    link: "Découvrez notre guide \"Quel film regarder ce soir ?\" →"
  },
  faq: {
    title: "FAQ – Films d'horreur pour Halloween 2025",
    questions: [
      {
        q: "Quel est le film d'horreur le plus effrayant de cette sélection ?",
        a: "Sans hésiter, Funny Games US, noté 10/10 sur MovieHunt, est le film le plus marquant. Sa mise en scène implacable et son réalisme dérangeant en font une expérience terrifiante, idéale pour Halloween."
      },
      {
        q: "Quels films originaux regarder pour Halloween 2025 ?",
        a: "Si vous voulez sortir des sentiers battus, optez pour Heretic (badge HuntedByMovieHunt) ou 1BR : The Apartment. Ces films ne sont pas de simples divertissements horrifiques : ils plongent dans des thématiques psychologiques et sociales qui laissent une trace durable."
      },
      {
        q: "Quelle est la meilleure idée de film à voir entre amis pour Halloween ?",
        a: "Destination Finale : Bloodlines et Until Dawn sont parfaits à plusieurs : spectaculaires, rythmés et bourrés de scènes qui font sursauter. Ils garantissent une ambiance fun et effrayante."
      },
      {
        q: "Existe-t-il une liste de films d'horreur méconnus à découvrir ?",
        a: "Oui ! Sur MovieHunt.fr, nous mettons en avant des films moins connus mais fascinants, comme Triangle, Vivarium ou encore Blood Star. Ces choix originaux sont parfaits pour surprendre vos invités le soir d'Halloween."
      },
      {
        q: "Où trouver des critiques détaillées de films d'horreur ?",
        a: "Toutes nos critiques de films d'horreur sont disponibles sur MovieHunt.fr. Chaque film est visionné en version originale et évalué selon des critères précis (réalisation, scénario, jeu des acteurs, photographie, musique et impact émotionnel)."
      }
    ]
  }
};

async function translateHalloweenContent() {
  console.log('🎃 Traduction du contenu de la page Halloween avec DeepL...\n');

  const translations = {
    films: [],
    intro: {},
    conclusion: {},
    whatToWatch: {},
    faq: { questions: [] }
  };

  try {
    // Traduire les descriptions de films
    console.log('📽️  Traduction des descriptions de films...');
    for (const film of frenchContent.films) {
      console.log(`   - ${film.title}...`);
      const translatedCategory = await translateText(film.category);
      const translatedDescription = await translateText(film.description);
      
      translations.films.push({
        title: film.title,
        category: translatedCategory,
        description: translatedDescription
      });
      
      // Pause pour respecter les limites de l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Traduire l'intro
    console.log('\n📝 Traduction de l\'introduction...');
    translations.intro.p1 = await translateText(frenchContent.intro.p1);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.intro.p2 = await translateText(frenchContent.intro.p2);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.intro.p3 = await translateText(frenchContent.intro.p3);

    // Traduire la conclusion
    console.log('\n🎬 Traduction de la conclusion...');
    translations.conclusion.title = await translateText(frenchContent.conclusion.title);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.conclusion.intro = await translateText(frenchContent.conclusion.intro);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    translations.conclusion.items = [];
    for (const item of frenchContent.conclusion.items) {
      const translated = await translateText(item);
      translations.conclusion.items.push(translated);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    translations.conclusion.outro1 = await translateText(frenchContent.conclusion.outro1);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.conclusion.outro2 = await translateText(frenchContent.conclusion.outro2);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.conclusion.ctaButton = await translateText(frenchContent.conclusion.ctaButton);

    // Traduire la section "Quel film regarder"
    console.log('\n🎯 Traduction de la section "Quel film regarder"...');
    translations.whatToWatch.title = await translateText(frenchContent.whatToWatch.title);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.whatToWatch.text = await translateText(frenchContent.whatToWatch.text);
    await new Promise(resolve => setTimeout(resolve, 500));
    translations.whatToWatch.link = await translateText(frenchContent.whatToWatch.link);

    // Traduire la FAQ
    console.log('\n❓ Traduction de la FAQ...');
    translations.faq.title = await translateText(frenchContent.faq.title);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (const item of frenchContent.faq.questions) {
      console.log(`   - ${item.q.substring(0, 50)}...`);
      const translatedQ = await translateText(item.q);
      await new Promise(resolve => setTimeout(resolve, 500));
      const translatedA = await translateText(item.a);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      translations.faq.questions.push({
        q: translatedQ,
        a: translatedA
      });
    }

    // Afficher les résultats
    console.log('\n✅ Traduction terminée !\n');
    console.log('📋 Résultats (à copier dans messages/en.json) :\n');
    console.log(JSON.stringify(translations, null, 2));

    return translations;

  } catch (error) {
    console.error('❌ Erreur lors de la traduction:', error);
    throw error;
  }
}

// Exécuter le script
translateHalloweenContent()
  .then(() => {
    console.log('\n✨ Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
