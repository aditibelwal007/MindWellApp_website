import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Wind, Grid3x3, Timer, Play, Pause, RotateCcw } from "lucide-react";
import { mockBreathingExercises } from "../mock";
import { storage } from "../utils/storage";
import { toast } from "../hooks/use-toast";

/* ---------------------------------------------------
   MAIN GAMES PAGE
--------------------------------------------------- */
const Games = () => {
 const moodData = (() => {
  try {
    return JSON.parse(localStorage.getItem("moodAnalysis"));
  } catch {
    return null;
  }
})();

const getRecommendedTab = () => {
  if (!moodData) return "breathing";

  switch (moodData.mood) {
    case "sad":
    case "anxious":
    case "angry":
      return "breathing";

    case "happy":
    case "calm":
      return "puzzle";

    case "energetic":
      return "puzzle";

    case "tired":
    case "neutral":
      return "meditation";

    default:
      return "breathing";
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">
            Calming Games
          </h1>

          <p className="text-lg text-slate-600">
            Relax and unwind with mindful activities
          </p>
        </div>

        {moodData && (
  <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white">
    <CardContent className="p-6">
      <h2 className="text-xl font-bold mb-2">
        Recommended For You
      </h2>

      <p>
        <strong>Mood:</strong> {moodData.mood}
      </p>

      <p>
        <strong>Intensity:</strong> {moodData.intensity}/10
      </p>

      <p>
        <strong>Recommended Game:</strong>{" "}
        {moodData.recommendedGame}
      </p>

      <p className="text-sm text-teal-100 mt-2">
        {moodData.reason}
      </p>

      <div className="mt-4 p-3 bg-white/20 rounded-lg">
        <p className="font-semibold">
          Recommended Section:
          {" "}
          {getRecommendedTab() === "breathing"
            ? "🌬️ Breathing Exercises"
            : getRecommendedTab() === "puzzle"
            ? "🧩 Puzzle Games"
            : "🧘 Meditation Timer"}
        </p>
      </div>

    </CardContent>
  </Card>
)}

<Tabs defaultValue={getRecommendedTab()} className="w-full">
  <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg p-1 h-auto">
    <TabsTrigger value="breathing">
      <Wind className="w-4 h-4 mr-2" />
      Breathing
    </TabsTrigger>

    <TabsTrigger value="puzzle">
      <Grid3x3 className="w-4 h-4 mr-2" />
      Puzzle
    </TabsTrigger>

    <TabsTrigger value="meditation">
      <Timer className="w-4 h-4 mr-2" />
      Meditation
    </TabsTrigger>
  </TabsList>

  <TabsContent value="breathing" className="mt-6">
    <BreathingExercises />
  </TabsContent>

  <TabsContent value="puzzle" className="mt-6">
    <PuzzleGames />
  </TabsContent>

  <TabsContent value="meditation" className="mt-6">
    <MeditationTimer />
  </TabsContent>
</Tabs>

      </div>
    </div>
  );
};
/* ---------------------------------------------------
   BREATHING EXERCISES
--------------------------------------------------- */
const BreathingExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive || !selectedExercise) return;

    const pattern = selectedExercise.pattern;
    let currentPhase = phase;
    let currentCount = count;

    const interval = setInterval(() => {
      currentCount++;

      if (currentPhase === 'inhale' && currentCount >= pattern.inhale) {
        currentPhase = 'hold';
        currentCount = 0;
      } else if (currentPhase === 'hold' && currentCount >= pattern.hold) {
        currentPhase = 'exhale';
        currentCount = 0;
      } else if (currentPhase === 'exhale' && currentCount >= pattern.exhale) {
        currentPhase = 'inhale';
        currentCount = 0;
      }

      setPhase(currentPhase);
      setCount(currentCount);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, selectedExercise, phase, count]);

  const handleStart = (exercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setPhase('inhale');
    setCount(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(0);

    if (selectedExercise) {
      toast({
        title: 'Great job!',
        description: 'You completed a breathing exercise.'
      });

      storage.saveMeditationSession({
        id: Date.now().toString(),
        type: 'breathing',
        name: selectedExercise.name,
        date: new Date().toISOString()
      });
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-pink-400';
      case 'exhale': return 'from-green-400 to-teal-400';
      default: return 'from-teal-400 to-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {!isActive ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockBreathingExercises.map((exercise) => (
            <Card key={exercise.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mb-3">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{exercise.name}</CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-slate-600">
                    Duration: {Math.floor(exercise.duration / 60)} minutes
                  </div>
                  <Button
                    onClick={() => handleStart(exercise)}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-slate-800">{selectedExercise.name}</h2>

              <div className="relative">
                <div className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl animate-pulse`}>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2 capitalize">{phase}</div>
                    <div className="text-2xl text-white/90">
                      {selectedExercise.pattern[phase] - count}s
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStop}
                variant="outline"
                size="lg"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/* ---------------------------------------------------
   PUZZLE GAMES — MEMORY MATCH
--------------------------------------------------- */
const PuzzleGames = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => initializeGame(), []);

  const initializeGame = () => {
    const symbols = ['❤️', '⭐', '🌸', '🌈', '🦋', '🌺'];
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));

    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.symbol)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.symbol === secondCard.symbol) {
        setMatched(m => [...m, firstCard.symbol]);
        setFlipped([]);

        if (matched.length + 1 === 6) {
          toast({
            title: 'Congratulations!',
            description: `You completed the puzzle in ${moves + 1} moves!`
          });
        }
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Memory Match Game</CardTitle>
              <CardDescription>Find all the matching pairs</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-teal-600">{moves}</div>
              <div className="text-sm text-slate-600">Moves</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`aspect-square rounded-xl text-4xl flex items-center justify-center
                  ${flipped.includes(card.id) || matched.includes(card.symbol)
                    ? 'bg-gradient-to-br from-teal-400 to-blue-500 text-white shadow-xl'
                    : 'bg-slate-200 hover:bg-slate-300'}
                `}
              >
                {(flipped.includes(card.id) || matched.includes(card.symbol)) && card.symbol}
              </button>
            ))}
          </div>

          <Button
            onClick={initializeGame}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------------------------------------------------
   MEDITATION TIMER
--------------------------------------------------- */
const MeditationTimer = () => {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // ← NEW

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(interval);

            toast({
              title: "Session Complete!",
              description: "Great job on completing your meditation.",
            });

            storage.saveMeditationSession({
              id: Date.now().toString(),
              type: "meditation",
              duration,
              date: new Date().toISOString(),
            });

            setIsActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, duration]);

  const handleStart = () => {
    setHasStarted(true);      // ← stay in timer screen
    setIsActive(true);
    setTimeLeft(duration * 60);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    // DO NOT SET hasStarted = false
    // So UI stays in the timer screen
  };

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center space-y-8">

            <h2 className="text-3xl font-bold text-slate-800">Meditation Timer</h2>

            {/* If NOT started: show duration selection */}
            {!hasStarted ? (
              <div className="space-y-6">
                <Label className="text-lg font-semibold">Select Duration</Label>

                <div className="grid grid-cols-5 gap-3">
                  {[5, 10, 15, 20, 30].map(min => (
                    <button
                      key={min}
                      onClick={() => setDuration(min)}
                      className={`py-4 px-6 rounded-xl border-2 ${
                        duration === min
                          ? 'border-teal-500 bg-teal-50 shadow-lg'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="text-2xl font-bold">{min}</div>
                      <div className="text-xs">min</div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleStart}
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Meditation
                </Button>
              </div>
            ) : (
              <>
                {/* CIRCLE TIMER UI */}
                <div className="relative w-64 h-64 mx-auto">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle cx="128" cy="128" r="120" stroke="#e2e8f0" strokeWidth="12" fill="none" />

                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 120}
                      strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />

                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
                      <div className="text-sm text-slate-600 mt-2">Remaining</div>
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setIsActive(!isActive)}
                    variant="outline"
                    size="lg"
                    className="border-slate-300"
                  >
                    {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isActive ? 'Pause' : 'Resume'}
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
};


/* ---------------------------------------------------
   LABEL COMPONENT
--------------------------------------------------- */
const Label = ({ children, className = '' }) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
);

export default Games;
