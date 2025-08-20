'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Filter, Search, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Aarti, DeityType } from '@/types/aarti';
import { getAllActiveAartis, getAartisByDeity } from '@/services/aartiService';
import { DEITY_OPTIONS } from '@/types/aarti';

const BrowsePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isMarathi } = useLanguage();
  
  const [selectedDeity, setSelectedDeity] = useState<string>(searchParams.get('deity') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'deity' | 'difficulty' | 'popularity'>('deity');

  // Get deity info for display
  const getDeityInfo = (deityId: string) => {
    const deityMap: Record<string, { name: string; icon: string; color: string }> = {
      ganesha: { name: t.deities?.ganesha || 'Ganesha', icon: '🐘', color: 'text-orange-600' },
      krishna: { name: t.deities?.krishna || 'Krishna', icon: '🪈', color: 'text-blue-600' },
      shiva: { name: t.deities?.shiva || 'Shiva', icon: '🔱', color: 'text-purple-600' },
      durga: { name: t.deities?.durga || 'Durga', icon: '⚔️', color: 'text-red-600' },
      rama: { name: t.deities?.rama || 'Rama', icon: '🏹', color: 'text-green-600' },
      hanuman: { name: t.deities?.hanuman || 'Hanuman', icon: '💪', color: 'text-orange-600' },
      lakshmi: { name: t.deities?.lakshmi || 'Lakshmi', icon: '🪷', color: 'text-pink-600' },
      saraswati: { name: t.deities?.saraswati || 'Saraswati', icon: '📚', color: 'text-yellow-600' },
    };
    return deityMap[deityId] || { name: 'All Deities', icon: '🕉️', color: 'text-orange-600' };
  };

  const currentDeity = getDeityInfo(selectedDeity);

  // Fetch aartis based on selected deity
  useEffect(() => {
    const fetchAartis = async () => {
      try {
        setLoading(true);
        let fetchedAartis: Aarti[] = [];

        if (selectedDeity === 'all') {
          fetchedAartis = await getAllActiveAartis();
        } else {
          fetchedAartis = await getAartisByDeity(selectedDeity as DeityType);
        }

        setAartis(fetchedAartis);
        setError(null);
      } catch (err) {
        console.error('Error fetching aartis:', err);
        setError('Failed to load aartis');
      } finally {
        setLoading(false);
      }
    };

    fetchAartis();
  }, [selectedDeity]);

  // Filter aartis based on search query
  const filteredAartis = aartis.filter(aarti => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      aarti.title.hinglish.toLowerCase().includes(searchTerm) ||
      aarti.title.marathi.toLowerCase().includes(searchTerm) ||
      aarti.deity.toLowerCase().includes(searchTerm) ||
      aarti.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });

  // Group aartis by specified criteria
  const groupedAartis = () => {
    if (groupBy === 'deity') {
      return filteredAartis.reduce((groups, aarti) => {
        const deity = aarti.deity;
        if (!groups[deity]) groups[deity] = [];
        groups[deity].push(aarti);
        return groups;
      }, {} as Record<string, Aarti[]>);
    } else if (groupBy === 'difficulty') {
      return filteredAartis.reduce((groups, aarti) => {
        const difficulty = aarti.difficulty;
        if (!groups[difficulty]) groups[difficulty] = [];
        groups[difficulty].push(aarti);
        return groups;
      }, {} as Record<string, Aarti[]>);
    } else if (groupBy === 'popularity') {
      return {
        popular: filteredAartis.filter(aarti => aarti.isPopular),
        regular: filteredAartis.filter(aarti => !aarti.isPopular),
      };
    }
    return { all: filteredAartis };
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const AartiCard = ({ aarti }: { aarti: Aarti }) => (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 border-orange-200 group"
      onClick={() => router.push(`/aarti?id=${aarti.id}&deity=${aarti.deity}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 ${isMarathi ? 'font-serif' : ''}`}>
              {isMarathi ? aarti.title.marathi : aarti.title.hinglish}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 capitalize">
              {getDeityInfo(aarti.deity).name}
            </p>
          </div>
          {aarti.isPopular && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quick Preview */}
        <p className={`text-sm text-gray-600 line-clamp-2 mb-4 ${isMarathi ? 'font-serif' : ''}`}>
          {(isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish).split('\\n')[0]}...
        </p>

        {/* Action Button */}
        <Button 
          size="sm" 
          className="w-full bg-orange-600 hover:bg-orange-700 text-white group-hover:bg-orange-700"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/aarti?id=${aarti.id}&deity=${aarti.deity}`);
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          {isMarathi ? 'वाचा' : 'Read Aarti'}
        </Button>

        {/* Metadata */}
        <div className="flex items-center justify-end text-sm text-gray-600 mt-3">
          <Badge variant="outline" className={getDifficultyColor(aarti.difficulty)}>
            {isMarathi 
              ? (aarti.difficulty === 'easy' ? 'सोपे' : 
                 aarti.difficulty === 'medium' ? 'मध्यम' : 'कठीण')
              : aarti.difficulty
            }
          </Badge>
        </div>

        {/* Tags */}
        {aarti.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {aarti.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {aarti.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{aarti.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentDeity.icon}</span>
              <div>
                <h1 className={`text-xl font-bold ${currentDeity.color} ${isMarathi ? 'font-serif' : ''}`}>
                  {selectedDeity === 'all' ? (isMarathi ? 'सर्व आरत्या' : 'All Aartis') : currentDeity.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedDeity === 'all' 
                    ? (isMarathi ? 'सर्व भक्तिगीते' : 'All Devotional Aartis')
                    : `${currentDeity.name} ${isMarathi ? 'आरत्या' : 'Aartis'}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={isMarathi ? 'आरत्या शोधा...' : 'Search aartis...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <Select value={selectedDeity} onValueChange={setSelectedDeity}>
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-orange-200">
                  <SelectValue placeholder="Select Deity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <span>🕉️</span>
                      <span>{isMarathi ? 'सर्व देव' : 'All Deities'}</span>
                    </span>
                  </SelectItem>
                  {DEITY_OPTIONS.map((deity) => {
                    const deityInfo = getDeityInfo(deity.value);
                    return (
                      <SelectItem key={deity.value} value={deity.value}>
                        <span className="flex items-center gap-2">
                          <span>{deityInfo.icon}</span>
                          <span>{deityInfo.name}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Select value={groupBy} onValueChange={(value: 'deity' | 'difficulty' | 'popularity') => setGroupBy(value)}>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-orange-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deity">{isMarathi ? 'देवतेनुसार' : 'By Deity'}</SelectItem>
                <SelectItem value="difficulty">{isMarathi ? 'कठीणतेनुसार' : 'By Difficulty'}</SelectItem>
                <SelectItem value="popularity">{isMarathi ? 'लोकप्रियतेनुसार' : 'By Popularity'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {/* Skeleton cards grouped by deity */}
            {[1, 2, 3].map((group) => (
              <div key={group} className="space-y-4">
                {/* Group header skeleton */}
                <div className="flex items-center space-x-3 px-6 py-3 bg-orange-50 rounded-lg border border-orange-100">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                
                {/* Aarti cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((card) => (
                    <Card key={card} className="bg-white/80 border-orange-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-9 w-24 rounded" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {isMarathi ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Aartis Display */}
        {!loading && !error && (
          <div className="space-y-8">
            {Object.entries(groupedAartis()).map(([groupName, groupAartis]) => (
              <div key={groupName}>
                {Object.keys(groupedAartis()).length > 1 && (
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {groupBy === 'deity' && getDeityInfo(groupName).icon} {' '}
                      {groupBy === 'deity' ? getDeityInfo(groupName).name : groupName}
                    </h2>
                    <Badge variant="outline" className="text-gray-600">
                      {groupAartis.length} {isMarathi ? 'आरत्या' : 'aartis'}
                    </Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupAartis.map((aarti) => (
                    <AartiCard key={aarti.id} aarti={aarti} />
                  ))}
                </div>
              </div>
            ))}

            {filteredAartis.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  {isMarathi ? 'कोणत्याही आरत्या सापडल्या नाहीत' : 'No aartis found'}
                </p>
                <p className="text-gray-500">
                  {isMarathi ? 'कृपया वेगळे फिल्टर वापरा किंवा शोध शब्द बदला' : 'Try adjusting your filters or search terms'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
