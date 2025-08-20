'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import AartiList from '@/components/AartiList';
import { DEITY_OPTIONS } from '@/types/aarti';

const BrowsePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isMarathi } = useLanguage();
  
  const [selectedDeity, setSelectedDeity] = useState<string>(searchParams.get('deity') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get deity info for display
  const getDeityInfo = (deityId: string) => {
    const deityMap: Record<string, { name: string; icon: string; color: string }> = {
      ganesha: { name: t.deities.ganesha, icon: '🐘', color: 'text-orange-600' },
      krishna: { name: t.deities.krishna, icon: '🪈', color: 'text-blue-600' },
      shiva: { name: t.deities.shiva, icon: '🔱', color: 'text-purple-600' },
      durga: { name: t.deities.durga, icon: '⚔️', color: 'text-red-600' },
      rama: { name: t.deities.rama, icon: '🏹', color: 'text-green-600' },
      hanuman: { name: t.deities.hanuman, icon: '💪', color: 'text-orange-600' },
      lakshmi: { name: t.deities.lakshmi, icon: '🪷', color: 'text-pink-600' },
      saraswati: { name: t.deities.saraswati, icon: '📚', color: 'text-yellow-600' },
    };
    return deityMap[deityId] || { name: 'All Deities', icon: '🕉️', color: 'text-orange-600' };
  };

  const currentDeity = getDeityInfo(selectedDeity);

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
                  {selectedDeity === 'all' ? t.sections.browseByDeity : currentDeity.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedDeity === 'all' ? 'All Devotional Aartis' : `${currentDeity.name} Aartis`}
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
              placeholder={t.search.placeholder || 'Search aartis...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Deity Filter */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-600" />
            <Select value={selectedDeity} onValueChange={setSelectedDeity}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-orange-200">
                <SelectValue placeholder="Select Deity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deities</SelectItem>
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
        </div>

        {/* Aarti List */}
        <div className="mb-8">
          <AartiList 
            filter={selectedDeity === 'all' ? 'all' : selectedDeity}
            // No limit to show all aartis
          />
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
