'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, ChevronLeft, ChevronRight, Languages, Copy, Check, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AartiStanzaDisplay from './AartiStanzaDisplay';

interface EnhancedSessionAartiData {
  id: string;
  title: string;
  deity: string;
  lyrics: {
    hinglish: string;
    marathi: string;
  };
}

interface EnhancedSessionStanzaDisplayProps {
  aarti: EnhancedSessionAartiData;
  currentStanzaIndex: number;
  onStanzaChange: (index: number) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  showControls: boolean;
  autoScroll?: boolean;
}

const EnhancedSessionStanzaDisplay = ({
  aarti,
  currentStanzaIndex,
  onStanzaChange,
  onPlayPause,
  isPlaying,
  showControls,
  autoScroll = true
}: EnhancedSessionStanzaDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { isMarathi, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(isMarathi ? 'en' : 'mr');
  };
  const currentStanzaRef = useRef<HTMLDivElement>(null);

  const lyrics = isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish;
  const stanzas = lyrics.split('\n\n').filter(stanza => stanza.trim());
  
  // Auto-scroll to current stanza
  useEffect(() => {
    if (autoScroll && currentStanzaRef.current) {
      currentStanzaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentStanzaIndex, autoScroll]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics);
      setCopied(true);
      toast.success('Aarti lyrics copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy lyrics');
    }
  };

  const goToStanza = (index: number) => {
    if (showControls && index >= 0 && index < stanzas.length) {
      onStanzaChange(index);
    }
  };

  const formatStanzaText = (stanza: string) => {
    return stanza.split('\n').map((line, index) => (
      <div key={index} className="leading-relaxed">
        {line.trim() || <br />}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-lg border-amber-200 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2 truncate">
                {aarti.title}
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  {aarti.deity}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${
                    isPlaying 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  {isPlaying ? 'Playing' : 'Paused'}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  Stanza {currentStanzaIndex + 1} of {stanzas.length}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="hover:bg-orange-50"
              >
                <Languages className="h-4 w-4 mr-2" />
                {isMarathi ? 'मराठी' : 'Hinglish'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="hover:bg-orange-50"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Control Panel */}
        {showControls && (
          <CardContent className="pt-0 pb-4">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStanza(0)}
                    disabled={currentStanzaIndex === 0}
                    className="hover:bg-orange-100"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStanza(currentStanzaIndex - 1)}
                    disabled={currentStanzaIndex === 0}
                    className="hover:bg-orange-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={onPlayPause}
                    className={`${
                      isPlaying
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white`}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStanza(currentStanzaIndex + 1)}
                    disabled={currentStanzaIndex === stanzas.length - 1}
                    className="hover:bg-orange-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStanza(stanzas.length - 1)}
                    disabled={currentStanzaIndex === stanzas.length - 1}
                    className="hover:bg-orange-100"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Volume2 className="h-4 w-4" />
                  <span>Host controls - Everyone follows your lead</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Complete Aarti Display - All Stanzas */}
      <Card className="bg-white/90 backdrop-blur-lg border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 text-center">Complete Aarti</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AartiStanzaDisplay
            lyrics={lyrics}
            fontSize={18}
            nightMode={false}
            contentLanguage={isMarathi ? 'marathi' : 'hinglish'}
            maxHeight="none"
            showAllStanzas={true}
            autoScroll={autoScroll}
            currentStanza={currentStanzaIndex}
            className="w-full"
            compact={false}
          />
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card className="bg-white/90 backdrop-blur-lg border-amber-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStanzaIndex + 1) / stanzas.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStanzaIndex + 1) / stanzas.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSessionStanzaDisplay;
