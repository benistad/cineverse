'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FiGlobe, FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LanguageSelector() {
  const { locale, changeLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLocale(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-indigo-700 hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <FiGlobe className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-200 z-50">
          <div className="py-1" role="menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                  locale === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <span className="flex items-center space-x-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
                {locale === lang.code && <FiCheck className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
