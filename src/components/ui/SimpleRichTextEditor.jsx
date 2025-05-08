'use client';

import { useState, useRef, useEffect } from 'react';

export default function SimpleRichTextEditor({ value, onChange, placeholder = 'Commencez à écrire...' }) {
  const editorRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(value || '');
  
  // Synchroniser la valeur externe avec l'état interne
  useEffect(() => {
    setCurrentValue(value || '');
  }, [value]);
  
  // Mettre à jour le contenu HTML et déclencher l'événement onChange
  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      setCurrentValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };
  
  // Appliquer une commande de formatage
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };
  
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-300">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-1 rounded hover:bg-gray-200"
          title="Gras"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-1 rounded hover:bg-gray-200"
          title="Italique"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="p-1 rounded hover:bg-gray-200"
          title="Souligné"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21"></line>
          </svg>
        </button>
        
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200"
          title="Liste à puces"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Zone d'édition */}
      <div
        ref={editorRef}
        contentEditable
        className="p-3 min-h-[200px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: currentValue }}
        onInput={handleInput}
        placeholder={placeholder}
      />
    </div>
  );
}
