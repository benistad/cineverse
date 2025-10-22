'use client';

import { useState, useId } from 'react';

export default function SimpleRichTextEditor({ value, onChange, placeholder = 'Commencez à écrire...' }) {
  const [text, setText] = useState(value || '');
  const [previewMode, setPreviewMode] = useState(false);
  const editorId = useId(); // ID unique pour chaque instance
  
  // Gérer les changements de texte
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (onChange) {
      onChange(newText);
    }
  };
  
  // Insérer du texte formaté à la position du curseur
  const insertFormatting = (startTag, endTag) => {
    const textarea = document.getElementById(editorId);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = beforeText + startTag + selectedText + endTag + afterText;
    setText(newText);
    if (onChange) {
      onChange(newText);
    }
    
    // Remettre le focus sur le textarea et positionner le curseur après le texte formaté
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + startTag.length + selectedText.length + endTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  // Fonctions de formatage
  const makeBold = () => insertFormatting('<strong>', '</strong>');
  const makeItalic = () => insertFormatting('<em>', '</em>');
  const makeUnderline = () => insertFormatting('<u>', '</u>');
  const addBulletList = () => {
    const textarea = document.getElementById(editorId);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText;
    
    if (selectedText.trim() === '') {
      // Si aucun texte n'est sélectionné, ajouter une puce simple
      newText = beforeText + '• ' + afterText;
      
      // Mettre à jour le texte
      setText(newText);
      if (onChange) {
        onChange(newText);
      }
      
      // Positionner le curseur après la puce
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + 2; // Après '• '
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // Transformer chaque ligne du texte sélectionné en ligne avec puce
      const lines = selectedText.split('\n');
      const bulletedLines = lines.map(line => {
        if (line.trim() !== '') {
          return '• ' + line.trim();
        }
        return line;
      }).join('\n');
      
      newText = beforeText + bulletedLines + afterText;
      
      // Mettre à jour le texte
      setText(newText);
      if (onChange) {
        onChange(newText);
      }
      
      // Positionner le curseur après le texte formaté
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + bulletedLines.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };
  
  // Convertir le HTML en texte brut pour l'affichage dans le textarea
  const getPlainText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };
  
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-300">
        <button
          type="button"
          onClick={makeBold}
          className="p-1 rounded hover:bg-gray-200"
          title="Gras"
          disabled={previewMode}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        
        <button
          type="button"
          onClick={makeItalic}
          className="p-1 rounded hover:bg-gray-200"
          title="Italique"
          disabled={previewMode}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        
        <button
          type="button"
          onClick={makeUnderline}
          className="p-1 rounded hover:bg-gray-200"
          title="Souligné"
          disabled={previewMode}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21"></line>
          </svg>
        </button>
        
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={addBulletList}
          className="p-1 rounded hover:bg-gray-200"
          title="Liste à puces"
          disabled={previewMode}
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
        
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`px-2 py-1 rounded text-xs ${previewMode ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        >
          {previewMode ? 'Éditer' : 'Aperçu'}
        </button>
      </div>
      
      {/* Zone d'édition ou aperçu */}
      {previewMode ? (
        <div 
          className="p-3 min-h-[200px] prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: text
            .replace(/^• (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
            .replace(/<\/ul>\n<ul>/g, '\n')
          }}
        />
      ) : (
        <textarea
          id={editorId}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          className="p-3 min-h-[200px] w-full focus:outline-none resize-y font-mono"
          dir="ltr"
        />
      )}
    </div>
  );
}
