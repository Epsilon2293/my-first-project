import React, { useState } from 'react';
import { History, Calendar as CalendarIcon, Clock, Sparkles, CheckCircle2, RefreshCw, Flame, Award, BookOpen } from 'lucide-react';
import { HistoryDayRecord } from '../types';
import { MOCK_HISTORY_RECORDS } from '../constants';
import { generateHistoricalReview } from '../services/geminiService';
import { GlowCard } from './GlowCard';

interface HistoryReviewProps {
  historyRecords?: HistoryDayRecord[];
}

export const HistoryReview: React.FC<HistoryReviewProps> = ({
  historyRecords = MOCK_HISTORY_RECORDS
}) => {
  const [records, setRecords] = useState<HistoryDayRecord[]>(historyRecords);
  const [selectedDate, setSelectedSubjectDate] = useState<string>(records[0]?.date || '2024-11-28');
  const [isGeneratingAiReview, setIsGeneratingAiReview] = useState(false);

  const activeRecord = records.find((r) => r.date === selectedDate) || records[0];

  const handleRunAiReview = async () => {
    if (!activeRecord) return;
    setIsGeneratingAiReview(true);
    const reviewText = await generateHistoricalReview(
      activeRecord.date,
      activeRecord.tasksCompleted,
      activeRecord.focusMinutes,
      activeRecord.log?.reflection,
      activeRecord.mood
    );

    setRecords((prev) =>
      prev.map((r) => (r.date === activeRecord.date ? { ...r, aiReview: reviewText } : r))
    );
    setIsGeneratingAiReview(false);
  };

  const completedCount = activeRecord.tasksCompleted.filter((t) => t.completed).length;
  const taskCompletionRate = activeRecord.tasksCompleted.length > 0
    ? Math.round((completedCount / activeRecord.tasksCompleted.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6 transition-colors duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest block mb-1">
                HISTORICAL ARCHIVE & RECOVERY
              </span>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                往日讀書回顧與 AI 復盤診斷
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                溫故而知新。隨時檢視過往任何日期的專注時間、完成任務、心情指數與當日測驗表現。
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-[#f4f6fb] dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>累積 {records.length} 天紀錄檔案</span>
            </div>
          </div>

          {/* Timeline Date Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800">
            {records.map((rec) => {
              const isSelected = rec.date === selectedDate;
              return (
                <button
                  key={rec.date}
                  onClick={() => setSelectedSubjectDate(rec.date)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-black transition transform active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-md'
                      : 'bg-[#f4f6fb] dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-mono">{rec.date}</span>
                  <span>{rec.mood}</span>
                </button>
              );
            })}
          </div>

        </div>
      </GlowCard>

      {/* Selected Historical Day Bento Grid */}
      {activeRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Key Stats & AI Review */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Day Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlowCard className="rounded-3xl">
                <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">當日專注時數</span>
                  <div className="text-3xl font-black text-slate-950 dark:text-white flex items-center justify-center space-x-1">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>{activeRecord.focusMinutes} 分</span>
                  </div>
                </div>
              </GlowCard>

              <GlowCard className="rounded-3xl">
                <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">計畫完成率</span>
                  <div className="text-3xl font-black text-slate-950 dark:text-white">
                    {taskCompletionRate}%
                  </div>
                </div>
              </GlowCard>

              <GlowCard className="rounded-3xl">
                <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">學習狀態心情</span>
                  <div className="text-3xl font-black">{activeRecord.mood}</div>
                </div>
              </GlowCard>
            </div>

            {/* AI Review Card */}
            <GlowCard className="rounded-[2.5rem]">
              <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">AI 學習復盤診斷報告</h3>
                  </div>

                  <button
                    onClick={handleRunAiReview}
                    disabled={isGeneratingAiReview}
                    className="px-4 py-2 bg-slate-950 dark:bg-indigo-600 hover:opacity-90 text-white rounded-full text-xs font-black flex items-center space-x-1.5 transition transform active:scale-95 disabled:opacity-50"
                  >
                    {isGeneratingAiReview ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>生成中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>重新 AI 復盤</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#f4f6fb] dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeRecord.aiReview || '點擊右上角按鈕讓 AI 為此日學習進行診斷復盤！'}
                </div>
              </div>
            </GlowCard>

            {/* Day Reflection Log if available */}
            {activeRecord.log && (
              <GlowCard className="rounded-[2.5rem]">
                <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-3">
                  <span className="text-xs font-black uppercase text-slate-400 block">當日閱讀心得與反思 (DAILY REFLECTION)</span>
                  <p className="text-xs font-extrabold text-slate-950 dark:text-white leading-relaxed">
                    "{activeRecord.log.reflection}"
                  </p>
                  {activeRecord.log.blockers && (
                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-400/10 p-3 rounded-xl border border-amber-200 dark:border-amber-400/20">
                      ⚠️ 當日卡關紀錄: {activeRecord.log.blockers}
                    </p>
                  )}
                </div>
              </GlowCard>
            )}

          </div>

          {/* Right Column: Tasks Completed on that Day & Exam Scores */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Completed Tasks List */}
            <GlowCard className="rounded-[2.5rem]">
              <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4">
                <span className="text-xs font-black uppercase text-slate-400 block">當日排程完成清單 ({activeRecord.tasksCompleted.length})</span>
                
                <div className="space-y-3">
                  {activeRecord.tasksCompleted.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#f4f6fb] dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-mono">
                          {task.timeRange}
                        </span>
                        <span className="text-xs font-extrabold text-slate-950 dark:text-white">{task.subject}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 pt-1">
                        {task.topic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>

            {/* Exam Scores logged on that date */}
            {activeRecord.scoreRecord && (
              <GlowCard className="rounded-[2.5rem]">
                <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h4 className="font-extrabold text-slate-950 dark:text-white text-sm">
                      當日考試分數: {activeRecord.scoreRecord.examName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(activeRecord.scoreRecord.scores).map(([sub, sc]) => (
                      <div key={sub} className="bg-[#f4f6fb] dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">{sub}</span>
                        <span className="text-sm font-black text-slate-950 dark:text-white">{sc} 分</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
