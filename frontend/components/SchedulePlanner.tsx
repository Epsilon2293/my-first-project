import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle, RefreshCw, Plus, X, BookPlus } from 'lucide-react';
import { TimeBlock } from '../types';
import { generateSmartSchedule } from '../services/geminiService';
import { GlowCard } from './GlowCard';

interface SchedulePlannerProps {
  schedule: TimeBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<TimeBlock[]>>;
  daysLeft: number;
  subjects: string[];
  dailyHoursGoal?: number;
  onOpenSubjectManager: () => void;
}

export const SchedulePlanner: React.FC<SchedulePlannerProps> = ({
  schedule,
  setSchedule,
  daysLeft,
  subjects,
  dailyHoursGoal = 3.5,
  onOpenSubjectManager
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyHours, setDailyHours] = useState(dailyHoursGoal);
  const [weakFocusText, setWeakFocusText] = useState('機率排列組合、英文倒裝句型');

  useEffect(() => {
    setDailyHours(dailyHoursGoal);
  }, [dailyHoursGoal]);

  // Custom Schedule Task Modal State
  const [isCustomTaskModalOpen, setIsCustomTaskModalOpen] = useState(false);
  const [customTimeRange, setCustomTimeRange] = useState('16:00 ~ 17:00');
  const [customSubject, setCustomSubject] = useState<string>(subjects[0] || '數學A/B');
  const [customTopic, setCustomTopic] = useState('');
  const [customPriority, setCustomPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [customNotes, setCustomNotes] = useState('');

  const toggleTaskCompletion = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleGenerateAiPlan = async () => {
    setIsGenerating(true);
    const newPlan = await generateSmartSchedule({
      examName: '114 學測',
      daysLeft,
      dailyHours,
      subjectLevels: subjects.slice(0, 3).map((sub) => ({ subject: sub, level: 3 })),
      weakTopics: weakFocusText
    });

    if (newPlan && newPlan.length > 0) {
      setSchedule(newPlan);
    }
    setIsGenerating(false);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    const newBlock: TimeBlock = {
      id: `custom-${Date.now()}`,
      timeRange: customTimeRange,
      subject: customSubject,
      topic: customTopic,
      priority: customPriority,
      completed: false,
      notes: customNotes.trim() ? customNotes : undefined
    };

    setSchedule((prev) => [...prev, newBlock]);
    setCustomTopic('');
    setCustomNotes('');
    setIsCustomTaskModalOpen(false);
  };

  const completedCount = schedule.filter((s) => s.completed).length;
  const progressPercent = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Bento Top Grid Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Hero Card */}
        <div className="lg:col-span-8">
          <GlowCard className="rounded-[2.5rem]">
            <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-sm transition-colors duration-300">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 dark:bg-white inline-block"></span>
                <span>AI Dynamic Planner</span>
              </div>

              <div className="space-y-4 max-w-2xl z-10">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1]">
                  Optimize your daily study schedule.
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                  AI 根據倒數日程、成績動態與弱點單元，為你精準分配高效讀書時間區塊，也可隨時自訂個人專屬進度與科目。
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 z-10">
                <div className="flex items-center space-x-3 bg-[#f4f6fb] dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">每日研讀:</span>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value) || 3)}
                    className="w-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white font-black text-sm text-center py-1"
                  />
                  <span className="text-xs font-bold text-slate-950 dark:text-slate-200">小時</span>
                </div>

                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <button
                    onClick={() => setIsCustomTaskModalOpen(true)}
                    className="px-5 py-3.5 rounded-full bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>自訂進度</span>
                  </button>

                  <button
                    onClick={handleGenerateAiPlan}
                    disabled={isGenerating}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 dark:from-indigo-600 dark:via-purple-600 dark:to-rose-600 text-slate-950 dark:text-white hover:opacity-95 font-extrabold text-sm shadow-sm flex items-center justify-center space-x-2 transition transform active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI 運算最適計畫中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-slate-950 dark:fill-white" />
                        <span>一鍵生成今日智慧進度</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="absolute top-4 right-4 w-40 h-40 bg-gradient-to-bl from-amber-200/40 dark:from-indigo-500/20 via-rose-200/30 dark:via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            </div>
          </GlowCard>
        </div>

        {/* Side Stat Bento Card */}
        <div className="lg:col-span-4">
          <GlowCard className="rounded-[2.5rem]">
            <div className="bg-slate-950 dark:bg-slate-900 text-white border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-colors duration-300 h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Progress</span>
                <span className="px-3 py-1 rounded-full bg-white/10 dark:bg-slate-800 text-xs font-bold text-slate-200">
                  {completedCount} / {schedule.length} 區塊
                </span>
              </div>

              <div className="my-6">
                <div className="text-6xl font-black tracking-tighter text-white">
                  {progressPercent}%
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-2">
                  今日目標達成度！保持狀態完成極致複習。
                </p>
              </div>

              <div className="w-full bg-slate-800 dark:bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 dark:from-indigo-400 dark:to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </GlowCard>
        </div>

      </div>

      {/* Weakness Prompt Input Pill */}
      <GlowCard className="rounded-2xl">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3 transition-colors duration-300">
          <span className="text-xs font-extrabold text-slate-950 dark:text-amber-300 uppercase tracking-wide whitespace-nowrap bg-amber-100 dark:bg-amber-400/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-400/30">
            🎯 特別加強重點:
          </span>
          <input
            type="text"
            value={weakFocusText}
            onChange={(e) => setWeakFocusText(e.target.value)}
            placeholder="輸入想要重點排入的單元或考科..."
            className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
          />
        </div>
      </GlowCard>

      {/* Schedule Items Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">
          <span>TIME & SUBJECT</span>
          <span className="hidden sm:inline">TASK OBJECTIVES</span>
          <span>PRIORITY</span>
        </div>

        {schedule.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2rem] text-slate-400 font-bold">
            尚未建立計畫，點擊上方自訂進度或讓 AI 智慧安排！
          </div>
        ) : (
          schedule.map((block) => (
            <GlowCard key={block.id} className="rounded-2xl">
              <div
                onClick={() => toggleTaskCompletion(block.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  block.completed
                    ? 'bg-slate-100/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-900/10 dark:border-slate-800 hover:border-slate-950 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <button className="mt-0.5 sm:mt-0 text-slate-400 dark:text-slate-500 hover:text-slate-950 dark:hover:text-slate-200 transition">
                    {block.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-slate-950 dark:text-emerald-400 fill-slate-950/10 dark:fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-mono">
                        {block.timeRange}
                      </span>
                      <span className="font-extrabold text-base text-slate-950 dark:text-white">{block.subject}</span>
                    </div>
                    <p className={`text-sm font-semibold mt-1.5 ${block.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {block.topic}
                    </p>
                    {block.notes && (
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 inline" />
                        <span>{block.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span
                    className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                      block.priority === 'High'
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                        : block.priority === 'Medium'
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {block.priority === 'High' ? '★★★★ High Priority' : block.priority === 'Medium' ? '★★★ Standard' : '★★ Regular'}
                  </span>
                </div>
              </div>
            </GlowCard>
          ))
        )}
      </div>

      {/* 自訂進度 Modal */}
      {isCustomTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-slate-700 rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setIsCustomTaskModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1.5 rounded-full bg-[#f4f6fb] dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest block mb-1">
                Custom Study Task
              </span>
              <h3 className="font-black text-slate-950 dark:text-white text-2xl tracking-tight">
                手動新增自訂讀書進度
              </h3>
            </div>

            <form onSubmit={handleAddCustomTask} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold">時間時段 (Time Range)</label>
                  <input
                    type="text"
                    value={customTimeRange}
                    onChange={(e) => setCustomTimeRange(e.target.value)}
                    placeholder="例如: 18:00 ~ 19:30"
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-500 dark:text-slate-400 font-extrabold">選擇科目 (Subject)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTaskModalOpen(false);
                        onOpenSubjectManager();
                      }}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center space-x-1"
                    >
                      <BookPlus className="w-3 h-3" />
                      <span>新增/管理科目</span>
                    </button>
                  </div>
                  <select
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  >
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-extrabold">研讀目標與單元 (Topic Goal)</label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="例如: 寫英文歷屆試題 1 回並檢討錯題"
                  required
                  className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold">優先等級 (Priority)</label>
                  <select
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value as any)}
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  >
                    <option value="High">High (高優先)</option>
                    <option value="Medium">Medium (標準)</option>
                    <option value="Low">Low (基礎/彈性)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold">個人備註/提醒 (Notes)</label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="例如: 重點看錯題筆記本"
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCustomTaskModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-slate-600 dark:text-slate-400 font-black hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-black shadow-lg"
                >
                  確認新增排程
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
