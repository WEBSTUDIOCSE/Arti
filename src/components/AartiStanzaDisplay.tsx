'use client';

import React from 'react';

interface AartiStanzaDisplayProps {
  lyrics: string;
  fontSize?: number;
  nightMode?: boolean;
  contentLanguage?: 'hinglish' | 'marathi';
  maxHeight?: string;
  showAllStanzas?: boolean;
  autoScroll?: boolean;
  currentStanza?: number;
  className?: string;
  compact?: boolean;
}

const AartiStanzaDisplay: React.FC<AartiStanzaDisplayProps> = ({
  lyrics,
  fontSize = 14,
  nightMode = false,
  contentLanguage = 'hinglish',
  maxHeight = '320px',
  showAllStanzas = true,
  autoScroll = false,
  currentStanza = 0,
  className = '',
  compact = true
}) => {
  // Split by double line breaks for stanzas
  const stanzas = lyrics.split('\\n\\n').filter(stanza => stanza.trim() !== '');
  
  // Show only first 3 stanzas if showAllStanzas is false
  const displayStanzas = showAllStanzas ? stanzas : stanzas.slice(0, 3);
  
  return (
    <div 
      className={`w-full px-2 ${className}`} 
      style={{ maxHeight, overflowY: 'auto' }}
    >
      <div className="space-y-3">
        {displayStanzas.map((stanza, stanzaIndex) => {
          const lines = stanza.split('\\n').filter(line => line.trim() !== '');
          
          return (
            <div 
              id={`stanza-${stanzaIndex}`}
              key={stanzaIndex} 
              className={`p-3 rounded-lg transition-all duration-500 border ${
                currentStanza === stanzaIndex && autoScroll
                  ? nightMode 
                    ? 'bg-orange-900/20 ring-1 ring-orange-400/30 border-orange-400/30' 
                    : 'bg-orange-50 ring-1 ring-orange-300/50 border-orange-300/50'
                  : nightMode 
                    ? 'hover:bg-gray-800/10 bg-gray-800/5 border-gray-700/20' 
                    : 'hover:bg-orange-25 bg-white/60 border-orange-200/40'
              }`}
            >
              {/* Traditional Stanza Header with Indian Design */}
              <div className="flex items-center justify-center mb-2">
                <div className={`flex items-center space-x-2 ${
                  nightMode ? 'text-orange-300' : 'text-orange-600'
                }`}>
                  {/* Left Om Symbol */}
                  <span className="text-sm">॥</span>
                  
                  {/* Stanza Number */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    nightMode 
                      ? 'bg-orange-900/30 text-orange-200' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {stanzaIndex + 1}
                  </span>
                  
                  {/* Right Om Symbol */}
                  <span className="text-sm">॥</span>
                </div>
              </div>
              
              {/* Traditional Stanza Layout - Compact and Clean */}
              <div className="space-y-1">
                {lines.map((line, lineIndex) => (
                  <div 
                    key={lineIndex} 
                    className={`text-center transition-colors duration-300 ${
                      contentLanguage === 'marathi' 
                        ? 'font-serif tracking-wide' 
                        : 'font-medium tracking-wide'
                    } ${
                      nightMode 
                        ? 'text-gray-100' 
                        : 'text-gray-800'
                    }`}
                    style={{ 
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.4,
                      letterSpacing: '0.02em'
                    }}
                  >
                    {line.trim()}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Show remaining stanzas count if not showing all */}
        {!showAllStanzas && stanzas.length > 3 && (
          <div className="text-center py-2">
            <div className={`text-xs ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ... and {stanzas.length - 3} more stanzas
            </div>
          </div>
        )}
        
        {/* Traditional Closing - only show if displaying all stanzas */}
        {showAllStanzas && (
          <div className="text-center pt-3 pb-1">
            <div className={`text-lg ${
              nightMode ? 'text-orange-300' : 'text-orange-600'
            }`}>
              ॥ श्री हरि ॥
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AartiStanzaDisplay;
