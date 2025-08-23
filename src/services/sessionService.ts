import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AartiSession {
  id: string;
  sessionName: string;
  creatorName: string;
  currentAartiId: string | null;
  currentPosition: number;
  status: 'active' | 'paused';
  participantCount: number;
  createdAt: any;
  lastActivity: any;
  isActive: boolean;
}

export interface SessionParticipant {
  id: string;
  name: string;
  joinedAt: any;
  isActive: boolean;
}

const SESSIONS_COLLECTION = 'activeSessions';
const PARTICIPANTS_COLLECTION = 'sessionParticipants';

class SessionService {
  
  // Create a new aarti session
  async createSession(sessionName: string, creatorName: string, aartiId?: string): Promise<string> {
    try {
      const sessionData = {
        sessionName: sessionName.trim(),
        creatorName: creatorName.trim(),
        currentAartiId: aartiId || null,
        currentPosition: 0,
        status: 'active' as const,
        participantCount: 1,
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
        isActive: true
      };

      const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
      
      // Add creator as first participant
      await this.addParticipant(docRef.id, creatorName, true);
      
      console.log('🎵 Session created successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating session:', error);
      throw error;
    }
  }

  // Get all active sessions
  async getActiveSessions(): Promise<AartiSession[]> {
    try {
      const q = query(
        collection(db, SESSIONS_COLLECTION),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AartiSession));
      
      // Sort by createdAt on client side to avoid compound index requirement
      return sessions.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.getTime?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.getTime?.() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('❌ Error fetching active sessions:', error);
      throw error;
    }
  }

  // Listen to active sessions in real-time
  subscribeToActiveSessions(callback: (sessions: AartiSession[]) => void) {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('isActive', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AartiSession));
      
      // Sort by createdAt on client side to avoid compound index requirement
      const sortedSessions = sessions.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.getTime?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.getTime?.() || 0;
        return bTime - aTime;
      });
      
      callback(sortedSessions);
    });
  }

  // Listen to a specific session
  subscribeToSession(sessionId: string, callback: (session: AartiSession | null) => void) {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    
    return onSnapshot(sessionRef, (doc) => {
      if (doc.exists()) {
        const session = { id: doc.id, ...doc.data() } as AartiSession;
        callback(session);
      } else {
        callback(null);
      }
    });
  }

  // Join an existing session
  async joinSession(sessionId: string, participantName: string): Promise<void> {
    try {
      const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
      
      // Increment participant count
      await updateDoc(sessionRef, {
        participantCount: increment(1),
        lastActivity: serverTimestamp()
      });

      // Add participant
      await this.addParticipant(sessionId, participantName, false);
      
      console.log('👥 Joined session successfully:', sessionId);
    } catch (error) {
      console.error('❌ Error joining session:', error);
      throw error;
    }
  }

  // Leave a session
  async leaveSession(sessionId: string, participantName: string, isCreator: boolean = false): Promise<void> {
    try {
      const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);

      if (isCreator) {
        // If creator leaves, end the session
        await this.endSession(sessionId);
      } else {
        // Decrement participant count
        await updateDoc(sessionRef, {
          participantCount: increment(-1),
          lastActivity: serverTimestamp()
        });

        // Remove participant
        await this.removeParticipant(sessionId, participantName);
      }
      
      console.log('👋 Left session successfully:', sessionId);
    } catch (error) {
      console.error('❌ Error leaving session:', error);
      throw error;
    }
  }

  // Update session status (creator only)
  async updateSessionStatus(sessionId: string, status: 'active' | 'paused'): Promise<void> {
    try {
      const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
      await updateDoc(sessionRef, {
        status,
        lastActivity: serverTimestamp()
      });
      
      console.log('🔄 Session status updated:', status);
    } catch (error) {
      console.error('❌ Error updating session status:', error);
      throw error;
    }
  }

  // Update current aarti and position (creator only)
  async updateSessionContent(sessionId: string, aartiId: string, position: number): Promise<void> {
    try {
      const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
      await updateDoc(sessionRef, {
        currentAartiId: aartiId,
        currentPosition: position,
        lastActivity: serverTimestamp()
      });
      
      console.log('🎵 Session content updated:', aartiId, position);
    } catch (error) {
      console.error('❌ Error updating session content:', error);
      throw error;
    }
  }

  // End session (creator only)
  async endSession(sessionId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Mark session as inactive
      const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
      batch.update(sessionRef, {
        isActive: false,
        status: 'paused',
        lastActivity: serverTimestamp()
      });

      // Clean up participants
      await this.cleanupParticipants(sessionId);
      
      await batch.commit();
      
      console.log('🔚 Session ended successfully:', sessionId);
    } catch (error) {
      console.error('❌ Error ending session:', error);
      throw error;
    }
  }

  // Add participant to session
  private async addParticipant(sessionId: string, participantName: string, isCreator: boolean): Promise<void> {
    try {
      await addDoc(collection(db, `${SESSIONS_COLLECTION}/${sessionId}/${PARTICIPANTS_COLLECTION}`), {
        name: participantName.trim(),
        joinedAt: serverTimestamp(),
        isActive: true,
        isCreator
      });
    } catch (error) {
      console.error('❌ Error adding participant:', error);
      throw error;
    }
  }

  // Remove participant from session
  private async removeParticipant(sessionId: string, participantName: string): Promise<void> {
    try {
      const q = query(
        collection(db, `${SESSIONS_COLLECTION}/${sessionId}/${PARTICIPANTS_COLLECTION}`),
        where('name', '==', participantName),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('❌ Error removing participant:', error);
      throw error;
    }
  }

  // Clean up all participants when session ends
  private async cleanupParticipants(sessionId: string): Promise<void> {
    try {
      const snapshot = await getDocs(
        collection(db, `${SESSIONS_COLLECTION}/${sessionId}/${PARTICIPANTS_COLLECTION}`)
      );
      
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('❌ Error cleaning up participants:', error);
      throw error;
    }
  }

  // Clean up old inactive sessions (utility function)
  async cleanupOldSessions(): Promise<void> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 24); // 24 hours ago
      
      const q = query(
        collection(db, SESSIONS_COLLECTION),
        where('isActive', '==', false),
        where('lastActivity', '<', cutoffTime)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`🧹 Cleaned up ${snapshot.size} old sessions`);
    } catch (error) {
      console.error('❌ Error cleaning up old sessions:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;
