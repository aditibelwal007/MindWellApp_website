import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { storage } from '../utils/storage';
import { Heart, Sparkles, MessageCircle, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [moodEntries, setMoodEntries] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    averageMood: 0,
    thisWeekAverage: 0
  });

  useEffect(() => {
    const entries = storage.getMoodEntries();
    setMoodEntries(entries.slice(0, 5));

    // Calculate stats
    if (entries.length > 0) {
      const totalIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0);
      const avgMood = (totalIntensity / entries.length).toFixed(1);

      // Calculate this week's average
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const thisWeekEntries = entries.filter(e => new Date(e.date) >= weekAgo);
      const weekIntensity = thisWeekEntries.reduce((sum, entry) => sum + entry.intensity, 0);
      const weekAvg = thisWeekEntries.length > 0 ? (weekIntensity / thisWeekEntries.length).toFixed(1) : 0;

      setStats({
        totalEntries: entries.length,
        currentStreak: Math.min(entries.length, 7),
        averageMood: avgMood,
        thisWeekAverage: weekAvg
      });
    }
  }, []);

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      energetic: '⚡',
      tired: '😴',
      angry: '😠',
      neutral: '😐'
    };
    return emojis[mood] || '😊';
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-yellow-400 to-orange-400',
      sad: 'from-blue-400 to-indigo-400',
      anxious: 'from-red-400 to-pink-400',
      calm: 'from-green-400 to-teal-400',
      energetic: 'from-purple-400 to-pink-400',
      tired: 'from-slate-400 to-slate-500',
      angry: 'from-red-500 to-orange-500',
      neutral: 'from-gray-400 to-gray-500'
    };
    return colors[mood] || 'from-teal-400 to-blue-400';
  };

  const quickActions = [
    {
      title: 'Track Mood',
      description: 'Log how you\'re feeling',
      icon: Heart,
      color: 'from-pink-400 to-rose-400',
      path: '/mood-tracker'
    },
    {
      title: 'Play Games',
      description: 'Relax with calming activities',
      icon: Sparkles,
      color: 'from-purple-400 to-indigo-400',
      path: '/games'
    },
    {
      title: 'Chat Support',
      description: 'Talk to AI assistant',
      icon: MessageCircle,
      color: 'from-teal-400 to-cyan-400',
      path: '/chat'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Welcome Back!</h1>
          <p className="text-lg text-slate-600">Here's your wellness overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription>Total Entries</CardDescription>
              <CardTitle className="text-4xl font-bold text-teal-600">
                {stats.totalEntries}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                All time tracking
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription>Current Streak</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-600">
                {stats.currentStreak}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Days in a row
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription>Average Mood</CardDescription>
              <CardTitle className="text-4xl font-bold text-indigo-600">
                {stats.averageMood}/10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <Heart className="w-4 h-4 mr-2" />
                Overall wellness
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl font-bold text-purple-600">
                {stats.thisWeekAverage}/10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Weekly average
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{action.title}</h3>
                    <p className="text-slate-600">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Clear History Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              if (window.confirm("Are you sure? This will permanently delete all mood entries, chat history, and data.")) {
                storage.clearAllHistory();
                alert("History cleared successfully!");
                window.location.reload();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            Clear All History
          </button>
        </div>



        {/* Recent Mood Entries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Recent Mood Entries</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/mood-tracker')}
              className="border-teal-300 text-teal-600 hover:bg-teal-50"
            >
              View All
            </Button>
          </div>

          {moodEntries.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">No mood entries yet</p>
                <Button
                  onClick={() => navigate('/mood-tracker')}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                >
                  Track Your First Mood
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {moodEntries.map((entry) => (
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
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-slate-600">Intensity:</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-xs">
                            <div
                              className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${entry.intensity * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{entry.intensity}/10</span>
                        </div>
                        <p className="text-slate-600">{entry.notes}</p>
                        {entry.triggers && entry.triggers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
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

export default Dashboard;