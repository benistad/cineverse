/**
 * Script pour générer les redirections des anciens slugs vers les nouveaux
 * À ajouter dans next.config.js
 */

const redirects = [
  { source: '/films/-contresens-londres', destination: '/films/a-contre-sens-londres', permanent: true },
  { source: '/films/-couteaux-tirs', destination: '/films/a-couteaux-tires', permanent: true },
  { source: '/films/-louest-rien-de-nouveau', destination: '/films/a-louest-rien-de-nouveau', permanent: true },
  { source: '/films/avalonia-ltrange-voyage', destination: '/films/avalonia-letrange-voyage', permanent: true },
  { source: '/films/downton-abbey-ii-une-nouvelle-re', destination: '/films/downton-abbey-ii-une-nouvelle-ere', permanent: true },
  { source: '/films/glass-onion-une-histoire-couteaux-tirs', destination: '/films/glass-onion-une-histoire-a-couteaux-tires', permanent: true },
  { source: '/films/indiana-jones-et-le-cadran-de-la-destine', destination: '/films/indiana-jones-et-le-cadran-de-la-destinee', permanent: true },
  { source: '/films/jur-n2', destination: '/films/jure-n2', permanent: true },
  { source: '/films/jusquau-bout-du-rve', destination: '/films/jusquau-bout-du-reve', permanent: true },
  { source: '/films/le-got-de-la-haine', destination: '/films/le-gout-de-la-haine', permanent: true },
  { source: '/films/le-manoir-hant', destination: '/films/le-manoir-hante', permanent: true },
  { source: '/films/le-monde-aprs-nous', destination: '/films/le-monde-apres-nous', permanent: true },
  { source: '/films/le-secret-de-khops', destination: '/films/le-secret-de-kheops', permanent: true },
  { source: '/films/le-secret-de-la-cit-perdue', destination: '/films/le-secret-de-la-cite-perdue', permanent: true },
  { source: '/films/ltau-de-munich', destination: '/films/letau-de-munich', permanent: true },
  { source: '/films/lun-des-ntres', destination: '/films/lun-des-notres', permanent: true },
  { source: '/films/mad-max-2-le-dfi', destination: '/films/mad-max-2-le-defi', permanent: true },
  { source: '/films/mad-max-au-del-du-dme-du-tonnerre', destination: '/films/mad-max-au-dela-du-dome-du-tonnerre', permanent: true },
  { source: '/films/mystre-venise', destination: '/films/mystere-a-venise', permanent: true },
  { source: '/films/pre-stu-un-hros-pas-comme-les-autres', destination: '/films/pere-stu-un-heros-pas-comme-les-autres', permanent: true },
  { source: '/films/wish-asha-et-la-bonne-toile', destination: '/films/wish-asha-et-la-bonne-etoile', permanent: true },
];

console.log('// Ajoutez ces redirections dans next.config.js dans la section async redirects():\n');
console.log(JSON.stringify(redirects, null, 2));
console.log('\n// Total:', redirects.length, 'redirections');
