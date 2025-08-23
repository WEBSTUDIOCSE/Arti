'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
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
import SessionStanzaDisplay from '@/components/SessionStanzaDisplay';
import { useLanguage } from '@/contexts/LanguageContext';

interface SessionViewProps {
  params: Promise<{ id: string }>;
}

const SessionView = ({ params }: SessionViewProps) => {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  
  const [session, setSession] = useState<AartiSession | null>(null);
  const [currentAarti, setCurrentAarti] = useState<Aarti | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMarathi } = useLanguage();
  
  const role = searchParams.get('role') as 'creator' | 'participant';
  const participantName = searchParams.get('name') || 'Anonymous';
  const aartiId = searchParams.get('aartiId');
  const isCreator = role === 'creator';

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
      
      // Sync play/pause state
      const shouldPlay = session.status === 'active';
      if (shouldPlay !== isPlaying) {
        setIsPlaying(shouldPlay);
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
    if (!isCreator) return;
    
    setCurrentStanzaIndex(newIndex);
    updateSessionState(newIndex);
  }, [isCreator, updateSessionState]);

  // Handle play/pause (creator only)
  const handlePlayPause = useCallback(() => {
    if (!isCreator) return;
    
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    updateSessionState(undefined, newPlayingState ? 'active' : 'paused');
  }, [isCreator, isPlaying, updateSessionState]);

  // Handle leaving session
  const handleLeaveSession = useCallback(async () => {
    if (isLeaving) return;
    
    setIsLeaving(true);
    
    try {
      if (isCreator) {
        // Creator ending session - show confirmation dialog
        setShowEndDialog(true);
      } else {
        // Participant leaving session
        await sessionService.leaveSession(sessionId, participantName);
        toast.success('Left session successfully');
        router.push('/join');
      }
    } catch (error) {
      console.error('Failed to leave session:', error);
      toast.error('Error leaving session');
    } finally {
      setIsLeaving(false);
    }
  }, [isCreator, isLeaving, sessionId, participantName, router]);

  // Handle ending session (creator only)
  const handleEndSession = useCallback(async () => {
    if (!isCreator || isLeaving) return;
    
    setIsLeaving(true);
    
    try {
      await sessionService.endSession(sessionId);
      toast.success('Session ended successfully');
      router.push('/join');
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Error ending session');
    } finally {
      setIsLeaving(false);
      setShowEndDialog(false);
    }
  }, [isCreator, isLeaving, sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">This session may have ended or doesn't exist.</p>
          <Button onClick={() => router.push('/join')} className="bg-orange-500 hover:bg-orange-600">
            Back to Join Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/join')}
                className="hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Leave
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{session.sessionName}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {isCreator ? (
                    <Badge variant="default" className="bg-amber-100 text-amber-800">
                      <Crown className="h-3 w-3 mr-1" />
                      Host
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      Participant
                    </Badge>
                  )}
                  <span>•</span>
                  <span>{session.participantCount} {session.participantCount === 1 ? 'person' : 'people'}</span>
                  <span>•</span>
                  <div className={`flex items-center gap-1 ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'reconnecting' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500' : 
                      connectionStatus === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'reconnecting' ? 'Reconnecting' : 'Disconnected'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveSession}
                disabled={isLeaving}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                {isCreator ? 'End Session' : 'Leave'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Participant Alert */}
      {!isCreator && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Users className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
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
            <SessionStanzaDisplay
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
      </main>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Session?</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this session? All participants will be disconnected 
              and the session will be removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowEndDialog(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEndSession}
              disabled={isLeaving}
            >
              {isLeaving ? 'Ending...' : 'End Session'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionView;
