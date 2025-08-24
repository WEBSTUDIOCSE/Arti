'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, Play, RefreshCw, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { sessionService, type AartiSession } from '@/services/sessionService';
import { getAartiById } from '@/services/aartiService';
import { Aarti } from '@/types/aarti';
import { useLanguage } from '@/contexts/LanguageContext';
import IOSAartiCard from '@/components/IOSAartiCard';

const JoinSessionPage = () => {
  const [activeSessions, setActiveSessions] = useState<AartiSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
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

  const handleJoinSession = async (sessionId: string) => {
    setIsJoining(sessionId);
    
    try {
      await sessionService.joinSession(sessionId, 'Listener');
      toast.success('Joined session successfully! 🎵');
      
      router.push(`/session/${sessionId}?role=participant&name=Listener`);
    } catch (error) {
      console.error('Failed to join session:', error);
      toast.error('Failed to join session. It may have ended.');
    } finally {
      setIsJoining(null);
    }
  };

  const refreshSessions = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

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
                <ChevronLeft className="h-4 w-4 mr-2" />
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
                Host Session
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
                  There are currently no aarti sessions happening. Start your own session to share with others.
                </p>
                <Button
                  onClick={() => router.push('/create-session')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Host New Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Active Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSessions.map((session) => {
                  const aarti = sessionAartis[session.id];
                  
                  return (
                    <Card
                      key={session.id}
                      className="bg-white/80 backdrop-blur-lg border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      onClick={() => handleJoinSession(session.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg text-gray-800 truncate mb-1">
                              {aarti ? (isMarathi ? aarti.title.marathi : aarti.title.hinglish) : 'Loading...'}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {formatTimeAgo(session.createdAt)}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 border-green-200"
                          >
                            Live
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Aarti Preview */}
                        {aarti && (
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200">
                            <IOSAartiCard
                              aarti={aarti}
                              isSelected={false}
                              onSelect={() => {}}
                              compact={true}
                            />
                          </div>
                        )}

                        {/* Session Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>Active session</span>
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={isJoining === session.id}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinSession(session.id);
                            }}
                          >
                            {isJoining === session.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Joining...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Play className="h-3 w-3" />
                                Join
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
    </div>
  );
};

export default JoinSessionPage;
