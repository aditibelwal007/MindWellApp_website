// Mock data for Mental Wellness App

export const mockMoodEntries = [
  {
    id: '1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'happy',
    intensity: 8,
    notes: 'Had a great day at work, completed my project!',
    triggers: ['work', 'achievement']
  },
  {
    id: '2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'calm',
    intensity: 7,
    notes: 'Meditation session was very peaceful',
    triggers: ['meditation', 'relaxation']
  },
  {
    id: '3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'anxious',
    intensity: 4,
    notes: 'Worried about upcoming presentation',
    triggers: ['work', 'stress']
  },
  {
    id: '4',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'energetic',
    intensity: 9,
    notes: 'Morning run felt amazing!',
    triggers: ['exercise', 'morning']
  },
  {
    id: '5',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mood: 'sad',
    intensity: 3,
    notes: 'Missing family, feeling a bit lonely',
    triggers: ['family', 'loneliness']
  }
];

export const mockChatMessages = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m here to support you. How are you feeling today?',
    timestamp: new Date(Date.now() - 10000).toISOString()
  }
];

export const mockBreathingExercises = [
  {
    id: '1',
    name: '4-7-8 Breathing',
    description: 'Breathe in for 4 seconds, hold for 7, exhale for 8',
    duration: 240,
    pattern: { inhale: 4, hold: 7, exhale: 8 }
  },
  {
    id: '2',
    name: 'Box Breathing',
    description: 'Equal counts for inhale, hold, exhale, hold',
    duration: 180,
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  },
  {
    id: '3',
    name: 'Deep Calm',
    description: 'Slow deep breathing for relaxation',
    duration: 300,
    pattern: { inhale: 5, hold: 5, exhale: 5 }
  }
];

export const mockMindfulnessContent = [
  {
    id: '1',
    title: 'Morning Gratitude',
    type: 'exercise',
    duration: 5,
    description: 'Start your day by reflecting on three things you\'re grateful for'
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    type: 'meditation',
    duration: 10,
    description: 'Progressive relaxation through body awareness'
  },
  {
    id: '3',
    title: 'Mindful Walking',
    type: 'exercise',
    duration: 15,
    description: 'Practice awareness while walking slowly'
  },
  {
    id: '4',
    title: 'Evening Reflection',
    type: 'journal',
    duration: 10,
    description: 'Journal about your day and emotions'
  }
];