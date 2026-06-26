import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { storage } from '../utils/storage';
import { toast } from '../hooks/use-toast';
import { Heart, Smile, Frown, Meh, Zap, Coffee, Moon, ThermometerSun } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const MoodTracker = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = () => {
    const entries = storage.getMoodEntries();
    setMoodHistory(entries);
  };

  const moods = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'from-yellow-400 to-orange-400', emoji: '😊' },
    { value: 'calm', label: 'Calm', icon: Heart, color: 'from-green-400 to-teal-400', emoji: '😌' },
    { value: 'energetic', label: 'Energetic', icon: Zap, color: 'from-purple-400 to-pink-400', emoji: '⚡' },
    { value: 'anxious', label: 'Anxious', icon: ThermometerSun, color: 'from-red-400 to-pink-400', emoji: '😰' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'from-blue-400 to-indigo-400', emoji: '😢' },
    { value: 'tired', label: 'Tired', icon: Coffee, color: 'from-slate-400 to-slate-500', emoji: '😴' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'from-gray-400 to-gray-500', emoji: '😐' },
    { value: 'angry', label: 'Angry', icon: Moon, color: 'from-red-500 to-orange-500', emoji: '😠' }
  ];

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!selectedMood) {
    toast({
      title: "Please select a mood",
      variant: "destructive",
    });
    return;
  }

  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    mood: selectedMood,
    intensity,
    notes,
    triggers: triggers
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t),
  };

  // Save mood entry
  storage.saveMoodEntry(entry);

  // Mood → Game Mapping
  
 const gameRecommendations = {
  happy: {
    game: "Puzzle Game",
    section: "puzzle",
    reason: "You're feeling happy. Enjoy a fun memory challenge.",
  },
  calm: {
    game: "Puzzle Game",
    section: "puzzle",
    reason: "Your mind is calm and focused. Puzzle games are perfect.",
  },
  energetic: {
    game: "Puzzle Game",
    section: "puzzle",
    reason: "Use your energy to solve engaging challenges.",
  },
  anxious: {
    game: "Breathing Exercise",
    section: "breathing",
    reason: "Breathing exercises help reduce anxiety and stress.",
  },
  sad: {
    game: "Breathing Exercise",
    section: "breathing",
    reason: "Deep breathing can help relax and improve your mood.",
  },
  tired: {
    game: "Meditation Timer",
    section: "meditation",
    reason: "Meditation can help restore your energy and focus.",
  },
  neutral: {
    game: "Meditation Timer",
    section: "meditation",
    reason: "A short meditation session can refresh your mind.",
  },
  angry: {
    game: "Breathing Exercise",
    section: "breathing",
    reason: "Controlled breathing can help manage anger.",
  },
};

const recommendation =
  gameRecommendations[selectedMood] || {
    game: "Breathing Exercise",
    section: "breathing",
    reason: "Relax and focus.",
  };
  const moodAnalysis = {
  mood: selectedMood,
  intensity,
  notes,
  triggers: triggers
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t),

  recommendedGame: recommendation.game,
  recommendedSection: recommendation.section,
  reason: recommendation.reason,

  timestamp: new Date().toISOString(),
};

  localStorage.setItem(
    "moodAnalysis",
    JSON.stringify(moodAnalysis)
  );

  toast({
    title: "Mood logged successfully!",
    description: `Recommended Game: ${recommendation.game}`,
  });

  setSelectedMood("");
  setIntensity(5);
  setNotes("");
  setTriggers("");

  loadMoodHistory();

  setTimeout(() => {
    navigate("/games");
  }, 1500);
};

  const getMoodColor = (mood) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.color : 'from-teal-400 to-blue-400';
  };

  const getMoodEmoji = (mood) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.emoji : '😊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Mood Analyzer</h1>
          <p className="text-lg text-slate-600">How are you feeling today?</p>
        </div>

        {/* Mood Entry Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Log Your Mood</CardTitle>
            <CardDescription>Track your emotions with detailed insights</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Your Mood</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {moods.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          selectedMood === mood.value
                            ? 'border-teal-500 bg-teal-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-teal-300'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center mb-2 text-2xl`}>
                          {mood.emoji}
                        </div>
                        <div className="text-sm font-medium text-slate-700">{mood.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Intensity: <span className="text-teal-600">{intensity}/10</span>
                </Label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <span className="text-sm text-slate-600">High</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{width: `${intensity * 10}%`}}
                  ></div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-semibold">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="What's on your mind? Describe your feelings..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-32 resize-none transition-all duration-200 focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Triggers */}
              <div className="space-y-3">
                <Label htmlFor="triggers" className="text-base font-semibold">Triggers (Optional)</Label>
                <Input
                  id="triggers"
                  placeholder="e.g., work, exercise, family (comma-separated)"
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-teal-400"
                />
                <p className="text-sm text-slate-500">Separate multiple triggers with commas</p>
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 py-6 text-lg"
              >
                Save Mood Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Mood History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Your Mood History</h2>
          
          {moodHistory.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No mood entries yet. Start tracking above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {moodHistory.map((entry) => (
                <Card 
                  key={entry.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getMoodColor(entry.mood)} flex items-center justify-center text-3xl flex-shrink-0`}>
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-800 capitalize">{entry.mood}</h3>
                          <span className="text-sm text-slate-500">
                            {new Date(entry.date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-slate-600">Intensity:</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-xs">
                            <div 
                              className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full"
                              style={{width: `${entry.intensity * 10}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{entry.intensity}/10</span>
                        </div>
                        {entry.notes && <p className="text-slate-600 mb-2">{entry.notes}</p>}
                        {entry.triggers && entry.triggers.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {entry.triggers.map((trigger, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
                              >
                                {trigger}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;