import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  Coffee,
  Clock as ClockIcon,
  Maximize2,
  Minimize2,
  CloudRain,
  Waves,
  FlameKindling,
  Coffee as CafeIcon,
  Radio
} from 'lucide-react';
import { GlowCard } from './GlowCard';

interface PomodoroTimerProps {
  onCompleteSession: (minutes: number) => void;
}

// Flip Clock Themes
type ClockTheme = 'matte-black' | 'vintage-cream' | 'cyber-neon' | 'retro-gold';

interface ThemeConfig {
  name: string;
  cardBgTop: string;
  cardBgBottom: string;
  textColor: string;
  border: string;
  hingeColor: string;
  grooveColor: string;
}

const THEMES: Record<ClockTheme, ThemeConfig> = {
  'matte-black': {
    name: '經典啞光黑',
    cardBgTop: 'bg-[#18181c]',
    cardBgBottom: 'bg-[#121215]',
    textColor: 'text-slate-100',
    border: 'border-slate-800/80',
    hingeColor: 'bg-slate-700',
    grooveColor: 'bg-black/80'
  },
  'vintage-cream': {
    name: '復古象牙米',
    cardBgTop: 'bg-[#f5ebd6]',
    cardBgBottom: 'bg-[#ebdcb9]',
    textColor: 'text-[#2a241e]',
    border: 'border-[#d4c2a0]',
    hingeColor: 'bg-[#a3937a]',
    grooveColor: 'bg-[#3b3228]/20'
  },
  'cyber-neon': {
    name: '賽博霓虹',
    cardBgTop: 'bg-[#090d16]',
    cardBgBottom: 'bg-[#050810]',
    textColor: 'text-cyan-400',
    border: 'border-cyan-500/40',
    hingeColor: 'bg-cyan-500',
    grooveColor: 'bg-cyan-950'
  },
  'retro-gold': {
    name: '極致黑金',
    cardBgTop: 'bg-[#1a1815]',
    cardBgBottom: 'bg-[#12100e]',
    textColor: 'text-amber-400',
    border: 'border-amber-500/30',
    hingeColor: 'bg-amber-600',
    grooveColor: 'bg-black'
  }
};

// Mechanical Sound Synthesizer
class MechanicalSoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlipClack() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.8);
    } catch (e) {}
  }
}

// Background Ambient Noise Generator
class WhiteNoiseSynth {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;

  start(type: 'rain' | 'waves' | 'fire' | 'cafe') {
    this.stop();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();

      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, this.ctx.currentTime);
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
      } else if (type === 'fire') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, this.ctx.currentTime);
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.currentSource = whiteNoise;
    } catch (e) {}
  }

  stop() {
    if (this.currentSource) {
      try {
        (this.currentSource as any).stop();
      } catch (e) {}
      this.currentSource = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

const flipAudio = new MechanicalSoundSynth();
const ambientNoise = new WhiteNoiseSynth();

// Ultra-Realistic 3D Mechanical Flip Card Component
const Realistic3DFlipCard: React.FC<{
  value: string;
  label?: string;
  theme: ClockTheme;
  soundEnabled: boolean;
}> = ({ value, label, theme, soundEnabled }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  const themeConfig = THEMES[theme];

  useEffect(() => {
    if (value !== currentValue) {
      setPreviousValue(currentValue);
      setCurrentValue(value);
      setIsFlipping(true);

      if (soundEnabled) {
        flipAudio.playFlipClack();
      }

      const timer = setTimeout(() => {
        setIsFlipping(false);
        setPreviousValue(value);
      }, 480);

      return () => clearTimeout(timer);
    }
  }, [value, currentValue, soundEnabled]);

  return (
    <GlowCard className="rounded-2xl sm:rounded-3xl" enableTilt={true}>
      <div className="flex flex-col items-center select-none">
        <div className="relative perspective-flip w-16 sm:w-28 md:w-36 lg:w-40 h-24 sm:h-40 md:h-52 lg:h-56 rounded-2xl sm:rounded-3xl flip-shadow overflow-hidden">
          
          {/* Layer 1: TOP STATIC HALF */}
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 ${themeConfig.cardBgTop} border-t border-x ${themeConfig.border} rounded-t-2xl sm:rounded-t-3xl overflow-hidden flex items-end justify-center pb-1 sm:pb-2 flip-gloss`}
          >
            <span className={`text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-clock tracking-tighter ${themeConfig.textColor} translate-y-1/2 drop-shadow-md`}>
              {currentValue}
            </span>
          </div>

          {/* Layer 2: BOTTOM STATIC HALF */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1/2 ${themeConfig.cardBgBottom} border-b border-x ${themeConfig.border} rounded-b-2xl sm:rounded-b-3xl overflow-hidden flex items-start justify-center pt-1 sm:pt-2`}
          >
            <span className={`text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-clock tracking-tighter ${themeConfig.textColor} -translate-y-1/2 drop-shadow-md`}>
              {previousValue}
            </span>
          </div>

          {/* Layer 3: ANIMATED TOP FLAP */}
          {isFlipping && (
            <div
              className={`absolute top-0 left-0 right-0 h-1/2 ${themeConfig.cardBgTop} border-t border-x ${themeConfig.border} rounded-t-2xl sm:rounded-t-3xl overflow-hidden flex items-end justify-center pb-1 sm:pb-2 flip-gloss flip-top-down z-20`}
            >
              <span className={`text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-clock tracking-tighter ${themeConfig.textColor} translate-y-1/2 drop-shadow-md`}>
                {previousValue}
              </span>
            </div>
          )}

          {/* Layer 4: ANIMATED BOTTOM FLAP */}
          {isFlipping && (
            <div
              className={`absolute bottom-0 left-0 right-0 h-1/2 ${themeConfig.cardBgBottom} border-b border-x ${themeConfig.border} rounded-b-2xl sm:rounded-b-3xl overflow-hidden flex items-start justify-center pt-1 sm:pt-2 flip-bottom-down z-20`}
            >
              <span className={`text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-clock tracking-tighter ${themeConfig.textColor} -translate-y-1/2 drop-shadow-md`}>
                {currentValue}
              </span>
            </div>
          )}

          {/* Center Groove & Hinge Clips */}
          <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] ${themeConfig.grooveColor} z-30 shadow-inner`} />
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-4 sm:h-6 ${themeConfig.hingeColor} rounded-r-md z-40 shadow-md border-r border-slate-900/40`} />
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-4 sm:h-6 ${themeConfig.hingeColor} rounded-l-md z-40 shadow-md border-l border-slate-900/40`} />

        </div>

        {label && (
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-3 sm:mt-4">
            {label}
          </span>
        )}
      </div>
    </GlowCard>
  );
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onCompleteSession }) => {
  const [appMode, setActiveAppMode] = useState<'pomodoro' | 'clock'>('pomodoro');
  
  const [presetMode, setPresetMode] = useState<'25/5' | '50/10' | 'custom'>('25/5');
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessionsToday, setCompletedSessionsToday] = useState(3);
  const [totalFocusTimeToday, setTotalFocusTimeToday] = useState(75);
  const [taskNote, setTaskNote] = useState('高中模擬考高頻題庫衝刺');

  const [showSeconds, setShowSeconds] = useState(true);
  const [clockTheme, setClockTheme] = useState<ClockTheme>('matte-black');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [activeNoise, setActiveNoise] = useState<'none' | 'rain' | 'waves' | 'fire' | 'cafe'>('none');
  const [realtime, setRealtime] = useState(new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setRealtime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (appMode === 'pomodoro' && isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (appMode === 'pomodoro' && isRunning && secondsLeft === 0) {
      flipAudio.playChime();
      if (!isBreak) {
        setCompletedSessionsToday((prev) => prev + 1);
        setTotalFocusTimeToday((prev) => prev + workMinutes);
        onCompleteSession(workMinutes);
        setIsBreak(true);
        setSecondsLeft(breakMinutes * 60);
      } else {
        setIsBreak(false);
        setSecondsLeft(workMinutes * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, isBreak, workMinutes, breakMinutes, appMode, onCompleteSession]);

  const toggleNoise = (type: 'rain' | 'waves' | 'fire' | 'cafe') => {
    if (activeNoise === type) {
      setActiveNoise('none');
      ambientNoise.stop();
    } else {
      setActiveNoise(type);
      ambientNoise.start(type);
    }
  };

  const handlePresetChange = (preset: '25/5' | '50/10' | 'custom') => {
    setIsRunning(false);
    setPresetMode(preset);
    if (preset === '25/5') {
      setWorkMinutes(25);
      setBreakMinutes(5);
      setSecondsLeft(25 * 60);
    } else if (preset === '50/10') {
      setWorkMinutes(50);
      setBreakMinutes(10);
      setSecondsLeft(50 * 60);
    }
    setIsBreak(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft((isBreak ? breakMinutes : workMinutes) * 60);
  };

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const pomodoroMins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const pomodoroSecs = (secondsLeft % 60).toString().padStart(2, '0');

  const realtimeHours = realtime.getHours().toString().padStart(2, '0');
  const realtimeMins = realtime.getMinutes().toString().padStart(2, '0');
  const realtimeSecs = realtime.getSeconds().toString().padStart(2, '0');

  const displayHours = appMode === 'pomodoro' ? '00' : realtimeHours;
  const displayMins = appMode === 'pomodoro' ? pomodoroMins : realtimeMins;
  const displaySecs = appMode === 'pomodoro' ? pomodoroSecs : realtimeSecs;

  return (
    <div
      ref={containerRef}
      className={`space-y-6 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 sm:p-12 overflow-y-auto flex flex-col justify-between' : ''
      }`}
    >
      {/* Top Controls Bar with Physics Glow */}
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 transition-colors duration-300">
          
          <div className="flex items-center space-x-2 bg-[#f4f6fb] dark:bg-slate-950 p-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setIsRunning(false);
                setActiveAppMode('pomodoro');
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-black transition ${
                appMode === 'pomodoro'
                  ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>番茄鐘 Focus</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setActiveAppMode('clock');
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-black transition ${
                appMode === 'clock'
                  ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <span>翻頁時鐘 Flip Clock</span>
            </button>
          </div>

          {appMode === 'pomodoro' && (
            <div className="flex-1 max-w-md w-full flex items-center space-x-2 bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full">
              <span className="text-xs font-extrabold text-slate-500 whitespace-nowrap">🎯 專注目標:</span>
              <input
                type="text"
                value={taskNote}
                onChange={(e) => setTaskNote(e.target.value)}
                placeholder="輸入欲完成的讀書任務..."
                className="bg-transparent text-xs font-extrabold text-slate-950 dark:text-white focus:outline-none w-full"
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-[#f4f6fb] dark:bg-slate-950 p-1 rounded-full border border-slate-200 dark:border-slate-800">
              {(Object.keys(THEMES) as ClockTheme[]).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setClockTheme(thm)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold transition ${
                    clockTheme === thm
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {THEMES[thm].name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-full border transition ${
                soundEnabled
                  ? 'bg-slate-950 dark:bg-slate-800 text-white border-slate-950 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
              title="機械翻頁嗒嗒聲"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowSeconds(!showSeconds)}
              className={`px-3.5 py-2 rounded-full text-xs font-extrabold border transition ${
                showSeconds
                  ? 'bg-slate-950 dark:bg-slate-800 text-white border-slate-950 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              {showSeconds ? '顯示秒數' : '隱藏秒數'}
            </button>

            <button
              onClick={toggleFullscreenMode}
              className="p-2.5 rounded-full bg-slate-950 text-white dark:bg-slate-800 hover:bg-slate-800 transition"
              title="沉浸式全螢幕"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </GlowCard>

      {/* Main Flip Clock Hero Display with Glow Effect */}
      <GlowCard className="rounded-[2.5rem]" enableTilt={false}>
        <div className="bg-slate-950 dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 text-white rounded-[2.5rem] p-8 sm:p-14 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden transition-colors duration-300 min-h-[460px]">
          
          <div className="mb-8 flex items-center space-x-2">
            {appMode === 'pomodoro' ? (
              <span className={`text-xs font-black uppercase px-5 py-2 rounded-full tracking-wider flex items-center space-x-2 shadow-md ${
                isBreak 
                  ? 'bg-emerald-400 text-slate-950' 
                  : 'bg-amber-300 dark:bg-indigo-500 text-slate-950 dark:text-white'
              }`}>
                {isBreak ? (
                  <>
                    <Coffee className="w-4 h-4 inline" />
                    <span>REST MODE · 休息放鬆 {breakMinutes} 分鐘</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 inline fill-current" />
                    <span>DEEP FOCUS · 專注衝刺 {workMinutes} 分鐘</span>
                  </>
                )}
              </span>
            ) : (
              <span className="text-xs font-black uppercase px-5 py-2 rounded-full tracking-wider bg-indigo-500 text-white flex items-center space-x-2 shadow-md">
                <ClockIcon className="w-4 h-4" />
                <span>REAL-TIME FLIP FLOW CLOCK</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-8 my-4">
            {appMode === 'clock' && (
              <>
                <Realistic3DFlipCard value={displayHours} label="HOURS" theme={clockTheme} soundEnabled={soundEnabled} />
                <div className="flex flex-col justify-center space-y-3 px-1 sm:px-2 pb-6">
                  <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-slate-700 dark:bg-slate-700 animate-pulse" />
                  <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-slate-700 dark:bg-slate-700 animate-pulse" />
                </div>
              </>
            )}

            <Realistic3DFlipCard value={displayMins} label="MINUTES" theme={clockTheme} soundEnabled={soundEnabled} />

            {showSeconds && (
              <>
                <div className="flex flex-col justify-center space-y-3 px-1 sm:px-2 pb-6">
                  <div className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full ${isRunning || appMode === 'clock' ? 'bg-amber-400 dark:bg-indigo-400 animate-ping' : 'bg-slate-700'}`} />
                  <div className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full ${isRunning || appMode === 'clock' ? 'bg-amber-400 dark:bg-indigo-400 animate-ping' : 'bg-slate-700'}`} />
                </div>
                <Realistic3DFlipCard value={displaySecs} label="SECONDS" theme={clockTheme} soundEnabled={soundEnabled} />
              </>
            )}
          </div>

          {appMode === 'pomodoro' && (
            <div className="flex items-center space-x-4 mt-10">
              <button
                onClick={resetTimer}
                className="p-4 rounded-full bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition transform active:scale-95 shadow-md"
                title="重置時鐘"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTimer}
                className={`px-10 py-4 rounded-full font-black text-slate-950 text-base shadow-2xl transition-transform active:scale-95 flex items-center space-x-2 ${
                  isRunning ? 'bg-amber-300 dark:bg-amber-400 hover:bg-amber-400' : 'bg-white dark:bg-indigo-600 dark:text-white hover:bg-slate-100'
                }`}
              >
                {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                <span>{isRunning ? '暫停計時' : '開始專注'}</span>
              </button>

              <div className="hidden sm:flex items-center space-x-1 bg-slate-900 dark:bg-slate-950 p-1.5 rounded-full border border-slate-800">
                <button
                  onClick={() => handlePresetChange('25/5')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition ${
                    presetMode === '25/5' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  25/5
                </button>
                <button
                  onClick={() => handlePresetChange('50/10')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition ${
                    presetMode === '50/10' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  50/10
                </button>
              </div>
            </div>
          )}
        </div>
      </GlowCard>

      {/* Ambient White Noise Bar */}
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Radio className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <div>
                <h3 className="font-extrabold text-slate-950 dark:text-white text-sm">沉浸式白噪音音效 (Ambient White Noise)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">專為高中讀書設計的背景頻率，有效阻隔周遭噪音</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {[
                { id: 'rain', label: '下雨聲', icon: CloudRain },
                { id: 'waves', label: '海浪聲', icon: Waves },
                { id: 'fire', label: '篝柴火', icon: FlameKindling },
                { id: 'cafe', label: '咖啡廳', icon: CafeIcon }
              ].map((sound) => {
                const Icon = sound.icon;
                const isActive = activeNoise === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => toggleNoise(sound.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-extrabold transition transform active:scale-95 ${
                      isActive
                        ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-md'
                        : 'bg-[#f4f6fb] dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{sound.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Daily Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlowCard className="rounded-3xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <span className="text-xs font-black uppercase text-slate-400 block mb-1">COMPLETED SESSIONS</span>
            <div className="text-3xl font-black text-slate-950 dark:text-white">{completedSessionsToday} 次</div>
            <p className="text-xs text-slate-500 font-semibold mt-1">今天已完成 3 次極致專注區塊</p>
          </div>
        </GlowCard>

        <GlowCard className="rounded-3xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <span className="text-xs font-black uppercase text-slate-400 block mb-1">TOTAL FOCUS TIME</span>
            <div className="text-3xl font-black text-slate-950 dark:text-white">{totalFocusTimeToday} 分鐘</div>
            <p className="text-xs text-slate-500 font-semibold mt-1">累積沉浸時間超越 85% 同齡高中生</p>
          </div>
        </GlowCard>

        <GlowCard className="rounded-3xl sm:col-span-2 lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <span className="text-xs font-black uppercase text-slate-400 block mb-1">FLIPFLOW AI ADVICE</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold mt-1 leading-relaxed">
              💡 翻頁時鐘每次翻頁象徵時間流逝，建議專注 25 分鐘後適度放空休息！
            </p>
          </div>
        </GlowCard>
      </div>

    </div>
  );
};
