'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Users, Crown, Play, Pause, SkipForward, SkipBack, Square, Globe, Volume2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { sessionService, type AartiSession } from '@/services/sessionService';
import { getAartiById } from '@/services/aartiService';
import { type Aarti } from '@/types/aarti';
import EnhancedSessionStanzaDisplay from '@/components/EnhancedSessionStanzaDisplay';
import { useLanguage } from '@/contexts/LanguageContext';

interface SessionViewProps {
  params: Promise<{ id: string }>;
}

const SessionView = ({ params }: SessionViewProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<AartiSession | null>(null);
  const [currentAarti, setCurrentAarti] = useState<Aarti | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMarathi } = useLanguage();
  
  const role = searchParams.get('role') as 'creator' | 'participant';
  const participantName = searchParams.get('name') || 'Anonymous';
  const aartiId = searchParams.get('aartiId');
  const isCreator = role === 'creator';

  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract params
  useEffect(() => {
    params.then((resolvedParams) => {
      setSessionId(resolvedParams.id);
    });
  }, [params]);

  // Load aarti data
  useEffect(() => {
    const loadAarti = async () => {
      if (session?.currentAartiId || aartiId) {
        try {
          const aarti = await getAartiById(session?.currentAartiId || aartiId!);
          setCurrentAarti(aarti);
        } catch (error) {
          console.error('Failed to load aarti:', error);
          // Fallback to default aarti
          setCurrentAarti({
            id: 'default-aarti',
            title: { hinglish: 'Ganesha Aarti', marathi: 'गणेश आरती' },
            deity: 'ganesha',
            lyrics: {
              hinglish: `Sukhkarta Dukhharta Varta Vighnachi
Nurvi Purvi Prem Krupa Jaayachi
Sarvangi Sundar Uti Shendurachi
Kanthi Zhalar Mal Muktafalanchi

Jai Deva Jai Deva Jai Mangalmurti
Darshan Maatre Man-kamna Purti`,
              marathi: `सुखकर्ता दुःखहर्ता वर्ता विघ्नाची
नुरवी पुरवी प्रेम कृपा जाची
सर्वांगी सुंदर उती शेंदुराची
कंठी झळार मळ मुक्ताफळांची

जय देवा जय देवा जय मंगलमूर्ती
दर्शन मात्रे मनकामना पूर्ती`
            },
            slug: 'default-aarti',
            difficulty: 'easy',
            tags: ['default'],
            isPopular: true,
            isActive: true,
            createdAt: new Date() as any,
            updatedAt: new Date() as any
          });
        }
      }
    };

    loadAarti();
  }, [session?.currentAartiId, aartiId]);

  // Subscribe to session updates
  useEffect(() => {
    if (!sessionId) return;
    
    const unsubscribe = sessionService.subscribeToSession(sessionId, (updatedSession) => {
      if (!updatedSession) {
        toast.error('Session ended or not found');
        router.push('/join');
        return;
      }
      
      setSession(updatedSession);
      setIsLoading(false);
      
      // Update connection status based on session activity
      setConnectionStatus('connected');
    });

    return () => unsubscribe();
  }, [sessionId, router]);

  // Handle session synchronization for participants
  useEffect(() => {
    if (session && !isCreator) {
      // Sync current aarti position with session
      if (session.currentPosition !== currentStanzaIndex) {
        setCurrentStanzaIndex(session.currentPosition);
      }
      
      // Sync play/pause status
      const shouldBePlaying = session.status === 'active';
      if (shouldBePlaying !== isPlaying) {
        setIsPlaying(shouldBePlaying);
      }
    }
  }, [session, isCreator, currentStanzaIndex, isPlaying]);

  // Creator controls - update session when local state changes
  const updateSessionState = useCallback(async (newPosition?: number, newStatus?: 'active' | 'paused') => {
    if (!isCreator || !session || !currentAarti) return;
    
    try {
      if (newPosition !== undefined) {
        await sessionService.updateSessionContent(session.id, currentAarti.id, newPosition);
      }
      
      if (newStatus !== undefined) {
        await sessionService.updateSessionStatus(session.id, newStatus);
      }
    } catch (error) {
      console.error('Failed to update session state:', error);
      toast.error('Failed to sync with participants');
    }
  }, [isCreator, session, currentAarti]);

  // Handle stanza change (creator only)
  const handleStanzaChange = useCallback((newIndex: number) => {
    if (isCreator) {
      setCurrentStanzaIndex(newIndex);
      updateSessionState(newIndex);
    }
  }, [isCreator, updateSessionState]);

  // Handle play/pause (creator only)
  const handlePlayPause = useCallback(() => {
    if (isCreator) {
      const newStatus = isPlaying ? 'paused' : 'active';
      setIsPlaying(!isPlaying);
      updateSessionState(undefined, newStatus);
    }
  }, [isCreator, isPlaying, updateSessionState]);

  // Navigation controls (creator only)
  const handlePrevious = () => {
    if (isCreator && currentStanzaIndex > 0) {
      handleStanzaChange(currentStanzaIndex - 1);
    }
  };

  const handleNext = () => {
    if (isCreator) {
      handleStanzaChange(currentStanzaIndex + 1);
    }
  };

  // Leave session
  const handleLeaveSession = async () => {
    setIsLeaving(true);
    
    try {
      await sessionService.leaveSession(session!.id, participantName, isCreator);
      
      if (isCreator) {
        toast.success('Session ended successfully');
      } else {
        toast.success('Left session successfully');
      }
      
      router.push('/join');
    } catch (error) {
      console.error('Failed to leave session:', error);
      toast.error('Failed to leave session');
      setIsLeaving(false);
    }
  };

  // Show loading state
  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="w-80">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Loading Session...</h3>
            <p className="text-gray-600">Connecting to the aarti session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEndDialog(true)}
                className="hover:bg-orange-50"
                disabled={isLeaving}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isCreator ? 'End' : 'Leave'}
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h1 className="text-lg font-semibold text-gray-800">{session.sessionName}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {isCreator && <Crown className="h-4 w-4 text-amber-600" />}
                <span className="hidden sm:inline">
                  {isCreator ? 'Host' : 'Joined'}: {session.creatorName}
                </span>
                <Badge variant="outline" className="bg-white/80">
                  <Users className="h-3 w-3 mr-1" />
                  {session.participantCount}
                </Badge>
              </div>
              
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                className={connectionStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'}
              >
                {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Connection Alert */}
      {connectionStatus !== 'connected' && (
        <Alert className="mx-4 mt-4 border-yellow-200 bg-yellow-50">
          <Volume2 className="h-4 w-4" />
          <AlertDescription>
            {connectionStatus === 'reconnecting' 
              ? 'Reconnecting to session...' 
              : 'Connection lost. Trying to reconnect...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Role Info for Participants */}
      {!isCreator && (
        <div className="mx-4 mt-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Users className="h-4 w-4" />
            <AlertDescription>
              You're following along with <strong>{session.creatorName}</strong>'s session. 
              They control the aarti flow.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {currentAarti ? (
            <EnhancedSessionStanzaDisplay
              aarti={{
                id: currentAarti.id,
                title: isMarathi ? currentAarti.title.marathi : currentAarti.title.hinglish,
                deity: currentAarti.deity,
                lyrics: currentAarti.lyrics
              }}
              currentStanzaIndex={currentStanzaIndex}
              onStanzaChange={handleStanzaChange}
              onPlayPause={handlePlayPause}
              isPlaying={isPlaying}
              showControls={isCreator} // Only show controls for creator
              autoScroll={true}
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading aarti...</p>
            </div>
          )}
        </div>

        {/* Creator Controls */}
        {isCreator && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <Card className="bg-white/90 backdrop-blur-lg border-amber-200 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentStanzaIndex === 0}
                    className="glass-divine rounded-full w-10 h-10 p-0"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                    className="btn-spiritual text-white px-4 py-2 rounded-2xl"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="glass-divine rounded-full w-10 h-10 p-0"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEndDialog(true)}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    End
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Leave/End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreator ? 'End Session?' : 'Leave Session?'}
            </DialogTitle>
            <DialogDescription>
              {isCreator 
                ? `Are you sure you want to end "${session.sessionName}"? This will disconnect all participants.`
                : `Are you sure you want to leave "${session.sessionName}"?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowEndDialog(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleLeaveSession}
              disabled={isLeaving}
            >
              {isLeaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  {isCreator ? 'Ending...' : 'Leaving...'}
                </div>
              ) : (
                <>
                  <LogOut className="h-3 w-3 mr-1" />
                  {isCreator ? 'End Session' : 'Leave Session'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionView;
