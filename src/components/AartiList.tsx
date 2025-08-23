'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Users, Star, Tag } from 'lucide-react';
import { Aarti } from '@/types/aarti';
import { getAartis, getPopularAartis, getAartisByDeity, getAllActiveAartis } from '@/services/aartiService';

interface AartiListProps {
  filter?: 'all' | 'popular' | string; // deity name or filter type
  limit?: number;
}

const AartiList: React.FC<AartiListProps> = ({ filter = 'all', limit }) => {
  const { t, isMarathi } = useLanguage();
  const router = useRouter();
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAartis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedAartis: Aarti[] = [];
        
        if (filter === 'popular') {
          fetchedAartis = await getPopularAartis(limit);
        } else if (filter === 'all') {
          // Use simplified function to avoid index issues
          fetchedAartis = await getAllActiveAartis();
          if (limit) {
            fetchedAartis = fetchedAartis.slice(0, limit);
          }
        } else {
          // Assume it's a deity filter
          fetchedAartis = await getAartisByDeity(filter as any);
          if (limit) {
            fetchedAartis = fetchedAartis.slice(0, limit);
          }
        }
        
        setAartis(fetchedAartis);
      } catch (err) {
        console.error('Error fetching aartis:', err);
        setError('Failed to load aartis');
      } finally {
        setLoading(false);
      }
    };

    fetchAartis();
  }, [filter, limit]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          {isMarathi ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
        </Button>
      </div>
    );
  }

  if (aartis.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          {isMarathi ? 'कोणतीही आरती सापडली नाही' : 'No aartis found'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {aartis.map((aarti) => (
        <Card 
          key={aarti.id} 
          className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/60 border-amber-200 group"
          onClick={() => router.push(`/aarti?id=${aarti.id}&deity=${aarti.deity}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className={`text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 ${isMarathi ? 'font-serif' : ''}`}>
                  {isMarathi ? aarti.title.marathi : aarti.title.hinglish}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {isMarathi 
                    ? t.deities[aarti.deity as keyof typeof t.deities] || aarti.deity
                    : aarti.deity
                  }
                </p>
              </div>
              {aarti.isPopular && (
                <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Lyrics Preview */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className={`text-sm text-gray-700 line-clamp-3 ${isMarathi ? 'font-serif' : ''}`}>
                  {isMarathi 
                    ? aarti.lyrics.marathi.substring(0, 120) + '...'
                    : aarti.lyrics.hinglish.substring(0, 120) + '...'
                  }
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(300)}</span> {/* Default 5 minutes */}
                </div>
                <Badge 
                  variant="outline" 
                  className={getDifficultyColor(aarti.difficulty)}
                >
                  {isMarathi 
                    ? (aarti.difficulty === 'easy' ? 'सोपे' : 
                       aarti.difficulty === 'medium' ? 'मध्यम' : 'कठीण')
                    : aarti.difficulty
                  }
                </Badge>
              </div>

              {/* Tagss */}
              {aarti.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {aarti.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs border-orange-200 text-orange-700 bg-orange-50"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {aarti.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                      +{aarti.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <Button 
                  size="sm" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white group-hover:scale-105 transition-transform"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isMarathi ? 'आरती सुरू करा' : 'Start Aarti'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AartiList;
