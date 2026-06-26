import React, { useState, useEffect, useRef } from 'react';

// ── Confetti ─────────────────────────────────────────────────────────────────
const Confetti = ({ active }) => {
  if (!active) return null;
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.8}s`,
    color: ['#f472b6', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa'][i % 5],
    size: `${6 + Math.random() * 8}px`,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute', top: '-10px', left: p.left,
            width: p.size, height: p.size, backgroundColor: p.color,
            borderRadius: '50%',
            animationName: 'confettiFall',
            animationDuration: `${1.2 + Math.random() * 1}s`,
            animationDelay: p.delay,
            animationTimingFunction: 'ease-in',
            animationFillMode: 'forwards',
          }}
        />
      ))}
      <style>{`@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
};

// ── Breathing ring animation ──────────────────────────────────────────────────
const BreathingRing = ({ phase }) => {
  const scales = { inhale: 1.4, hold: 1.4, exhale: 0.8, rest: 0.8 };
  const colors = { inhale: '#818cf8', hold: '#6366f1', exhale: '#34d399', rest: '#10b981' };
  const scale = scales[phase] || 1;
  const color = colors[phase] || '#818cf8';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}33, ${color}11)`,
        border: `3px solid ${color}`,
        transform: `scale(${scale})`,
        transition: 'transform 4s ease-in-out, border-color 4s ease, background 4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color, textTransform: 'capitalize', letterSpacing: 1 }}>{phase}</span>
      </div>
    </div>
  );
};

// ── Circular Timer ────────────────────────────────────────────────────────────
const CircularTimer = ({ seconds, total, color = '#6366f1' }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const pct = seconds / total;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
      <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color}>{mm}:{ss}</text>
    </svg>
  );
};

// ── Progress Tracker ──────────────────────────────────────────────────────────
const ProgressTracker = ({ completions }) => {
  const activities = [
    { key: 'morning', label: 'Morning Gratitude', color: '#f97316', emoji: '🌅' },
    { key: 'bodyscan', label: 'Body Scan', color: '#8b5cf6', emoji: '🧘' },
    { key: 'walking', label: 'Mindful Walk', color: '#10b981', emoji: '🚶' },
    { key: 'evening', label: 'Evening Reflection', color: '#6366f1', emoji: '🌙' },
  ];
  const total = activities.reduce((s, a) => s + (completions[a.key] || 0), 0);
  const weekGoal = 28;
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1e293b' }}>🏆 Weekly Progress</h3>
        <span style={{ fontSize: 13, color: '#64748b' }}>{total}/{weekGoal} sessions</span>
      </div>
      <div style={{ background: '#f1f5f9', borderRadius: 8, height: 10, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 8, width: `${Math.min(100, (total / weekGoal) * 100)}%`, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {activities.map((a) => (
          <div key={a.key} style={{ textAlign: 'center', padding: '10px 6px', background: '#f8fafc', borderRadius: 10, border: `1px solid #e2e8f0` }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{a.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: a.color }}>{completions[a.key] || 0}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Weekly Stats ──────────────────────────────────────────────────────────────
const WeeklyStats = ({ weekData }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVal = Math.max(...weekData, 1);
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#1e293b' }}>📊 This Week's Activity</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
        {days.map((d, i) => (
          <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%', borderRadius: 4,
              background: weekData[i] > 0 ? 'linear-gradient(180deg, #818cf8, #6366f1)' : '#f1f5f9',
              height: `${(weekData[i] / maxVal) * 60 + 4}px`,
              transition: 'height 0.4s ease',
            }} />
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── AI Reflection ─────────────────────────────────────────────────────────────
const AIReflection = ({ prompt, buttonLabel = '✨ Get AI Reflection' }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const get = async () => {
    if (!prompt) return;
    setLoading(true); setShown(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6', max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      setText(data.content?.[0]?.text || '');
    } catch { setText('Could not load reflection. Please try again.'); }
    finally { setLoading(false); }
  };
  return (
    <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>🤖</span>
        <strong style={{ fontSize: 14, color: '#6b21a8' }}>AI Reflection</strong>
      </div>
      {shown && (
        <p style={{ fontSize: 14, color: '#374151', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 12px' }}>
          {loading ? 'Thinking…' : text || 'Save your entries first.'}
        </p>
      )}
      <button onClick={get} disabled={loading || !prompt} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: prompt ? 'pointer' : 'not-allowed', opacity: prompt ? 1 : 0.5 }}>
        {loading ? 'Thinking…' : buttonLabel}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Morning Gratitude
// ─────────────────────────────────────────────────────────────────────────────
const MorningGratitude = ({ onComplete }) => {
  const [items, setItems] = useState({ i1: '', i2: '', i3: '' });
  const [streak] = useState(Number(localStorage.getItem('gratitudeStreak')) || 0);
  const [saved, setSaved] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [history] = useState(() => { try { return JSON.parse(localStorage.getItem('gratitudeHistory') || '[]'); } catch { return []; } });

  const save = () => {
    if (!items.i1 && !items.i2 && !items.i3) return;
    const newStreak = streak + 1;
    const entry = { date: new Date().toLocaleDateString(), ...items };
    const newHist = [...history, entry];
    localStorage.setItem('gratitudeHistory', JSON.stringify(newHist));
    localStorage.setItem('gratitudeStreak', newStreak);
    setSaved(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
    onComplete('morning');
  };

  const aiPrompt = saved
    ? `I am grateful for: "${items.i1}", "${items.i2}", "${items.i3}". Give me a warm, insightful 2-sentence reflection that deepens my appreciation and ends with an uplifting thought. Be concise and heartfelt.`
    : null;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <Confetti active={confetti} />
      <div style={{ background: 'linear-gradient(135deg, #fde68a, #fb923c, #c084fc)', borderRadius: 20, padding: 24, marginBottom: 20, color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌅</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Morning Gratitude</h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>Start your day with appreciation</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 16px' }}>
          <span>🔥</span>
          <span style={{ fontWeight: 700 }}>{streak + (saved ? 1 : 0)} day streak</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {[{ k: 'i1', ph: "🙏 I'm grateful for…" }, { k: 'i2', ph: "😊 Another thing I appreciate…" }, { k: 'i3', ph: "🌟 One more gift in my life…" }].map(({ k, ph }) => (
          <input key={k} type="text" placeholder={ph} value={items[k]}
            onChange={(e) => setItems({ ...items, [k]: e.target.value })}
            style={{ padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 15, outline: 'none', background: '#fafafa' }}
          />
        ))}
      </div>

      {!saved && (
        <button onClick={save} disabled={!items.i1 && !items.i2 && !items.i3}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f97316, #c084fc)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
          💾 Save Gratitude
        </button>
      )}
      {saved && (
        <>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, marginBottom: 16, textAlign: 'center', color: '#15803d', fontSize: 14, fontWeight: 600 }}>
            ✅ Gratitude saved! Your streak is now {streak + 1} days.
          </div>
          <AIReflection prompt={aiPrompt} />
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Body Scan Meditation
// ─────────────────────────────────────────────────────────────────────────────
const BodyScanMeditation = ({ onComplete }) => {
  const TOTAL = 600;
  const [seconds, setSeconds] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('rest');
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const phaseRef = useRef(0);

  const BREATH_CYCLE = [
    { name: 'inhale', dur: 4 }, { name: 'hold', dur: 4 },
    { name: 'exhale', dur: 6 }, { name: 'rest', dur: 2 },
  ];

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); setDone(true); onComplete('bodyscan'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let elapsed = 0;
    const cycle = () => {
      const step = BREATH_CYCLE[phaseRef.current % BREATH_CYCLE.length];
      setPhase(step.name);
      const t = setTimeout(() => {
        phaseRef.current++;
        cycle();
      }, step.dur * 1000);
      return t;
    };
    const t = cycle();
    return () => clearTimeout(t);
  }, [running]);

  const bodySections = ['Head & Face', 'Neck & Shoulders', 'Chest & Arms', 'Abdomen', 'Hips & Back', 'Legs & Feet'];
  const elapsed = TOTAL - seconds;
  const sectionIdx = Math.min(Math.floor((elapsed / TOTAL) * bodySections.length), bodySections.length - 1);

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🧘</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#3730a3' }}>Body Scan Meditation</h2>
        <p style={{ margin: 0, color: '#6d28d9', fontSize: 14 }}>10-minute guided body awareness</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <CircularTimer seconds={seconds} total={TOTAL} color="#7c3aed" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <BreathingRing phase={phase} />
      </div>

      {running && (
        <div style={{ background: '#f5f3ff', borderRadius: 12, padding: '14px 20px', marginBottom: 16, textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Focus now on</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#4c1d95' }}>{bodySections[sectionIdx]}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
        <button onClick={() => setRunning(!running)}
          style={{ padding: '12px 28px', background: running ? '#e0e7ff' : 'linear-gradient(135deg, #7c3aed, #6366f1)', color: running ? '#4338ca' : 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          {running ? '⏸ Pause' : seconds === TOTAL ? '▶️ Begin' : '▶️ Resume'}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(TOTAL); setPhase('rest'); setDone(false); }}
          style={{ padding: '12px 20px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 15 }}>
          Reset
        </button>
      </div>

      {done && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, textAlign: 'center', color: '#15803d', marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>🎉 Session complete! Beautifully done.</p>
          <p style={{ margin: 0, fontSize: 13 }}>Take a moment before moving on.</p>
        </div>
      )}

      <div style={{ background: '#faf5ff', borderRadius: 12, padding: 16 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#6b21a8', fontWeight: 700 }}>🎵 Ambient Sound</h4>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#7c3aed' }}>For best experience, play a nature sounds playlist while doing this session.</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['🌊 Ocean Waves', '🌧 Rain', '🌿 Forest', '🔔 Singing Bowls'].map((s) => (
            <span key={s} style={{ padding: '6px 14px', background: '#ede9fe', color: '#6d28d9', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Mindful Walking
// ─────────────────────────────────────────────────────────────────────────────
const MindfulWalking = ({ onComplete }) => {
  const TOTAL = 900;
  const [seconds, setSeconds] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const prompts = [
    { icon: '👁', text: 'Notice 5 things you can see right now', sense: 'sight' },
    { icon: '👂', text: 'Listen for 4 distinct sounds around you', sense: 'hearing' },
    { icon: '🤲', text: 'Feel 3 textures — air, ground, your clothes', sense: 'touch' },
    { icon: '👃', text: 'Identify 2 different scents in the air', sense: 'smell' },
    { icon: '💨', text: 'Notice your breath — slow it down deliberately', sense: 'breath' },
    { icon: '🦶', text: 'Feel each footstep — heel, arch, toe', sense: 'movement' },
    { icon: '🌿', text: 'Observe something in nature without labelling it', sense: 'awareness' },
    { icon: '☀️', text: 'Notice the light — where is it coming from?', sense: 'light' },
  ];

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); setDone(true); onComplete('walking'); return 0; }
        setPromptIdx(Math.floor(((TOTAL - s + 1) / TOTAL) * prompts.length));
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const aiPrompt = reflectionSaved && reflection
    ? `I just finished a mindful walk and wrote: "${reflection}". Give me a brief, warm 2-sentence reflection that validates this experience and suggests one thing to carry into the rest of my day.`
    : null;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #d1fae5, #6ee7b7)', borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🚶</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#065f46' }}>Mindful Walking</h2>
        <p style={{ margin: 0, color: '#059669', fontSize: 14 }}>15-minute sensory awareness walk</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <CircularTimer seconds={seconds} total={TOTAL} color="#059669" />
      </div>

      <div style={{ background: 'white', border: '2px solid #6ee7b7', borderRadius: 16, padding: '20px', textAlign: 'center', marginBottom: 16, minHeight: 90 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{prompts[promptIdx]?.icon}</div>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#065f46', lineHeight: 1.5 }}>{prompts[promptIdx]?.text}</p>
        <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{prompts[promptIdx]?.sense}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {prompts.map((p, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: i < promptIdx ? '#10b981' : i === promptIdx && running ? '#6ee7b7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {i < promptIdx ? '✓' : p.icon}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={() => setRunning(!running)}
          style={{ padding: '12px 28px', background: running ? '#d1fae5' : 'linear-gradient(135deg, #059669, #10b981)', color: running ? '#065f46' : 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          {running ? '⏸ Pause Walk' : seconds === TOTAL ? '▶️ Start Walk' : '▶️ Resume'}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(TOTAL); setPromptIdx(0); setDone(false); }}
          style={{ padding: '12px 20px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 15 }}>Reset</button>
      </div>

      <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#065f46' }}>📝 Post-Walk Reflection</h4>
        <textarea
          placeholder="What did you notice on your walk? Any moments of unexpected beauty or stillness?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #bbf7d0', borderRadius: 10, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
        />
        <button onClick={() => { if (reflection) { setReflectionSaved(true); onComplete('walking'); } }}
          style={{ marginTop: 10, padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          💾 Save Reflection
        </button>
      </div>

      {reflectionSaved && <AIReflection prompt={aiPrompt} buttonLabel="✨ Reflect on my walk" />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Evening Reflection
// ─────────────────────────────────────────────────────────────────────────────
const EveningReflection = ({ onComplete }) => {
  const MOODS = [
    { emoji: '😄', label: 'Joyful', color: '#fbbf24' },
    { emoji: '😊', label: 'Content', color: '#34d399' },
    { emoji: '😐', label: 'Neutral', color: '#94a3b8' },
    { emoji: '😔', label: 'Low', color: '#818cf8' },
    { emoji: '😤', label: 'Stressed', color: '#f87171' },
    { emoji: '😴', label: 'Tired', color: '#a78bfa' },
  ];
  const [mood, setMood] = useState(null);
  const [journal, setJournal] = useState('');
  const [goal, setGoal] = useState('');
  const [saved, setSaved] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const save = () => {
    if (!journal && !goal) return;
    const entry = { date: new Date().toLocaleDateString(), mood, journal, goal };
    const prev = JSON.parse(localStorage.getItem('eveningReflections') || '[]');
    localStorage.setItem('eveningReflections', JSON.stringify([...prev, entry]));
    setSaved(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
    onComplete('evening');
  };

  const aiPrompt = saved && journal
    ? `Today I felt ${mood?.label || 'various emotions'}. My journal entry: "${journal}". My goal for tomorrow: "${goal}". Give me a compassionate 2-sentence evening reflection that honours my day and gently encourages my tomorrow goal.`
    : null;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <Confetti active={confetti} />
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95, #6d28d9)', borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌙</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Evening Reflection</h2>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>Close your day with intention and peace</p>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>😊 How do you feel tonight?</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {MOODS.map((m) => (
            <button key={m.label} onClick={() => setMood(m)}
              style={{
                padding: '10px 14px', borderRadius: 12, border: `2px solid ${mood?.label === m.label ? m.color : '#e2e8f0'}`,
                background: mood?.label === m.label ? `${m.color}22` : 'white',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 70,
              }}>
              <span style={{ fontSize: 24 }}>{m.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: mood?.label === m.label ? m.color : '#94a3b8' }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>📖 What's on your mind?</h4>
        <textarea
          placeholder="Write freely about your day — what happened, what you felt, what you're proud of, or what you'd do differently…"
          value={journal} onChange={(e) => setJournal(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>🎯 One intention for tomorrow</h4>
        <input type="text" placeholder="Tomorrow I will…"
          value={goal} onChange={(e) => setGoal(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
        />
      </div>

      {!saved ? (
        <button onClick={save} disabled={!journal && !goal}
          style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #4c1d95, #6366f1)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
          💾 Save Evening Reflection
        </button>
      ) : (
        <>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, marginBottom: 16, textAlign: 'center', color: '#15803d', fontSize: 14, fontWeight: 600 }}>
            ✅ Reflection saved. Rest well tonight. 🌙
          </div>
          <AIReflection prompt={aiPrompt} buttonLabel="✨ Evening AI Reflection" />
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: Mindfulness Hub
// ─────────────────────────────────────────────────────────────────────────────
const Mindfulness = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [completions, setCompletions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mindfulnessCompletions') || '{}'); } catch { return {}; }
  });
  const [weekData] = useState(() => {
    const data = JSON.parse(localStorage.getItem('weekActivity') || '[0,0,0,0,0,0,0]');
    const today = new Date().getDay();
    const updated = [...data];
    updated[(today + 6) % 7] = updated[(today + 6) % 7] || 0;
    return updated;
  });
  const [toastMsg, setToastMsg] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const sections = [
    { key: 'morning', emoji: '🌅', label: 'Morning Gratitude', desc: 'Set a grateful tone for your day', color: 'linear-gradient(135deg, #fde68a, #fb923c)', textColor: '#92400e' },
    { key: 'bodyscan', emoji: '🧘', label: 'Body Scan Meditation', desc: '10-minute guided body awareness', color: 'linear-gradient(135deg, #ede9fe, #c4b5fd)', textColor: '#5b21b6' },
    { key: 'walking', emoji: '🚶', label: 'Mindful Walking', desc: '15-minute sensory awareness walk', color: 'linear-gradient(135deg, #d1fae5, #6ee7b7)', textColor: '#065f46' },
    { key: 'evening', emoji: '🌙', label: 'Evening Reflection', desc: 'Close your day with intention', color: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', textColor: '#3730a3' },
  ];

  const handleComplete = (key) => {
    const newCompletions = { ...completions, [key]: (completions[key] || 0) + 1 };
    setCompletions(newCompletions);
    localStorage.setItem('mindfulnessCompletions', JSON.stringify(newCompletions));
    const today = new Date().getDay();
    const weekKey = 'weekActivity';
    const wData = JSON.parse(localStorage.getItem(weekKey) || '[0,0,0,0,0,0,0]');
    wData[(today + 6) % 7] = (wData[(today + 6) % 7] || 0) + 1;
    localStorage.setItem(weekKey, JSON.stringify(wData));
    setToastMsg(`🎉 ${sections.find((s) => s.key === key)?.label} complete!`);
    setConfetti(true);
    setTimeout(() => { setToastMsg(null); setConfetti(false); }, 3000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'morning': return <MorningGratitude onComplete={handleComplete} />;
      case 'bodyscan': return <BodyScanMeditation onComplete={handleComplete} />;
      case 'walking': return <MindfulWalking onComplete={handleComplete} />;
      case 'evening': return <EveningReflection onComplete={handleComplete} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fdf4ff 100%)', padding: '32px 24px' }}>
      <Confetti active={confetti} />

      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 15, fontWeight: 600, color: '#1e293b', animation: 'slideIn 0.3s ease' }}>
          {toastMsg}
          <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        </div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>🧘 Mindfulness Corner</h1>
          <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>Four practices for a balanced, present day</p>
        </div>

        {!activeSection ? (
          <>
            <ProgressTracker completions={completions} />
            <WeeklyStats weekData={weekData} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
              {sections.map((s) => (
                <button key={s.key} onClick={() => setActiveSection(s.key)}
                  style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: 24, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14 }}>
                    {s.emoji}
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{s.label}</h3>
                  <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</p>
                  {completions[s.key] > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0fdf4', borderRadius: 20, padding: '4px 12px' }}>
                      <span style={{ fontSize: 12 }}>✅</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>{completions[s.key]}x completed</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: 20, padding: 28, color: 'white', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Why mindfulness works</h3>
              <p style={{ margin: '0 0 20px', opacity: 0.7, fontSize: 14 }}>Just 10 minutes a day creates measurable change in 8 weeks.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[{ e: '🧠', t: 'Better Focus', d: 'Reduced mind-wandering' }, { e: '💙', t: 'Less Stress', d: 'Lower cortisol levels' }, { e: '😴', t: 'Deeper Sleep', d: 'Improved sleep quality' }].map((b) => (
                  <div key={b.t} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{b.e}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{b.t}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{b.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <button onClick={() => setActiveSection(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 14, color: '#64748b', marginBottom: 24, fontWeight: 600 }}>
              ← Back to all practices
            </button>
            {renderSection()}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button onClick={() => { setActiveSection(null); }}
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                ✅ Complete & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mindfulness;
