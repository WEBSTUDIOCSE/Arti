'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Sparkles, Play, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { sessionService } from '@/services/sessionService';
import { getAartisByDeity } from '@/services/aartiService';
import { Aarti, DeityType } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';

const CreateSessionPage = () => {
  const [sessionName, setSessionName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [selectedAarti, setSelectedAarti] = useState<Aarti | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showAartiSelection, setShowAartiSelection] = useState(false);
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isMarathi, t } = useLanguage();

  const deities = [
    { name: 'Ganesha', id: 'ganesha' as DeityType, icon: '🐘', color: 'bg-orange-100' },
    { name: 'Krishna', id: 'krishna' as DeityType, icon: '🪈', color: 'bg-blue-100' },
    { name: 'Shiva', id: 'shiva' as DeityType, icon: '🔱', color: 'bg-purple-100' },
    { name: 'Durga', id: 'durga' as DeityType, icon: '🌺', color: 'bg-pink-100' },
    { name: 'Rama', id: 'rama' as DeityType, icon: '🏹', color: 'bg-green-100' },
    { name: 'Hanuman', id: 'hanuman' as DeityType, icon: '💪', color: 'bg-red-100' },
    { name: 'Lakshmi', id: 'lakshmi' as DeityType, icon: '🪷', color: 'bg-yellow-100' },
    { name: 'Saraswati', id: 'saraswati' as DeityType, icon: '🎵', color: 'bg-indigo-100' },
  ];

  const [selectedDeity, setSelectedDeity] = useState<DeityType | null>(null);

  // Load aartis when deity is selected
  useEffect(() => {
    if (selectedDeity) {
      loadAartis(selectedDeity);
    }
  }, [selectedDeity]);

  const loadAartis = async (deity: DeityType) => {
    setLoading(true);
    try {
      const aartiList = await getAartisByDeity(deity);
      setAartis(aartiList);
    } catch (error) {
      console.error('Failed to load aartis:', error);
      toast.error('Failed to load aartis');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionName.trim() || !creatorName.trim()) {
      toast.error('Please fill in both fields');
      return;
    }

    if (!selectedAarti) {
      toast.error('Please select an aarti for the session');
      return;
    }

    setIsCreating(true);
    
    try {
      const sessionId = await sessionService.createSession(
        sessionName.trim(), 
        creatorName.trim(),
        selectedAarti
      );
      
      toast.success('Session created successfully! 🎵');
      
      // Navigate to the session view as creator
      router.push(`/session/${sessionId}?role=creator&name=${encodeURIComponent(creatorName.trim())}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const suggestedNames = [
    'Sharma Family Evening Aarti',
    'Diwali Special Session',
    'Morning Prayers Together',
    'Weekend Family Bhajan',
    'Ganesh Chaturthi Celebration'
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setSessionName(suggestion);
  };

  const handleAartiSelect = (aarti: Aarti) => {
    setSelectedAarti(aarti);
    setShowAartiSelection(false);
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Start Aarti Session</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800 mb-2">
              🕉️ Start Aarti Session
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create a session for your family and friends to join together in spiritual harmony
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateSession} className="space-y-6">
              {/* Session Name Input */}
              <div className="space-y-2">
                <Label htmlFor="sessionName" className="text-sm font-medium text-gray-700">
                  Session Name
                </Label>
                <Input
                  id="sessionName"
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Sharma Family Evening Aarti"
                  className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  maxLength={50}
                  disabled={isCreating}
                />
                <p className="text-xs text-gray-500">
                  Choose a name that helps your family recognize this session
                </p>
              </div>

              {/* Quick Suggestions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Quick Ideas
                </Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedNames.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                      disabled={isCreating}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Creator Name Input */}
              <div className="space-y-2">
                <Label htmlFor="creatorName" className="text-sm font-medium text-gray-700">
                  Your Name
                </Label>
                <Input
                  id="creatorName"
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  maxLength={30}
                  disabled={isCreating}
                />
                <p className="text-xs text-gray-500">
                  This is how others will see who's hosting the session
                </p>
              </div>

              {/* Aarti Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Select Aarti
                </Label>
                
                {!selectedAarti ? (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAartiSelection(!showAartiSelection)}
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 justify-between"
                      disabled={isCreating}
                    >
                      Choose an aarti to share
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAartiSelection ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    {showAartiSelection && (
                      <div className="border border-orange-200 rounded-lg p-4 bg-orange-50/50">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">Choose a deity:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {deities.map((deity) => (
                              <Button
                                key={deity.id}
                                type="button"
                                variant={selectedDeity === deity.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedDeity(deity.id)}
                                className={`${deity.color} border-orange-200 text-gray-700 hover:bg-orange-100`}
                                disabled={loading}
                              >
                                <span className="text-lg mr-2">{deity.icon}</span>
                                {deity.name}
                              </Button>
                            ))}
                          </div>
                          
                          {selectedDeity && (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                Select {deities.find(d => d.id === selectedDeity)?.name} aarti:
                              </p>
                              {loading ? (
                                <div className="text-center py-4">
                                  <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
                                </div>
                              ) : (
                                <ScrollArea className="max-h-40">
                                  <div className="space-y-2">
                                    {aartis.map((aarti) => (
                                      <Button
                                        key={aarti.id}
                                        type="button"
                                        variant="ghost"
                                        onClick={() => handleAartiSelect(aarti)}
                                        className="w-full text-left justify-between hover:bg-orange-100 p-3 h-auto"
                                      >
                                        <div>
                                          <div className="font-medium text-gray-800">
                                            {isMarathi ? aarti.title.marathi : aarti.title.hinglish}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {aarti.deity} • {aarti.duration || '4:30'}
                                          </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {isMarathi ? selectedAarti.title.marathi : selectedAarti.title.hinglish}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedAarti.deity} • {selectedAarti.duration || '4:30'}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAarti(null)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                disabled={isCreating || !sessionName.trim() || !creatorName.trim() || !selectedAarti}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Session...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Session
                  </div>
                )}
              </Button>

              {/* Info Text */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">How it works</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Your family can join by selecting your session</li>
                      <li>• Everyone will see the same aarti synchronized</li>
                      <li>• You control the aarti flow as the host</li>
                      <li>• Session automatically ends when you leave</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateSessionPage;

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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Start Aarti Session</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800 mb-2">
              🕉️ Start Aarti Session
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create a session for your family and friends to join together in spiritual harmony
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateSession} className="space-y-6">
              {/* Session Name Input */}
              <div className="space-y-2">
                <Label htmlFor="sessionName" className="text-sm font-medium text-gray-700">
                  Session Name
                </Label>
                <Input
                  id="sessionName"
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Sharma Family Evening Aarti"
                  className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  maxLength={50}
                  disabled={isCreating}
                />
                <p className="text-xs text-gray-500">
                  Choose a name that helps your family recognize this session
                </p>
              </div>

              {/* Quick Suggestions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Quick Ideas
                </Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedNames.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                      disabled={isCreating}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Creator Name Input */}
              <div className="space-y-2">
                <Label htmlFor="creatorName" className="text-sm font-medium text-gray-700">
                  Your Name
                </Label>
                <Input
                  id="creatorName"
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g., Priya Sharma"
                  className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  maxLength={30}
                  disabled={isCreating}
                />
                <p className="text-xs text-gray-500">
                  This is how others will see who's hosting the session
                </p>
              </div>

              {/* Create Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                disabled={isCreating || !sessionName.trim() || !creatorName.trim()}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Session...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Session
                  </div>
                )}
              </Button>

              {/* Info Text */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">How it works</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Your family can join by selecting your session</li>
                      <li>• Everyone will see the same aarti synchronized</li>
                      <li>• You control the aarti flow as the host</li>
                      <li>• Session automatically ends when you leave</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateSessionPage;
