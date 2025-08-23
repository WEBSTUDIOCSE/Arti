'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Clock, Play, UserPlus, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { sessionService, type AartiSession } from '@/services/sessionService';

const JoinSessionPage = () => {
  const [activeSessions, setActiveSessions] = useState<AartiSession[]>([]);
  const [participantName, setParticipantName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const router = useRouter();

  // Subscribe to active sessions
  useEffect(() => {
    const unsubscribe = sessionService.subscribeToActiveSessions((sessions) => {
      setActiveSessions(sessions);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    if (!selectedSessionId || !participantName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsJoining(selectedSessionId);
    
    try {
      await sessionService.joinSession(selectedSessionId, participantName.trim());
      
      toast.success('Joined session successfully! 🎵');
      setShowNameDialog(false);
      
      // Navigate to the session view as participant
      router.push(`/session/${selectedSessionId}?role=participant&name=${encodeURIComponent(participantName.trim())}`);
    } catch (error) {
      console.error('Failed to join session:', error);
      toast.error('Failed to join session. Please try again.');
    } finally {
      setIsJoining(null);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // The subscription will automatically update the sessions
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-amber-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
            <h1 className="text-xl font-semibold text-gray-800">Join Aarti Session</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="hover:bg-orange-50"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white/80 backdrop-blur-lg border-amber-200 shadow-xl mb-6">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800 mb-2">
              🕉️ Active Aarti Sessions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join your family and friends in live aarti sessions happening right now
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-20"></div>
                ))}
              </div>
            ) : activeSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Sessions</h3>
                <p className="text-gray-600 mb-6">No one is hosting an aarti session right now.</p>
                
                <Button 
                  onClick={() => router.push('/create-session')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Session
                </Button>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <Card key={session.id} className="border border-amber-200 hover:border-orange-300 transition-colors duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <h3 className="font-semibold text-gray-800">{session.sessionName}</h3>
                              <Badge 
                                variant={session.status === 'active' ? 'default' : 'secondary'}
                                className={session.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}
                              >
                                {session.status === 'active' ? 'Live' : 'Paused'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <UserPlus className="h-3 w-3" />
                                by {session.creatorName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {session.participantCount} people
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(session.createdAt)}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleJoinClick(session.id)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                            disabled={isJoining === session.id}
                          >
                            {isJoining === session.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                Joining...
                              </div>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Join
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Create Session Card */}
        {activeSessions.length > 0 && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Want to host your own session?</h3>
              <p className="text-gray-600 mb-4">Start a new aarti session for your family and friends</p>
              <Button 
                onClick={() => router.push('/create-session')}
                variant="outline"
                className="border-orange-400 text-orange-700 hover:bg-orange-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Session
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Join Session Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Join Session</DialogTitle>
            <DialogDescription>
              Enter your name to join {activeSessions.find(s => s.id === selectedSessionId)?.sessionName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joinName">Your Name</Label>
              <Input
                id="joinName"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g., Arjun Sharma"
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                maxLength={30}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNameDialog(false)}
                className="flex-1"
                disabled={isJoining === selectedSessionId}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleJoinSession}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                disabled={!participantName.trim() || isJoining === selectedSessionId}
              >
                {isJoining === selectedSessionId ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </div>
                ) : (
                  'Join Session'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinSessionPage;
