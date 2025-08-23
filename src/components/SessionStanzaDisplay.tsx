'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, ChevronLeft, ChevronRight, Languages, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface SessionAartiData {
  id: string;
  title: string;
  deity: string;
  lyrics: {
    hinglish: string;
    marathi: string;
  };
}

interface SessionStanzaDisplayProps {
  aarti: SessionAartiData;
  currentStanzaIndex: number;
  onStanzaChange: (index: number) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  showControls: boolean;
  autoScroll?: boolean;
}

export const SessionStanzaDisplay: React.FC<SessionStanzaDisplayProps> = ({
  aarti,
  currentStanzaIndex,
  onStanzaChange,
  onPlayPause,
  isPlaying,
  showControls,
  autoScroll = true
}) => {
  const { isMarathi } = useLanguage();
  const [showTranslation, setShowTranslation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  // Parse lyrics into stanzas
  const parseIntoStanzas = (lyrics: string) => {
    return lyrics.split('\n\n').filter(stanza => stanza.trim().length > 0);
  };

  const hinglishStanzas = parseIntoStanzas(aarti.lyrics.hinglish);
  const marathiStanzas = parseIntoStanzas(aarti.lyrics.marathi);
  const totalStanzas = Math.max(hinglishStanzas.length, marathiStanzas.length);

  const getCurrentStanza = () => {
    const hinglish = hinglishStanzas[currentStanzaIndex] || '';
    const marathi = marathiStanzas[currentStanzaIndex] || '';
    return { hinglish, marathi };
  };

  const currentStanza = getCurrentStanza();

  const handlePrevious = () => {
    if (currentStanzaIndex > 0 && showControls) {
      onStanzaChange(currentStanzaIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStanzaIndex < totalStanzas - 1 && showControls) {
      onStanzaChange(currentStanzaIndex + 1);
    }
  };

  const handleCopyStanza = async () => {
    const text = isMarathi ? currentStanza.marathi : currentStanza.hinglish;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Stanza copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy stanza');
    }
  };

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll) {
      const element = document.getElementById(`stanza-${currentStanzaIndex}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentStanzaIndex, autoScroll]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Aarti Header */}
      <Card className="glass-divine mb-6 border-orange-200/50 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {aarti.title}
          </CardTitle>
          <p className="text-gray-600 text-lg">{aarti.deity} Aarti</p>
        </CardHeader>
      </Card>

      {/* Main Stanza Display */}
      <Card 
        id={`stanza-${currentStanzaIndex}`}
        className="glass-divine border-orange-200/50 shadow-xl mb-6"
      >
        <CardContent className="p-6 sm:p-8">
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Navigation Controls */}
            {showControls && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStanzaIndex === 0}
                  className="glass-divine ripple rounded-full w-10 h-10 p-0 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPlayPause}
                  className="btn-spiritual ripple text-white px-3 sm:px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-1 sm:mr-2" /> : <Play className="h-4 w-4 mr-1 sm:mr-2" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStanzaIndex === totalStanzas - 1}
                  className="glass-divine ripple rounded-full w-10 h-10 p-0 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Stanza Counter */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Badge variant="outline" className="bg-white/80 border-orange-200/50 text-orange-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                {currentStanzaIndex + 1} of {totalStanzas}
              </Badge>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className={`language-tab rounded-2xl px-2 sm:px-3 py-2 transition-all duration-300 hover:scale-105 ${showTranslation ? 'active' : ''}`}
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">
                  {showTranslation ? 'मराठी' : 'English'}
                </span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyStanza}
                className="glass-divine rounded-2xl p-2 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Current Stanza Content */}
          <div className="text-center space-y-6">
            <div 
              className={`whitespace-pre-line leading-relaxed text-gray-800 ${isMarathi ? 'font-devanagari' : 'font-inter'}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {isMarathi ? currentStanza.marathi : currentStanza.hinglish}
            </div>

            {/* Translation */}
            {showTranslation && (
              <>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent mx-auto mb-6"></div>
                <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-2xl p-4 sm:p-6 border border-orange-100/50">
                  <div className="flex items-center justify-center mb-3">
                    <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200/50 rounded-full px-3 py-1 text-xs">
                      {!isMarathi ? 'मराठी Translation' : 'English Translation'}
                    </Badge>
                  </div>
                  <div 
                    className={`whitespace-pre-line leading-relaxed text-gray-700 ${!isMarathi ? 'font-devanagari' : 'font-inter'}`}
                    style={{ fontSize: `${fontSize - 2}px` }}
                  >
                    {!isMarathi ? currentStanza.marathi : currentStanza.hinglish}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="bg-white/60 rounded-2xl p-3 border border-orange-100/50 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs text-gray-600">{Math.round((currentStanzaIndex + 1) / totalStanzas * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-amber-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStanzaIndex + 1) / totalStanzas) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionStanzaDisplay;
