import { sessionService } from '@/services/sessionService';

export const createTestSessions = async () => {
  try {
    // Create some sample sessions for demo purposes
    const testSessions = [
      {
        sessionName: 'Sharma Family Evening Aarti',
        creatorName: 'Priya Sharma'
      },
      {
        sessionName: 'Diwali Special Session',
        creatorName: 'Ajay Gupta'
      },
      {
        sessionName: 'Morning Prayers',
        creatorName: 'Sunita Patel'
      }
    ];

    const createdSessions = [];
    
    for (const session of testSessions) {
      try {
        const sessionId = await sessionService.createSession(
          session.sessionName, 
          session.creatorName
        );
        createdSessions.push({ ...session, id: sessionId });
        console.log(`✅ Created session: ${session.sessionName}`);
      } catch (error) {
        console.error(`❌ Failed to create session: ${session.sessionName}`, error);
      }
    }

    return createdSessions;
  } catch (error) {
    console.error('❌ Failed to create test sessions:', error);
    return [];
  }
};

export const cleanupTestSessions = async () => {
  try {
    // Clean up old inactive sessions
    await sessionService.cleanupOldSessions();
    console.log('🧹 Test sessions cleaned up');
  } catch (error) {
    console.error('❌ Failed to cleanup test sessions:', error);
  }
};
