'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Grid, List, Star, Clock, Users } from 'lucide-react';
import { Aarti, DeityType } from '@/types/aarti';
import { getAartisByDeity } from '@/services/aartiService';
import { useLanguage } from '@/contexts/LanguageContext';
import AartiSelectionCard from './AartiSelectionCard';

interface EnhancedAartiSelectorProps {
  selectedAartis: Aarti[];
  onSelectionChange: (aartis: Aarti[]) => void;
  multiSelect?: boolean;
  maxSelection?: number;
  className?: string;
}

const EnhancedAartiSelector = ({
  selectedAartis,
  onSelectionChange,
  multiSelect = false,
  maxSelection,
  className = ''
}: EnhancedAartiSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeity, setSelectedDeity] = useState<DeityType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const { isMarathi } = useLanguage();

  const deities: { id: DeityType | 'all'; name: string; icon: string; color: string }[] = [
    { id: 'all', name: 'All Deities', icon: '🕉️', color: 'bg-gradient-to-r from-orange-100 to-amber-100' },
    { id: 'ganesha', name: 'Ganesha', icon: '🐘', color: 'bg-orange-100' },
    { id: 'krishna', name: 'Krishna', icon: '🪈', color: 'bg-blue-100' },
    { id: 'shiva', name: 'Shiva', icon: '🔱', color: 'bg-purple-100' },
    { id: 'durga', name: 'Durga', icon: '🌺', color: 'bg-pink-100' },
    { id: 'rama', name: 'Rama', icon: '🏹', color: 'bg-green-100' },
    { id: 'hanuman', name: 'Hanuman', icon: '💪', color: 'bg-red-100' },
    { id: 'lakshmi', name: 'Lakshmi', icon: '🪷', color: 'bg-yellow-100' },
    { id: 'saraswati', name: 'Saraswati', icon: '🎵', color: 'bg-indigo-100' },
  ];

  // Load aartis when deity changes
  useEffect(() => {
    loadAartis();
  }, [selectedDeity]);

  const loadAartis = async () => {
    setLoading(true);
    try {
      if (selectedDeity === 'all') {
        // Load aartis from all deities
        const allAartis: Aarti[] = [];
        const deityIds = deities.filter(d => d.id !== 'all').map(d => d.id as DeityType);
        
        for (const deityId of deityIds) {
          try {
            const deityAartis = await getAartisByDeity(deityId);
            allAartis.push(...deityAartis);
          } catch (error) {
            console.warn(`Failed to load aartis for ${deityId}:`, error);
          }
        }
        setAartis(allAartis);
      } else {
        const deityAartis = await getAartisByDeity(selectedDeity);
        setAartis(deityAartis);
      }
    } catch (error) {
      console.error('Failed to load aartis:', error);
      // Fallback to sample data
      setAartis(generateFallbackAartis(selectedDeity));
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackAartis = (deity: DeityType | 'all'): Aarti[] => {
    const deityList = deity === 'all' ? ['ganesha', 'krishna', 'shiva', 'durga'] : [deity];
    
    return deityList.flatMap((d) => [
      {
        id: `${d}-aarti-1`,
        title: { 
          hinglish: `${d.charAt(0).toUpperCase() + d.slice(1)} Aarti`, 
          marathi: `${d.charAt(0).toUpperCase() + d.slice(1)} आरती` 
        },
        deity: d as DeityType,
        lyrics: {
          hinglish: `Om Gam Ganapataye Namaha\nVighna Vinashaka Mangal Karta\nSukh Sampatti Data\nSarvada Raksha Karo\n\nJai Ganesha Jai Ganesha\nJai Ganesha Pahimam\nSri Ganesha Sri Ganesha\nSri Ganesha Raksha Mam`,
          marathi: `ओम् गं गणपतये नमः\nविघ्न विनाशक मंगल कर्ता\nसुख सम्पत्ति दाता\nसर्वदा रक्षा करो\n\nजय गणेश जय गणेश\nजय गणेश पाहिमाम्\nश्री गणेश श्री गणेश\nश्री गणेश रक्ष माम्`
        },
        slug: `${d}-aarti-1`,
        difficulty: 'easy' as const,
        tags: ['popular', 'daily', 'morning'],
        isPopular: true,
        isActive: true,
        createdAt: new Date() as any,
        updatedAt: new Date() as any
      },
      {
        id: `${d}-aarti-2`,
        title: { 
          hinglish: `${d.charAt(0).toUpperCase() + d.slice(1)} Evening Aarti`, 
          marathi: `${d.charAt(0).toUpperCase() + d.slice(1)} संध्या आरती` 
        },
        deity: d as DeityType,
        lyrics: {
          hinglish: `Sukhkarta Dukhharta Varta Vighnachi\nNurvi Purvi Prem Krupa Jaayachi\nSarvangi Sundar Uti Shendurachi\nKanthi Zhalar Mal Muktafalanchi\n\nJai Deva Jai Deva Jai Mangalmurti\nDarshan Maatre Man-kamna Purti`,
          marathi: `सुखकर्ता दुःखहर्ता वर्ता विघ्नाची\nनुरवी पुरवी प्रेम कृपा जाची\nसर्वांगी सुंदर उती शेंदुराची\nकंठी झळार मळ मुक्ताफळांची\n\nजय देवा जय देवा जय मंगलमूर्ती\nदर्शन मात्रे मनकामना पूर्ती`
        },
        slug: `${d}-aarti-2`,
        difficulty: 'medium' as const,
        tags: ['evening', 'traditional'],
        isPopular: false,
        isActive: true,
        createdAt: new Date() as any,
        updatedAt: new Date() as any
      }
    ]);
  };

  // Filter aartis based on search query
  const filteredAartis = aartis.filter((aarti) => {
    const title = isMarathi ? aarti.title.marathi : aarti.title.hinglish;
    const lyrics = isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish;
    
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lyrics.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aarti.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aarti.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAartiSelect = (aarti: Aarti) => {
    if (multiSelect) {
      const isSelected = selectedAartis.some(a => a.id === aarti.id);
      let newSelection: Aarti[];
      
      if (isSelected) {
        newSelection = selectedAartis.filter(a => a.id !== aarti.id);
      } else {
        if (maxSelection && selectedAartis.length >= maxSelection) {
          // Replace last selected if at max
          newSelection = [...selectedAartis.slice(0, maxSelection - 1), aarti];
        } else {
          newSelection = [...selectedAartis, aarti];
        }
      }
      
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([aarti]);
    }
  };

  const isAartiSelected = (aarti: Aarti) => {
    return selectedAartis.some(a => a.id === aarti.id);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Search and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Select Aartis</h3>
            <p className="text-sm text-gray-600">
              {multiSelect 
                ? `Choose ${maxSelection ? `up to ${maxSelection}` : 'multiple'} aartis for your session`
                : 'Choose an aarti for your session'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search aartis, deities, or lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-amber-200 focus:border-amber-400"
          />
        </div>

        {/* Selection Summary */}
        {selectedAartis.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">
                    {selectedAartis.length} selected
                  </Badge>
                  <span className="text-sm text-green-800">
                    {selectedAartis.map(a => isMarathi ? a.title.marathi : a.title.hinglish).join(', ')}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectionChange([])}
                  className="text-green-700 hover:text-green-800 h-6"
                >
                  Clear all
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Deity Filter Tabs */}
      <Tabs value={selectedDeity} onValueChange={(value) => setSelectedDeity(value as DeityType | 'all')}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-1 h-auto bg-amber-50 p-1">
          {deities.slice(0, 5).map((deity) => (
            <TabsTrigger
              key={deity.id}
              value={deity.id}
              className={`flex flex-col items-center gap-1 p-2 text-xs ${deity.color} data-[state=active]:bg-orange-200`}
            >
              <span className="text-lg">{deity.icon}</span>
              <span className="hidden sm:block">{deity.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Second row for remaining deities on mobile */}
        <div className="flex lg:hidden">
          <TabsList className="flex w-full gap-1 h-auto bg-amber-50 p-1 mt-2">
            {deities.slice(5).map((deity) => (
              <TabsTrigger
                key={deity.id}
                value={deity.id}
                className={`flex flex-col items-center gap-1 p-2 text-xs flex-1 ${deity.color} data-[state=active]:bg-orange-200`}
              >
                <span className="text-lg">{deity.icon}</span>
                <span>{deity.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:block">
          <TabsList className="grid grid-cols-4 gap-1 h-auto bg-amber-50 p-1 mt-2">
            {deities.slice(5).map((deity) => (
              <TabsTrigger
                key={deity.id}
                value={deity.id}
                className={`flex flex-col items-center gap-1 p-2 text-xs ${deity.color} data-[state=active]:bg-orange-200`}
              >
                <span className="text-lg">{deity.icon}</span>
                <span>{deity.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Aartis Content */}
        <TabsContent value={selectedDeity} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading aartis...</p>
              </div>
            </div>
          ) : filteredAartis.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No aartis found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : 'No aartis available for this deity'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-3'
              }>
                {filteredAartis.map((aarti) => (
                  <AartiSelectionCard
                    key={aarti.id}
                    aarti={aarti}
                    isSelected={isAartiSelected(aarti)}
                    onSelect={handleAartiSelect}
                    multiSelect={multiSelect}
                    showPreview={true}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAartiSelector;
