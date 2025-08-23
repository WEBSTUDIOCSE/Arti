'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Aarti, DeityType } from '@/types/aarti';
import { getAartisByDeity } from '@/services/aartiService';
import { useLanguage } from '@/contexts/LanguageContext';
import IOSAartiCard from './IOSAartiCard';

interface IOSAartiSelectorProps {
  selectedAartis: Aarti[];
  onSelectionChange: (aartis: Aarti[]) => void;
  multiSelect?: boolean;
  maxSelection?: number;
  className?: string;
}

const deityData = [
  { id: 'ganesha' as DeityType, name: 'Ganesha', icon: '🐘', color: 'bg-orange-100 text-orange-800' },
  { id: 'krishna' as DeityType, name: 'Krishna', icon: '🪈', color: 'bg-blue-100 text-blue-800' },
  { id: 'shiva' as DeityType, name: 'Shiva', icon: '🔱', color: 'bg-purple-100 text-purple-800' },
  { id: 'durga' as DeityType, name: 'Durga', icon: '🌺', color: 'bg-pink-100 text-pink-800' },
  { id: 'rama' as DeityType, name: 'Rama', icon: '🏹', color: 'bg-green-100 text-green-800' },
  { id: 'hanuman' as DeityType, name: 'Hanuman', icon: '💪', color: 'bg-red-100 text-red-800' },
  { id: 'lakshmi' as DeityType, name: 'Lakshmi', icon: '🪷', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'saraswati' as DeityType, name: 'Saraswati', icon: '🎵', color: 'bg-indigo-100 text-indigo-800' },
];

const IOSAartiSelector = ({
  selectedAartis,
  onSelectionChange,
  multiSelect = false,
  maxSelection,
  className = ''
}: IOSAartiSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeity, setSelectedDeity] = useState<DeityType | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const { isMarathi } = useLanguage();

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
        const deityIds = deityData.map(d => d.id);
        
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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Aartis</h2>
          <p className="text-gray-600">
            {multiSelect 
              ? `Select ${maxSelection ? `up to ${maxSelection}` : 'multiple'} aartis for your session`
              : 'Choose an aarti for your session'
            }
          </p>
        </div>

        {/* Selection Summary - iOS Style */}
        {selectedAartis.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">
                      {selectedAartis.length} Selected
                    </div>
                    <div className="text-sm text-green-600">
                      {selectedAartis.map(a => isMarathi ? a.title.marathi : a.title.hinglish).join(', ')}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectionChange([])}
                  className="text-green-700 hover:text-green-800 hover:bg-green-100 rounded-full"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar - iOS Style */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search aartis, deities, or lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 h-12 bg-gray-50 border-gray-200 rounded-2xl text-base focus:bg-white focus:border-orange-300 focus:ring-orange-200"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-200"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Deity Filter - iOS Style Horizontal Scroll */}
      <div>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-4">
            <Button
              variant={selectedDeity === 'all' ? 'default' : 'outline'}
              className={`
                flex-shrink-0 h-12 px-4 rounded-2xl font-medium transition-all duration-200
                ${selectedDeity === 'all' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => setSelectedDeity('all')}
            >
              <span className="text-lg mr-2">🕉️</span>
              All
            </Button>
            {deityData.map((deity) => (
              <Button
                key={deity.id}
                variant={selectedDeity === deity.id ? 'default' : 'outline'}
                className={`
                  flex-shrink-0 h-12 px-4 rounded-2xl font-medium transition-all duration-200
                  ${selectedDeity === deity.id 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setSelectedDeity(deity.id)}
                disabled={loading}
              >
                <span className="text-lg mr-2">{deity.icon}</span>
                {deity.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Aartis Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Loading aartis...</p>
            </div>
          </div>
        ) : filteredAartis.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No aartis found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search terms' : 'No aartis available for this deity'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAartis.map((aarti) => (
              <IOSAartiCard
                key={aarti.id}
                aarti={aarti}
                isSelected={isAartiSelected(aarti)}
                onSelect={handleAartiSelect}
                showSelection={multiSelect}
                showPreview={true}
                className="cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IOSAartiSelector;
