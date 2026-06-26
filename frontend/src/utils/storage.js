// LocalStorage utility functions

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'mw_mood_entries',
  CHAT_MESSAGES: 'mw_chat_messages',
  USER_PROFILE: 'mw_user_profile',
  AUTH_TOKEN: 'mw_auth_token',
  MEDITATION_SESSIONS: 'mw_meditation_sessions'
};

export const storage = {
  // Mood entries
  getMoodEntries: () => {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
    return data ? JSON.parse(data) : [];
  },
  
  saveMoodEntry: (entry) => {
    const entries = storage.getMoodEntries();
    entries.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
  },
  
  // Chat messages
  getChatMessages: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return data ? JSON.parse(data) : [];
  },
  
  saveChatMessage: (message) => {
    const messages = storage.getChatMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  },
  
  clearChatMessages: () => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify([]));
  },

  // Auth
  getAuthToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  
  setAuthToken: (token) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  
  removeAuthToken: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
  
  // User profile
  getUserProfile: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },
  
  setUserProfile: (profile) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },
  
  // Meditation sessions
  getMeditationSessions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.MEDITATION_SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  
  saveMeditationSession: (session) => {
    const sessions = storage.getMeditationSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.MEDITATION_SESSIONS, JSON.stringify(sessions));
  },

  // 🔥 CLEAR ALL LOCAL HISTORY
  clearAllHistory: () => {
    localStorage.removeItem(STORAGE_KEYS.MOOD_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.MEDITATION_SESSIONS);
  }
};
