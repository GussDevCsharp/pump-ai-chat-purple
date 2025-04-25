
import { ChatSession } from "@/types/chat";

const LOCAL_SESSIONS_KEY = 'anonymous_chat_sessions';

export const loadLocalSessions = (): ChatSession[] => {
  try {
    const saved = localStorage.getItem(LOCAL_SESSIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading local sessions:', err);
  }
  return [];
};

export const saveLocalSessions = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving local sessions:', err);
  }
};

export const deleteLocalSession = (sessionId: string, currentSessions: ChatSession[]): ChatSession[] => {
  const updatedSessions = currentSessions.filter(session => session.id !== sessionId);
  saveLocalSessions(updatedSessions);
  return updatedSessions;
};

