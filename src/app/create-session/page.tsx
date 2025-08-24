'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { sessionService } from '@/services/sessionService';
import { Aarti } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import IOSAartiSelector from '@/components/IOSAartiSelector';
import AartiStanzaDisplay from '@/components/AartiStanzaDisplay';

const CreateSessionPage = () => {
  const [selectedAartis, setSelectedAartis] = useState<Aarti[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { isMarathi } = useLanguage();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAartis.length === 0) {
      toast.error('Please select at least one aarti to host');
      return;
    }

    setIsCreating(true);
    
    try {
      const primaryAarti = selectedAartis[0];
      
      const sessionId = await sessionService.createSession(
        `${primaryAarti.title.hinglish} Session`, 
        'Host',
        primaryAarti.id
      );
      
      toast.success('Session started successfully! 🎵');
      
      const aartiParams = `aartiId=${primaryAarti.id}`;
      router.push(`/session/${sessionId}?role=creator&name=Host&${aartiParams}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to start session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-amber-200">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-orange-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Host Aarti Session</h1>
            <p className="text-sm text-gray-600">Select an aarti to share with others</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Aarti Selection */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-lg border-orange-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
                    <Music className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Choose Aarti</CardTitle>
                    <CardDescription className="text-gray-600">
                      Select the aarti you want to host for others to join
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <IOSAartiSelector
                  selectedAartis={selectedAartis}
                  onSelectionChange={setSelectedAartis}
                  maxSelection={1}
                />
              </CardContent>
            </Card>
          </div>

          {/* Selected Aarti Preview */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-lg border-orange-200 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Play className="h-5 w-5 text-orange-600" />
                  Ready to Host
                </CardTitle>
              </CardHeader>

              <CardContent>
                {selectedAartis.length > 0 ? (
                  <div className="space-y-4">
                    {/* Selected Aarti Info */}
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {isMarathi ? selectedAartis[0].title.marathi : selectedAartis[0].title.hinglish}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                          {selectedAartis[0].deity.charAt(0).toUpperCase() + selectedAartis[0].deity.slice(1)}
                        </Badge>
                      </div>
                      
                      {/* Beautiful Stanza Preview */}
                      <AartiStanzaDisplay
                        lyrics={isMarathi ? selectedAartis[0].lyrics.marathi : selectedAartis[0].lyrics.hinglish}
                        fontSize={12}
                        nightMode={false}
                        contentLanguage={isMarathi ? 'marathi' : 'hinglish'}
                        maxHeight="200px"
                        showAllStanzas={false}
                        className="px-2 py-1"
                        compact={true}
                      />
                    </div>

                    {/* Start Session Button */}
                    <Button
                      onClick={handleCreateSession}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Starting Session...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Play className="h-4 w-4" />
                          Start Hosting
                        </div>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Select an aarti to begin hosting
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateSessionPage;
