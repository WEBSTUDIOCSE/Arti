'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Heart, Star, Eye, ChevronRight, Sparkles, Clock } from 'lucide-react';
import { Aarti, DeityType } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';

interface IOSAartiCardProps {
  aarti: Aarti;
  isSelected?: boolean;
  onSelect?: (aarti: Aarti) => void;
  onView?: (aarti: Aarti) => void;
  showSelection?: boolean;
  showPreview?: boolean;
  compact?: boolean;
  className?: string;
}

const deityColors: Record<DeityType, { bg: string; border: string; text: string; gradient: string }> = {
  ganesha: { 
    bg: 'bg-orange-50', 
    border: 'border-orange-200', 
    text: 'text-orange-800',
    gradient: 'from-orange-100 to-orange-50'
  },
  krishna: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-800',
    gradient: 'from-blue-100 to-blue-50'
  },
  shiva: { 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    gradient: 'from-purple-100 to-purple-50'
  },
  durga: { 
    bg: 'bg-pink-50', 
    border: 'border-pink-200', 
    text: 'text-pink-800',
    gradient: 'from-pink-100 to-pink-50'
  },
  rama: { 
    bg: 'bg-green-50', 
    border: 'border-green-200', 
    text: 'text-green-800',
    gradient: 'from-green-100 to-green-50'
  },
  hanuman: { 
    bg: 'bg-red-50', 
    border: 'border-red-200', 
    text: 'text-red-800',
    gradient: 'from-red-100 to-red-50'
  },
  lakshmi: { 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-200', 
    text: 'text-yellow-800',
    gradient: 'from-yellow-100 to-yellow-50'
  },
  saraswati: { 
    bg: 'bg-indigo-50', 
    border: 'border-indigo-200', 
    text: 'text-indigo-800',
    gradient: 'from-indigo-100 to-indigo-50'
  },
};

const deityIcons: Record<DeityType, string> = {
  ganesha: '🐘',
  krishna: '🪈',
  shiva: '🔱',
  durga: '🌺',
  rama: '🏹',
  hanuman: '💪',
  lakshmi: '🪷',
  saraswati: '🎵',
};

const IOSAartiCard = ({ 
  aarti, 
  isSelected = false, 
  onSelect, 
  onView,
  showSelection = false, 
  showPreview = true,
  compact = false,
  className = ''
}: IOSAartiCardProps) => {
  const { isMarathi } = useLanguage();
  const [showFullLyrics, setShowFullLyrics] = useState(false);

  const title = isMarathi ? aarti.title.marathi : aarti.title.hinglish;
  const lyrics = isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish;
  const colorScheme = deityColors[aarti.deity];
  const deityIcon = deityIcons[aarti.deity];
  
  // Get preview lyrics (first 3 lines)
  const lyricsLines = lyrics.split('\n').filter(line => line.trim());
  const previewLyrics = lyricsLines.slice(0, 3).join('\n');
  const hasMoreLyrics = lyricsLines.length > 3;

  const handleCardClick = () => {
    if (onView) {
      onView(aarti);
    }
  };

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(aarti);
    }
  };

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 ease-out
        ${isSelected 
          ? `ring-2 ring-offset-2 ring-orange-400 shadow-lg ${colorScheme.bg}` 
          : 'hover:shadow-md hover:scale-[1.02] bg-white/80 backdrop-blur-sm'
        }
        ${colorScheme.border}
        ${compact ? 'rounded-xl' : 'rounded-2xl'}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox - iOS Style */}
      {showSelection && (
        <div className="absolute top-3 right-3 z-10">
          <div 
            className={`
              w-6 h-6 rounded-full border-2 transition-all duration-200
              ${isSelected 
                ? 'bg-orange-500 border-orange-500 scale-110' 
                : 'bg-white/80 border-gray-300 hover:border-orange-400'
              }
              flex items-center justify-center cursor-pointer
            `}
            onClick={handleSelectionClick}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <CardHeader className={`pb-3 ${compact ? 'p-4' : 'p-5'}`}>
        <div className="flex items-start gap-3">
          {/* Deity Icon - iOS Style Circle */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-xl
            bg-gradient-to-br ${colorScheme.gradient}
            ${colorScheme.border} border-2 shadow-sm
          `}>
            {deityIcon}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {title}
            </h3>
            
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={`text-xs ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border} border font-medium`}
              >
                {aarti.deity.charAt(0).toUpperCase() + aarti.deity.slice(1)}
              </Badge>
              
              {aarti.isPopular && (
                <Badge className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              
              <Badge 
                variant="outline"
                className={`text-xs ${
                  aarti.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                  aarti.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {aarti.difficulty}
              </Badge>
            </div>
          </div>

          {/* View Button - iOS Style */}
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onView(aarti);
              }}
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      {showPreview && (
        <CardContent className={`pt-0 ${compact ? 'px-4 pb-4' : 'px-5 pb-5'}`}>
          {/* Lyrics Preview - iOS Style */}
          <div className={`
            rounded-xl p-4 mb-4
            bg-gradient-to-br ${colorScheme.gradient}
            border ${colorScheme.border}
          `}>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
              {showFullLyrics ? lyrics : previewLyrics}
              {!showFullLyrics && hasMoreLyrics && (
                <span className="text-gray-500">...</span>
              )}
            </div>
            
            {hasMoreLyrics && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullLyrics(!showFullLyrics);
                }}
                className="mt-3 h-6 text-xs text-orange-600 hover:text-orange-700 p-0 font-medium"
              >
                {showFullLyrics ? 'Show less' : `Show all ${lyricsLines.length} lines`}
              </Button>
            )}
          </div>

          {/* Tags - iOS Style Pills */}
          {aarti.tags && aarti.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {aarti.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {aarti.tags.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                  +{aarti.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Bar - iOS Style */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition-colors">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Listen</span>
              </button>
              
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-pink-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{Math.floor(Math.random() * 100) + 50}</span>
              </button>
              
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View</span>
              </button>
            </div>
            
            {isSelected && (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-medium">Selected</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default IOSAartiCard;
