'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Users, 
  Clock,
  Crown,
  Heart,
  Share2,
  Settings,
  ChevronUp,
  ChevronDown,
  Music,
  Mic,
  Eye
} from 'lucide-react';
import { Aarti } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import IOSAartiCard from './IOSAartiCard';

interface IOSSessionViewProps {
  sessionId: string;
  aartis: Aarti[];
  currentIndex: number;
  isPlaying: boolean;
  isCreator: boolean;
  participants: number;
  className?: string;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
}

const IOSSessionView = ({
  sessionId,
  aartis,
  currentIndex,
  isPlaying,
  isCreator,
  participants,
  className = '',
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange
}: IOSSessionViewProps) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showQueue, setShowQueue] = useState(false);
  const [currentStanza, setCurrentStanza] = useState(0);
  const { isMarathi } = useLanguage();

  const currentAarti = aartis[currentIndex];
  const stanzas = currentAarti?.lyrics[isMarathi ? 'marathi' : 'hinglish'].split('\n\n') || [];

  // Simulate progress update
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  if (!currentAarti) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Aarti Selected</h2>
          <p className="text-gray-600">Please select an aarti to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 ${className}`}>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-orange-100 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">Session {sessionId}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{participants}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Live</span>
                  </div>
                  {isCreator && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      Host
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-10 w-10 p-0"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-10 w-10 p-0"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Now Playing Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {/* Current Aarti Display */}
            <div className="p-6">
              <IOSAartiCard
                aarti={currentAarti}
                isSelected={true}
                onSelect={() => {}}
                showSelection={false}
                showPreview={false}
                className="border-0 shadow-none bg-transparent"
              />
            </div>

            {/* Progress Bar */}
            <div className="px-6 pb-4">
              <div className="space-y-2">
                <Slider
                  value={[progress]}
                  onValueChange={(value) => {
                    setProgress(value[0]);
                    onSeek(value[0]);
                  }}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}</span>
                  <span>Stanza {currentStanza + 1} of {stanzas.length}</span>
                  <span>5:30</span>
                </div>
              </div>
            </div>

            {/* Media Controls */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-12 w-12 p-0 bg-orange-100 hover:bg-orange-200"
                  onClick={onPrevious}
                  disabled={currentIndex === 0}
                >
                  <SkipBack className="w-5 h-5 text-orange-700" />
                </Button>
                
                <Button
                  className="rounded-full h-16 w-16 p-0 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
                  onClick={isPlaying ? onPause : onPlay}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-12 w-12 p-0 bg-orange-100 hover:bg-orange-200"
                  onClick={onNext}
                  disabled={currentIndex === aartis.length - 1}
                >
                  <SkipForward className="w-5 h-5 text-orange-700" />
                </Button>
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center gap-3 mt-4">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    onVolumeChange(value[0]);
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-8 text-right">{volume}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Lyrics/Stanza */}
        <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="w-5 h-5 text-orange-500" />
                Current Stanza
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}} // Language toggle will be handled by parent
                className="rounded-full bg-white/50 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                {isMarathi ? 'मर' : 'EN'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
              <p className="text-lg leading-relaxed text-gray-800 text-center whitespace-pre-line">
                {stanzas[currentStanza] || 'No lyrics available'}
              </p>
            </div>
            
            {stanzas.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStanza(Math.max(0, currentStanza - 1))}
                  disabled={currentStanza === 0}
                  className="rounded-full"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-3 py-2">
                  {currentStanza + 1} / {stanzas.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStanza(Math.min(stanzas.length - 1, currentStanza + 1))}
                  disabled={currentStanza === stanzas.length - 1}
                  className="rounded-full"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queue */}
        <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="w-5 h-5 text-orange-500" />
                Queue ({aartis.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQueue(!showQueue)}
                className="rounded-full"
              >
                {showQueue ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          
          {showQueue && (
            <CardContent className="pt-0">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {aartis.map((aarti, index) => (
                    <div
                      key={aarti.id}
                      className={`
                        relative rounded-2xl transition-all duration-200
                        ${index === currentIndex 
                          ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }
                      `}
                    >
                      <IOSAartiCard
                        aarti={aarti}
                        isSelected={index === currentIndex}
                        onSelect={() => {}}
                        showSelection={false}
                        showPreview={true}
                        className="border-0 shadow-none bg-transparent"
                      />
                      
                      {index === currentIndex && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/80 text-gray-700 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          )}
        </Card>

        {/* Creator Controls */}
        {isCreator && (
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Host Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  className="rounded-2xl h-12 bg-white/50 border-orange-200 hover:bg-orange-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Participants
                </Button>
                <Button 
                  variant="outline"
                  className="rounded-2xl h-12 bg-white/50 border-orange-200 hover:bg-orange-50"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Add Aarti
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IOSSessionView;
