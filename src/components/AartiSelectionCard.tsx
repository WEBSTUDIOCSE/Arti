'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Clock, Users, Star, Heart } from 'lucide-react';
import { Aarti, DeityType } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';

interface AartiSelectionCardProps {
  aarti: Aarti;
  isSelected: boolean;
  onSelect: (aarti: Aarti) => void;
  multiSelect?: boolean;
  showPreview?: boolean;
}

const AartiSelectionCard = ({ 
  aarti, 
  isSelected, 
  onSelect, 
  multiSelect = false,
  showPreview = false 
}: AartiSelectionCardProps) => {
  const { isMarathi } = useLanguage();
  const [showLyrics, setShowLyrics] = useState(false);

  const title = isMarathi ? aarti.title.marathi : aarti.title.hinglish;
  const lyrics = isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish;
  
  // Get first few lines for preview
  const previewLyrics = lyrics.split('\n').slice(0, 2).join('\n');
  const fullLyricsLines = lyrics.split('\n').filter(line => line.trim());

  return (
    <Card 
      className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-orange-400 border-orange-300 bg-orange-50/50' 
          : 'border-amber-200 hover:border-amber-300'
      }`}
      onClick={() => onSelect(aarti)}
    >
      {multiSelect && (
        <div className="absolute top-3 right-3 z-10">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(aarti)}
            className="border-orange-300 data-[state=checked]:bg-orange-500"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-800 truncate">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className="text-xs bg-amber-100 text-amber-800 border-amber-300"
              >
                {aarti.deity.charAt(0).toUpperCase() + aarti.deity.slice(1)}
              </Badge>
              {aarti.isPopular && (
                <Badge variant="outline" className="text-xs bg-pink-100 text-pink-800 border-pink-300">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  aarti.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-300' :
                  aarti.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                  'bg-red-100 text-red-800 border-red-300'
                }`}
              >
                {aarti.difficulty}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Preview lyrics */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {showLyrics ? lyrics : previewLyrics}
            {!showLyrics && fullLyricsLines.length > 2 && '...'}
          </p>
          
          {fullLyricsLines.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowLyrics(!showLyrics);
              }}
              className="mt-2 h-6 text-xs text-orange-600 hover:text-orange-700 p-0"
            >
              {showLyrics ? 'Show less' : `Show all ${fullLyricsLines.length} lines`}
            </Button>
          )}
        </div>

        {/* Tags */}
        {aarti.tags && aarti.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {aarti.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-600"
              >
                {tag}
              </Badge>
            ))}
            {aarti.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{aarti.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span>Listen</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{Math.floor(Math.random() * 100) + 50}</span>
            </div>
          </div>
          
          {isSelected && (
            <Badge className="bg-orange-500 text-white text-xs">
              Selected
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AartiSelectionCard;
