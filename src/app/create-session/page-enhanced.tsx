'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { sessionService } from '@/services/sessionService';
import { Aarti } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import EnhancedAartiSelector from '@/components/EnhancedAartiSelector';

const CreateSessionPage = () => {
  const [sessionName, setSessionName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [selectedAartis, setSelectedAartis] = useState<Aarti[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { isMarathi, t } = useLanguage();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionName.trim() || !creatorName.trim()) {
      toast.error('Please fill in both fields');
      return;
    }

    if (selectedAartis.length === 0) {
      toast.error('Please select at least one aarti for the session');
      return;
    }

    setIsCreating(true);
    
    try {
      // For now, use the first selected aarti as the primary one
      const primaryAarti = selectedAartis[0];
      
      const sessionId = await sessionService.createSession(
        sessionName.trim(), 
        creatorName.trim(),
        primaryAarti.id
      );
      
      toast.success(`Session created with ${selectedAartis.length} aarti${selectedAartis.length > 1 ? 's' : ''}! 🎵`);
      
      // Navigate to the session view as creator with selected aarti
      const aartiParams = selectedAartis.map(a => `aartiId=${a.id}`).join('&');
      router.push(`/session/${sessionId}?role=creator&name=${encodeURIComponent(creatorName.trim())}&${aartiParams}`);
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Details */}
          <Card className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-xl h-fit">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800 mb-2">
                🕉️ Session Details
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

                {/* Selected Aartis Summary */}
                {selectedAartis.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Selected Aartis ({selectedAartis.length})
                    </Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedAartis.map((aarti) => (
                        <div key={aarti.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">
                              {isMarathi ? aarti.title.marathi : aarti.title.hinglish}
                            </div>
                            <div className="text-xs text-gray-500">
                              {aarti.deity.charAt(0).toUpperCase() + aarti.deity.slice(1)}
                            </div>
                          </div>
                          <Badge className="bg-green-500 text-white text-xs">
                            Selected
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                  disabled={isCreating || !sessionName.trim() || !creatorName.trim() || selectedAartis.length === 0}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Session...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Play className="h-4 w-4" />
                      Start Session with {selectedAartis.length} Aarti{selectedAartis.length > 1 ? 's' : ''}
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

          {/* Aarti Selection */}
          <Card className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Choose Aartis</CardTitle>
              <CardDescription>
                Select one or more aartis to share in your session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedAartiSelector
                selectedAartis={selectedAartis}
                onSelectionChange={setSelectedAartis}
                multiSelect={true}
                maxSelection={5}
                className=""
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateSessionPage;
