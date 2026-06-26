import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { storage } from '../utils/storage';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

// -------------------- MOOD EMOJI MAP --------------------
const MOOD_EMOJI = {
  happy: "😊", sad: "💙", angry: "🔥", stressed: "😌",
  anxious: "💭", lonely: "🤗", tired: "😴", energetic: "⚡", general: "💬"
};

// -------------------- MOOD FOLLOW-UP RESPONSES --------------------
const MOOD_FOLLOW_UP = {
  happy:    () => `😊 That's wonderful! What made you feel happy today?`,
  sad:      () => `💙 I'm sorry you're feeling sad. Would you like to tell me what happened?`,
  angry:    () => `🔥 I understand you're upset. What situation made you feel this way?`,
  stressed: () => `😌 Stress can be overwhelming. What's causing the most pressure right now?`,
  anxious:  () => `💭 Anxiety can be difficult. Would you like to talk about what's worrying you?`,
  lonely:   () => `🤗 I'm here with you. What has been making you feel lonely lately?`,
  tired:    () => `😴 You seem tired. Have you been getting enough rest lately?`,
  energetic:() => `⚡ That's great! What made you feel energetic today?`,
  general:  () => `💬 I'm here to support you. How are you feeling today?`,
};

// -------------------- GAME RECOMMENDATION --------------------
function getRecommendedGame(mood) {
  switch (mood) {
    case "happy":
    case "energetic":
      return "🧩 Puzzle Game";
    case "sad":
    case "angry":
    case "stressed":
    case "anxious":
      return "🌬️ Breathing Exercise";
    case "lonely":
    case "tired":
    default:
      return "🧘 Meditation Timer";
  }
}

// -------------------- GAME BENEFITS --------------------
function getGameBenefits(game) {
  switch (game) {
    case "🧩 Puzzle Game":
      return `🧩 Puzzle Game Benefits:\n\n• Improves memory\n• Boosts concentration\n• Improves problem-solving\n• Keeps your mind active`;
    case "🌬️ Breathing Exercise":
      return `🌬️ Breathing Exercise Benefits:\n\n• Reduces stress\n• Lowers anxiety\n• Improves focus\n• Calms the nervous system`;
    case "🧘 Meditation Timer":
    default:
      return `🧘 Meditation Benefits:\n\n• Improves mindfulness\n• Helps relaxation\n• Reduces overthinking\n• Better sleep quality`;
  }
}

// -------------------- GAME INSTRUCTIONS --------------------
function getGameInstructions(game) {
  switch (game) {
    case "🧩 Puzzle Game":
      return `🧩 How to Play:\n\n1. Flip two cards\n2. Match identical cards\n3. Complete all matches\n4. Use minimum moves`;
    case "🌬️ Breathing Exercise":
      return `🌬️ How to Do It:\n\n1. Inhale slowly\n2. Hold for 4 seconds\n3. Exhale slowly\n4. Repeat 5 times`;
    case "🧘 Meditation Timer":
    default:
      return `🧘 How to Use:\n\n1. Select duration\n2. Start timer\n3. Focus on breathing\n4. Relax`;
  }
}

// -------------------- MOTIVATIONAL TIPS --------------------
function getMotivationalTip(mood) {
  switch (mood) {
    case "sad":       return "💙 Every difficult moment passes. Be kind to yourself.";
    case "happy":     return "😊 Share your positivity with someone today.";
    case "energetic": return "⚡ Channel that energy into something you love!";
    case "angry":     return "🔥 Take a breath. Your calm is your superpower.";
    case "stressed":  return "😌 One step at a time. You've got this.";
    case "lonely":    return "🤗 You are never truly alone. Reach out to someone today.";
    case "tired":     return "😴 Rest is productive. Recharge and come back stronger.";
    case "anxious":   return "😌 Breathe. You have handled hard things before.";
    default:          return "🌟 Every day is a new opportunity to grow and thrive.";
  }
}

// -------------------- RELAXATION TIPS --------------------
function getRelaxationTip(mood) {
  switch (mood) {
    case "anxious":
      return `🧘 Relaxation Tip:\n\nTry the 5-4-3-2-1 grounding technique:\n\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste`;
    case "sad":
      return `🧘 Relaxation Tip:\n\nTry listening to calming music and journaling your thoughts.`;
    case "happy":
      return `🧘 Relaxation Tip:\n\nEnjoy this feeling — take a peaceful walk outside.`;
    case "energetic":
      return `🧘 Relaxation Tip:\n\nTry stretching or yoga to channel your energy mindfully.`;
    case "angry":
      return `🧘 Relaxation Tip:\n\nTake a short walk and focus on slow, deep breathing.`;
    case "stressed":
      return `🧘 Relaxation Tip:\n\nStep away from screens for 10 minutes and breathe deeply.`;
    case "lonely":
      return `🧘 Relaxation Tip:\n\nMake a warm drink and put on your favorite show or music.`;
    case "tired":
      return `🧘 Relaxation Tip:\n\nClose your eyes for 5 minutes and do slow, deep breathing.`;
    default:
      return `🧘 Relaxation Tip:\n\nTake a few deep breaths and stay present in the moment.`;
  }
}

// -------------------- MOOD DETECTION --------------------
function detectMood(text) {
  const lower = text.toLowerCase();

  // SAD
  if (lower.includes("sad") || lower.includes("upset") || lower.includes("unhappy") ||
      lower.includes("depressed") || lower.includes("heartbroken") || lower.includes("cry") ||
      lower.includes("grief") || lower.includes("miserable") || lower.includes("down"))
    return "sad";

  // HAPPY
  if (lower.includes("happy") || lower.includes("excited") || lower.includes("great") ||
      lower.includes("joyful") || lower.includes("cheerful") || lower.includes("wonderful") ||
      lower.includes("amazing") || lower.includes("fantastic") || lower.includes("glad") ||
      lower.includes("ecstatic") || lower.includes("pleased") || lower.includes("delighted"))
    return "happy";

  // STRESSED
  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("pressure") ||
      lower.includes("burden") || lower.includes("tense") || lower.includes("hectic") ||
      lower.includes("burned out") || lower.includes("too much") || lower.includes("can't cope"))
    return "stressed";

  // ANXIOUS
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("nervous") ||
      lower.includes("worry") || lower.includes("panic") || lower.includes("fear") ||
      lower.includes("scared") || lower.includes("uneasy") || lower.includes("dread"))
    return "anxious";

  // ANGRY
  if (lower.includes("angry") || lower.includes("furious") || lower.includes("mad") ||
      lower.includes("irritated") || lower.includes("frustrated") || lower.includes("rage") ||
      lower.includes("annoyed") || lower.includes("fed up") || lower.includes("livid"))
    return "angry";

  // LONELY
  if (lower.includes("lonely") || lower.includes("alone") || lower.includes("isolated") ||
      lower.includes("left out") || lower.includes("no one") || lower.includes("nobody") ||
      lower.includes("excluded") || lower.includes("disconnected") || lower.includes("friendless"))
    return "lonely";

  // TIRED
  if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("sleepy") ||
      lower.includes("fatigue") || lower.includes("drained") || lower.includes("worn out") ||
      lower.includes("no energy") || lower.includes("lethargic") || lower.includes("drowsy"))
    return "tired";

  // ENERGETIC
  if (lower.includes("energetic") || lower.includes("pumped") || lower.includes("energy") ||
      lower.includes("motivated") || lower.includes("active") || lower.includes("lively") ||
      lower.includes("enthusiastic") || lower.includes("productive") || lower.includes("fired up"))
    return "energetic";

  return "general";
}

// -------------------- ACTION DETECTION --------------------
function detectAction(text) {
  const lower = text.toLowerCase().trim();

  if (lower.includes("recommend") || lower.includes("suggest") || lower === "game" ||
      lower.includes("what game") || lower.includes("which game") || lower.includes("any game"))
    return "show_game";

  if (lower === "benefits" || lower.includes("benefit") || lower.includes("why should i"))
    return "show_benefits";

  if (lower === "how to play" || lower === "how" || lower === "instructions" ||
      lower.includes("how to play") || lower.includes("how to use") || lower.includes("how do i") ||
      lower.includes("instruction") || lower.includes("steps"))
    return "show_instructions";

  if (lower === "motivation" || lower === "motivate me" || lower.includes("motivat") ||
      lower.includes("inspire") || lower.includes("encourage"))
    return "show_motivation";

  if (lower === "relaxation tip" || lower === "relax" || lower === "calm me" ||
      lower.includes("relax") || lower.includes("calm") || lower.includes("tip") ||
      lower.includes("grounding"))
    return "show_relaxation";

  return null;
}

// -------------------- SYSTEM PROMPT --------------------
function buildSystemPrompt(mood, game) {
  const emoji = MOOD_EMOJI[mood] || "💬";
  return `You are a compassionate mental wellness AI companion. Reply like a warm, caring friend — short and natural.

SESSION:
- User mood: ${mood}
- Recommended activity: ${game}

ALWAYS reply with ONLY valid JSON — no markdown, no backticks, no extra text:
{"mood":"<mood>","response":"<reply>","action":"<action>"}

MOOD VALUES: happy, sad, angry, stressed, anxious, lonely, tired, energetic, general

ACTION VALUES:
- "show_game" → user asks for a game/activity recommendation
- "show_benefits" → user asks about benefits
- "show_instructions" → user asks how to play/use it
- "show_motivation" → user asks for motivation
- "show_relaxation" → user asks for relaxation tip or "yes" after AI offered calming help
- "none" → all other conversation

RESPONSE STYLE:
- 1-2 sentences max for conversational replies
- Use mood emoji ${emoji} for ${mood} responses
- Ask a follow-up question when appropriate
- For greetings: "Hello! How are you feeling today?"
- Never push games/activities unless user asks

MOOD RESPONSE PATTERNS:
- happy → "${MOOD_EMOJI.happy} That's wonderful! What made you feel happy today?"
- sad → "${MOOD_EMOJI.sad} I'm sorry you're feeling sad. Would you like to tell me what happened?"
- angry → "${MOOD_EMOJI.angry} I understand you're upset. What situation made you feel this way?"
- stressed → "${MOOD_EMOJI.stressed} Stress can be overwhelming. What's causing the most pressure right now?"
- anxious → "${MOOD_EMOJI.anxious} Anxiety can be difficult. Would you like to talk about what's worrying you?"
- lonely → "${MOOD_EMOJI.lonely} I'm here with you. What has been making you feel lonely lately?"
- tired → "${MOOD_EMOJI.tired} You seem tired. Have you been getting enough rest lately?"
- energetic → "${MOOD_EMOJI.energetic} That's great! What made you feel energetic today?"`;
}

// -------------------- CHAT COMPONENT --------------------
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState("general");
  const [currentGame, setCurrentGame] = useState(null);

  const moodData = JSON.parse(localStorage.getItem("moodAnalysis") || "null");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    if (moodData?.mood) setCurrentMood(moodData.mood);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = storage.getChatMessages();
    if (savedMessages.length === 0) {
      const welcomeMessage = {
        id: '1',
        role: 'assistant',
        content: moodData
          ? `Hello! I see your current mood is ${moodData.mood}.\n\nRecommended activity: ${moodData.recommendedGame}\n\n${moodData.reason}\n\nHow are you feeling right now?`
          : "Hello! How are you feeling today?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      storage.saveChatMessage(welcomeMessage);
    } else {
      setMessages(savedMessages);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper: send an instant message without API call
  const sendInstantReply = (content) => {
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiMessage]);
    storage.saveChatMessage(aiMessage);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    storage.saveChatMessage(userMessage);
    setInput("");
    setIsLoading(true);

    // 1. Detect mood and action
    const detectedMood = detectMood(userInput);
    const activeMood = detectedMood !== "general" ? detectedMood : currentMood;
    if (detectedMood !== "general") setCurrentMood(detectedMood);

    const clientAction = detectAction(userInput);
    const game = currentGame || getRecommendedGame(activeMood);

    // 2. Handle greetings instantly
    const lower = userInput.toLowerCase().trim();
    if (lower === "hi" || lower === "hello" || lower === "hey" || lower === "hii" || lower === "helo") {
      sendInstantReply("Hello! How are you feeling today?");
      return;
    }

    // 3. Handle structural actions instantly (no API needed)
    if (clientAction === "show_game") {
      const recommendedGame = getRecommendedGame(activeMood);
      setCurrentGame(recommendedGame);
      sendInstantReply(`🎮 Recommended Game:\n\n${recommendedGame}\n\nWould you like to know its benefits or how to play it?`);
      return;
    }

    if (clientAction === "show_benefits") {
      sendInstantReply(getGameBenefits(game));
      return;
    }

    if (clientAction === "show_instructions") {
      sendInstantReply(getGameInstructions(game));
      return;
    }

    if (clientAction === "show_motivation") {
      sendInstantReply(getMotivationalTip(activeMood));
      return;
    }

    if (clientAction === "show_relaxation") {
      sendInstantReply(getRelaxationTip(activeMood));
      return;
    }

    // 4. Handle mood-only messages instantly (e.g. "I am sad", "I feel energetic")
    if (detectedMood !== "general") {
      sendInstantReply(MOOD_FOLLOW_UP[detectedMood]());
      return;
    }

    // 5. API call for open-ended conversation
    try {
      const conversationHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));
      conversationHistory.push({ role: "user", content: userInput });

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          system: buildSystemPrompt(activeMood, game)
        })
      });

      const data = await response.json();
      const rawText = data.content?.map(i => i.text || "").join("") || "";

      let parsed;
      try {
        const clean = rawText.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = { mood: activeMood, response: rawText, action: "none" };
      }

      if (parsed.mood && parsed.mood !== currentMood) setCurrentMood(parsed.mood);
      const resolvedMood = parsed.mood || activeMood;
      const resolvedGame = currentGame || getRecommendedGame(resolvedMood);

      let finalResponse = parsed.response;

      switch (parsed.action) {
        case "show_game":
          setCurrentGame(resolvedGame);
          finalResponse = `🎮 Recommended Game:\n\n${resolvedGame}\n\nWould you like to know its benefits or how to play it?`;
          break;
        case "show_benefits":
          finalResponse = getGameBenefits(currentGame || resolvedGame);
          break;
        case "show_instructions":
          finalResponse = getGameInstructions(currentGame || resolvedGame);
          break;
        case "show_motivation":
          finalResponse = getMotivationalTip(resolvedMood);
          break;
        case "show_relaxation":
          finalResponse = getRelaxationTip(resolvedMood);
          break;
        default:
          break;
      }

      sendInstantReply(finalResponse);

    } catch (error) {
      console.error("API error:", error);
      // Fallback to mood-based response
      const fallback = detectedMood !== "general"
        ? MOOD_FOLLOW_UP[detectedMood]()
        : MOOD_FOLLOW_UP[currentMood]?.() || "💬 I'm here to support you. How are you feeling?";
      sendInstantReply(fallback);
    }
  };

  const handleClearChat = () => {
    storage.clearChatMessages();
    setCurrentMood(moodData?.mood || "general");
    setCurrentGame(null);
    loadMessages();
    toast({ title: 'Chat cleared', description: 'Your conversation has been reset.' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-800">AI Support Chat</h1>
            <p className="text-lg text-slate-600">Your compassionate wellness companion</p>
          </div>
          <Button variant="outline" onClick={handleClearChat} className="border-slate-300 hover:bg-slate-50">
            Clear Chat
          </Button>
        </div>

        {/* Mood Analysis Card */}
        {moodData && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold">Current Mood Analysis</h2>
              <p>Mood: {moodData.mood}</p>
              <p>Intensity: {moodData.intensity}/10</p>
              <p className="mt-2">Recommended Game: {moodData.recommendedGame}</p>
              <p className="text-sm mt-2">{moodData.reason}</p>
            </CardContent>
          </Card>
        )}

        {/* Chat Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-0">

            {/* Messages */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                      : 'bg-gradient-to-br from-teal-400 to-green-500'
                  }`}>
                    {message.role === 'user'
                      ? <User className="w-5 h-5 text-white" />
                      : <Bot className="w-5 h-5 text-white" />
                    }
                  </div>

                  <div className={`flex-1 max-w-[75%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 px-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-teal-400 to-green-500">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-2xl rounded-tl-none shadow-md bg-white border border-slate-200">
                      <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4 bg-slate-50/50">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white transition-all duration-200 focus:ring-2 focus:ring-teal-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="self-end bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
