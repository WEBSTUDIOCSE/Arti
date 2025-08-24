'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Clock, Play, UserPlus, RefreshCw, Plus, Crown, Star, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { sessionService, type AartiSession } from '@/services/sessionService';
import { getAartiById } from '@/services/aartiService';
import { Aarti } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import IOSAartiCard from '@/components/IOSAartiCard';

const EnhancedJoinSessionPage = () => {
  const [activeSessions, setActiveSessions] = useState<AartiSession[]>([]);
  const [participantName, setParticipantName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionAartis, setSessionAartis] = useState<{ [sessionId: string]: Aarti | null }>({});
  const router = useRouter();
  const { isMarathi } = useLanguage();

  // Subscribe to active sessions
  useEffect(() => {
    const unsubscribe = sessionService.subscribeToActiveSessions((sessions) => {
      setActiveSessions(sessions);
      setIsLoading(false);
      
      // Load aarti details for each session
      sessions.forEach(async (session) => {
        if (session.currentAartiId && !sessionAartis[session.id]) {
          try {
            const aarti = await getAartiById(session.currentAartiId);
            setSessionAartis(prev => ({
              ...prev,
              [session.id]: aarti
            }));
          } catch (error) {
            console.error(`Failed to load aarti for session ${session.id}:`, error);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [sessionAartis]);

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const created = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleJoinClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowNameDialog(true);
  };

  const handleJoinSession = async () => {
    if (!participantName.trim() || !selectedSessionId) {
      toast.error('Please enter your name');
      return;
    }

    setIsJoining(selectedSessionId);
    
    try {
      await sessionService.joinSession(selectedSessionId, participantName.trim());
      toast.success(`Welcome to the session! 🎵`);
      
      router.push(`/session/${selectedSessionId}?role=participant&name=${encodeURIComponent(participantName.trim())}`);
    } catch (error) {
      console.error('Failed to join session:', error);
      toast.error('Failed to join session. It may have ended.');
    } finally {
      setIsJoining(null);
      setShowNameDialog(false);
      setParticipantName('');
      setSelectedSessionId(null);
    }
  };

  const refreshSessions = () => {
    setIsLoading(true);
    // The subscription will automatically refresh
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getSessionPreview = (session: AartiSession) => {
    const aarti = sessionAartis[session.id];
    if (!aarti) return null;

    const title = isMarathi ? aarti.title.marathi : aarti.title.hinglish;
    const lyrics = isMarathi ? aarti.lyrics.marathi : aarti.lyrics.hinglish;
    const previewLyrics = lyrics.split('\n').slice(0, 2).join('\n');

    return { title, previewLyrics, aarti };
  };

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
                onClick={() => router.back()}
                className="hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Join Aarti Session</h1>
                <p className="text-sm text-gray-600">
                  {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshSessions}
                disabled={isLoading}
                className="hover:bg-orange-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => router.push('/create-session')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading active sessions...</p>
              </div>
            </div>
          ) : activeSessions.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Sessions</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no aarti sessions happening. Start your own session to invite family and friends.
                </p>
                <Button
                  onClick={() => router.push('/create-session')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Active Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSessions.map((session) => {
                  const preview = getSessionPreview(session);
                  
                  return (
                    <Card
                      key={session.id}
                      className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => handleJoinClick(session.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                              {session.sessionName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Crown className="h-3 w-3 text-amber-600" />
                                <span className="text-amber-700 font-medium">{session.creatorName}</span>
                              </div>
                            </CardDescription>
                          </div>
                          <Badge 
                            className={`${
                              session.status === 'active' 
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            }`}
                            variant="outline"
                          >
                            {session.status === 'active' ? 'Live' : 'Paused'}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Aarti Full Content */}
                        {preview && (
                          <IOSAartiCard
                            aarti={preview.aarti}
                            isSelected={false}
                            onSelect={() => {}}
                            showSelection={false}
                            showPreview={false}
                            className="border-0 shadow-none bg-gradient-to-r from-amber-50 to-orange-50"
                          />
                        )}

                        <Separator />

                        {/* Session Info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{session.participantCount} participant{session.participantCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimeAgo(session.createdAt)}</span>
                            </div>
                          </div>

                          <Button
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white group-hover:shadow-md transition-all"
                            disabled={isJoining === session.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinClick(session.id);
                            }}
                          >
                            {isJoining === session.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Joining...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Join {session.sessionName}
                              </div>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Join Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Join Session</DialogTitle>
            <DialogDescription>
              Enter your name to join{' '}
              <strong>{activeSessions.find(s => s.id === selectedSessionId)?.sessionName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="participantName">Your Name</Label>
              <Input
                id="participantName"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g., Rahul Sharma"
                className="border-orange-200 focus:border-orange-400"
                maxLength={30}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                autoFocus
              />
              <p className="text-xs text-gray-500">
                This is how others will see you in the session
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNameDialog(false);
                  setParticipantName('');
                  setSelectedSessionId(null);
                }}
                disabled={isJoining === selectedSessionId}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinSession}
                disabled={!participantName.trim() || isJoining === selectedSessionId}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                {isJoining === selectedSessionId ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Join Session
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedJoinSessionPage;
