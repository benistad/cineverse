'use client';

import { FiLink, FiExternalLink } from 'react-icons/fi';

export default function AnnuairesPage() {
  // Liste des liens retour pour les annuaires
  const directoryLinks = [
    {
      name: "Annuaire de Max",
      url: "https://www.maxannu.com/",
      description: "Annuaire généraliste"
    },
    {
      name: "Annuaire de Max - Cinéma",
      url: "https://www.maxannu.com/cinema/",
      description: "Catégorie cinéma de l'annuaire"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-800 text-white">
            <h1 className="text-xl font-semibold flex items-center">
              <FiLink className="mr-2" /> Liens Retour Annuaires
            </h1>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Cette page contient les liens retour pour les annuaires partenaires. Ces liens sont importants pour le référencement du site.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {directoryLinks.map((link, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {link.url}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{link.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          Visiter <FiExternalLink className="ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Code HTML des liens retour</h2>
              <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                <pre className="text-sm text-gray-700">
                  {directoryLinks.map(link => (
                    `<a href="${link.url}">${link.name}</a>\n`
                  )).join('')}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
