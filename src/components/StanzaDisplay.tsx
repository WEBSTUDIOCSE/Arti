'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AartiStanza } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatStanzaText } from '@/utils/stanzaParser';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  Languages,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface StanzaDisplayProps {
  stanzas: AartiStanza[];
  isPlaying: boolean;
  currentStanzaIndex: number;
  fontSize: number;
  onStanzaChange: (index: number) => void;
  onPlayPause: () => void;
  onFontSizeChange: (size: number) => void;
}

export const StanzaDisplay: React.FC<StanzaDisplayProps> = ({
  stanzas,
  isPlaying,
  currentStanzaIndex,
  fontSize,
  onStanzaChange,
  onPlayPause,
  onFontSizeChange
}) => {
  const { isMarathi } = useLanguage();
  const [showTranslation, setShowTranslation] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'split' | 'all'>('single');
  
  const currentStanzaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current stanza
  useEffect(() => {
    if (autoScroll && currentStanzaRef.current) {
      currentStanzaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentStanzaIndex, autoScroll]);

  const getCurrentStanza = () => stanzas[currentStanzaIndex] || stanzas[0];
  const currentStanza = getCurrentStanza();

  const handlePrevious = () => {
    if (currentStanzaIndex > 0) {
      onStanzaChange(currentStanzaIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStanzaIndex < stanzas.length - 1) {
      onStanzaChange(currentStanzaIndex + 1);
    }
  };

  const handleStanzaClick = (index: number) => {
    onStanzaChange(index);
  };

  const handleCopyStanza = async () => {
    if (currentStanza) {
      const text = isMarathi ? currentStanza.marathi : currentStanza.hinglish;
      const formattedText = formatStanzaText(text);
      
      try {
        await navigator.clipboard.writeText(formattedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Stanza copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy stanza');
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Single stanza view
  if (viewMode === 'single') {
    return (
      <div ref={containerRef} className={`stanza-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        {/* Control Bar */}
        <Card className="glass-divine border-0 mb-4 rounded-2xl shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              {/* Navigation Controls */}
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
                  disabled={currentStanzaIndex === stanzas.length - 1}
                  className="glass-divine ripple rounded-full w-10 h-10 p-0 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Stanza Counter */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge variant="outline" className="bg-white/80 border-orange-200/50 text-orange-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {currentStanzaIndex + 1} of {stanzas.length}
                </Badge>
                
                {currentStanza.isChorus && (
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200/50 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm">
                    Chorus
                  </Badge>
                )}
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
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('all')}
                  className="glass-divine rounded-2xl px-2 sm:px-3 py-2 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-xs sm:text-sm">View All</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Stanza Display */}
        <Card className="glass-divine border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div 
              ref={currentStanzaRef}
              className={`text-center transition-all duration-500 ${currentStanza.isChorus ? 'chorus-highlight' : ''}`}
            >
              {/* Primary Language */}
              <div 
                className={`whitespace-pre-line leading-relaxed lyrics-text ${isMarathi ? 'font-devanagari' : 'font-inter'} mb-6`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {formatStanzaText(isMarathi ? currentStanza.marathi : currentStanza.hinglish)}
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
                      {formatStanzaText(!isMarathi ? currentStanza.marathi : currentStanza.hinglish)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-4 bg-white/60 rounded-2xl p-3 border border-orange-100/50 shadow-sm">
          <div className="flex gap-1">
            {stanzas.map((stanza, index) => (
              <button
                key={stanza.id}
                onClick={() => handleStanzaClick(index)}
                className={`flex-1 h-2 rounded-full transition-all duration-500 hover:h-3 ${
                  index === currentStanzaIndex 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm' 
                    : index < currentStanzaIndex 
                      ? 'bg-gradient-to-r from-orange-300 to-amber-300' 
                      : 'bg-gray-200 hover:bg-gray-300'
                } ${stanza.isChorus ? 'ring-1 ring-amber-400 ring-offset-1' : ''}`}
                title={`Stanza ${index + 1}${stanza.isChorus ? ' (Chorus)' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // All stanzas view
  if (viewMode === 'all') {
    return (
      <div ref={containerRef} className="stanza-container">
        {/* Control Bar */}
        <Card className="glass-divine border-0 mb-4 rounded-2xl shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('single')}
                  className="glass-divine rounded-2xl px-3 py-2 border-orange-200/50 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Single View</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPlayPause}
                  className="btn-spiritual text-white px-3 sm:px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-1 sm:mr-2" /> : <Play className="h-4 w-4 mr-1 sm:mr-2" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`language-tab rounded-2xl px-2 sm:px-3 py-2 transition-all duration-300 hover:scale-105 ${showTranslation ? 'active' : ''}`}
                >
                  <Languages className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">{showTranslation ? 'Hide' : 'Show'} Translation</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Stanzas */}
        <div className="space-y-4 sm:space-y-6">
          {stanzas.map((stanza, index) => (
            <Card 
              key={stanza.id}
              ref={index === currentStanzaIndex ? currentStanzaRef : null}
              className={`glass-divine border-0 transition-all duration-500 rounded-3xl overflow-hidden cursor-pointer ${
                index === currentStanzaIndex 
                  ? 'ring-2 ring-orange-300 shadow-2xl scale-[1.02] bg-gradient-to-r from-orange-50/80 to-amber-50/80' 
                  : 'hover:shadow-xl hover:scale-[1.01]'
              } ${stanza.isChorus ? 'chorus-highlight' : ''}`}
              onClick={() => handleStanzaClick(index)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <Badge 
                    variant={index === currentStanzaIndex ? "default" : "outline"}
                    className={`rounded-full px-3 py-1 text-xs sm:text-sm transition-all duration-300 ${
                      index === currentStanzaIndex 
                        ? "btn-spiritual text-white shadow-lg" 
                        : "border-orange-200/50 text-orange-700 hover:border-orange-300"
                    }`}
                  >
                    Stanza {index + 1}
                  </Badge>
                  
                  {stanza.isChorus && (
                    <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200/50 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-sm">
                      Chorus
                    </Badge>
                  )}
                </div>

                {/* Primary Language */}
                <div 
                  className={`whitespace-pre-line leading-relaxed lyrics-text transition-all duration-300 ${isMarathi ? 'font-devanagari' : 'font-inter'} mb-4`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {formatStanzaText(isMarathi ? stanza.marathi : stanza.hinglish)}
                </div>

                {/* Translation */}
                {showTranslation && (
                  <>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent mb-3"></div>
                    <div className="bg-gradient-to-r from-orange-50/30 to-amber-50/30 rounded-2xl p-3 sm:p-4 border border-orange-100/30">
                      <div 
                        className={`whitespace-pre-line leading-relaxed text-gray-600 italic ${!isMarathi ? 'font-devanagari' : 'font-inter'}`}
                        style={{ fontSize: `${fontSize - 2}px` }}
                      >
                        {formatStanzaText(!isMarathi ? stanza.marathi : stanza.hinglish)}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
