'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Aarti } from '@/types/aarti';
import IOSAartiCard from '@/components/IOSAartiCard';
import IOSAartiSelector from '@/components/IOSAartiSelector';
import IOSSessionView from '@/components/IOSSessionView';

// Sample data for showcase
const sampleAartis: Aarti[] = [
  {
    id: 'ganesha-aarti-1',
    title: { 
      hinglish: 'Ganesha Aarti', 
      marathi: 'गणेश आरती' 
    },
    deity: 'ganesha',
    lyrics: {
      hinglish: `Om Gam Ganapataye Namaha\nVighna Vinashaka Mangal Karta\nSukh Sampatti Data\nSarvada Raksha Karo\n\nJai Ganesha Jai Ganesha\nJai Ganesha Pahimam\nSri Ganesha Sri Ganesha\nSri Ganesha Raksha Mam`,
      marathi: `ओम् गं गणपतये नमः\nविघ्न विनाशक मंगल कर्ता\nसुख सम्पत्ति दाता\nसर्वदा रक्षा करो\n\nजय गणेश जय गणेश\nजय गणेश पाहिमाम्\nश्री गणेश श्री गणेश\nश्री गणेश रक्ष माम्`
    },
    slug: 'ganesha-aarti-1',
    difficulty: 'easy',
    tags: ['popular', 'daily', 'morning'],
    isPopular: true,
    isActive: true,
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
  },
  {
    id: 'krishna-aarti-1',
    title: { 
      hinglish: 'Krishna Aarti', 
      marathi: 'कृष्ण आरती' 
    },
    deity: 'krishna',
    lyrics: {
      hinglish: `Aarti Kunj Bihari Ki\nShree Girdhar Krishna Murari Ki\nGopi Jana Vallabh Kanhiya\nShree Aarti Kunj Bihari Ki\n\nAarti Kije Hanuman Lala Ki\nDushtana Ko Chhadan Wale Ki\nJagat Palak Raghunath Kare\nShree Aarti Kunj Bihari Ki`,
      marathi: `आरती कुंज बिहारी की\nश्री गिरधर कृष्ण मुरारी की\nगोपी जन वल्लभ कान्हिया\nश्री आरती कुंज बिहारी की\n\nआरती कीजे हनुमान लाला की\nदुष्टाना को छडन वाले की\nजगत पालक रघुनाथ करे\nश्री आरती कुंज बिहारी की`
    },
    slug: 'krishna-aarti-1',
    difficulty: 'medium',
    tags: ['evening', 'traditional'],
    isPopular: false,
    isActive: true,
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
  }
];

const IOSUIShowcase = () => {
  const [selectedAartis, setSelectedAartis] = useState<Aarti[]>([]);
  const [currentView, setCurrentView] = useState<'cards' | 'selector' | 'session'>('cards');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-orange-100 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">iOS UI Showcase</h1>
                <p className="text-sm text-gray-600">Beautiful aarti components with iOS design</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Navigation Tabs */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={currentView === 'cards' ? 'default' : 'ghost'}
                className="flex-1 rounded-2xl"
                onClick={() => setCurrentView('cards')}
              >
                Aarti Cards
              </Button>
              <Button
                variant={currentView === 'selector' ? 'default' : 'ghost'}
                className="flex-1 rounded-2xl"
                onClick={() => setCurrentView('selector')}
              >
                Aarti Selector
              </Button>
              <Button
                variant={currentView === 'session' ? 'default' : 'ghost'}
                className="flex-1 rounded-2xl"
                onClick={() => setCurrentView('session')}
              >
                Session View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content based on selected view */}
        {currentView === 'cards' && (
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  Individual Aarti Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleAartis.map((aarti, index) => (
                  <div key={aarti.id}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {aarti.deity.charAt(0).toUpperCase() + aarti.deity.slice(1)} Aarti Card
                    </h3>
                    <IOSAartiCard
                      aarti={aarti}
                      isSelected={selectedAartis.some(a => a.id === aarti.id)}
                      onSelect={(selectedAarti) => {
                        const isSelected = selectedAartis.some(a => a.id === selectedAarti.id);
                        if (isSelected) {
                          setSelectedAartis(prev => prev.filter(a => a.id !== selectedAarti.id));
                        } else {
                          setSelectedAartis(prev => [...prev, selectedAarti]);
                        }
                      }}
                      showSelection={true}
                      showPreview={true}
                    />
                    {index < sampleAartis.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedAartis.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-green-800">Selected Aartis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAartis.map((aarti) => (
                      <Badge key={aarti.id} className="bg-green-100 text-green-800">
                        {aarti.title.hinglish}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-full"
                    onClick={() => setSelectedAartis([])}
                  >
                    Clear Selection
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentView === 'selector' && (
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Enhanced Aarti Selector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IOSAartiSelector
                selectedAartis={selectedAartis}
                onSelectionChange={setSelectedAartis}
                multiSelect={true}
                maxSelection={5}
              />
            </CardContent>
          </Card>
        )}

        {currentView === 'session' && selectedAartis.length > 0 && (
          <div>
            <IOSSessionView
              sessionId="DEMO123"
              aartis={selectedAartis}
              currentIndex={0}
              isPlaying={isPlaying}
              isCreator={true}
              participants={5}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onNext={() => {}}
              onPrevious={() => {}}
              onSeek={() => {}}
              onVolumeChange={() => {}}
            />
          </div>
        )}

        {currentView === 'session' && selectedAartis.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Aartis First</h3>
              <p className="text-gray-600 mb-4">
                Go to the &quot;Aarti Selector&quot; tab to choose some aartis, then come back to view the session interface
              </p>
              <Button
                onClick={() => setCurrentView('selector')}
                className="rounded-2xl"
              >
                Go to Selector
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IOSUIShowcase;
