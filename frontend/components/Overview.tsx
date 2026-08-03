import React from 'react';
import {
  Compass,
  Calendar,
  Brain,
  Bot,
  Flame,
  BarChart3,
  FileText,
  Users,
  History,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { TimeBlock, UserProfile, ExamInfo, ScoreRecord } from '../types';
import { GlowCard } from './GlowCard';

interface OverviewProps {
  userProfile: UserProfile;
  exam: ExamInfo;
  schedule: TimeBlock[];
  setSchedule: React.Dispatch<React.SetStateAction<TimeBlock[]>>;
  scores: ScoreRecord[];
  onNavigateTab: (tab: 'planner' | 'weakness' | 'tutor' | 'pomodoro' | 'dashboard' | 'portfolio' | 'buddy' | 'history') => void;
  onOpenAccountModal: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  userProfile,
  exam,
  schedule,
  setSchedule,
  scores,
  onNavigateTab,
  onOpenAccountModal
}) => {
  const completedCount = schedule.filter((s) => s.completed).length;
  const progressPercent = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  const toggleTask = (id: string) => {
    setSchedule((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const latestScore = scores[scores.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome & Student Profile Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Banner */}
        <div className="lg:col-span-8">
          <GlowCard className="rounded-[2.5rem]">
            <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-sm transition-colors duration-300 min-h-[280px]">
              
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                    {userProfile.studentName.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest block">
                      {userProfile.gradeTrack}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                      早安，{userProfile.studentName}！
                    </h1>
                  </div>
                </div>

                <button
                  onClick={onOpenAccountModal}
                  className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#f4f6fb] dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  <Target className="w-3.5 h-3.5 text-indigo-500" />
                  <span>編輯志願與考科</span>
                </button>
              </div>

              <div className="my-6 z-10 space-y-2">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 font-extrabold text-sm">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>目標校系：<span className="text-slate-950 dark:text-white font-black text-base">{userProfile.targetUniversity}</span></span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  StudyPilot AI 領航系統正即時監控您的讀書完成率、考科弱點與考試倒數，引導您發揮 100% 複習潛能。
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between z-10 flex-wrap gap-2">
                <div className="flex items-center space-x-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-400/20 text-amber-900 dark:text-amber-300 font-black">
                    目標總分: {userProfile.targetScore} 級分
                  </span>
                  <span className="hidden sm:inline text-slate-400">|</span>
                  <span className="hidden sm:inline">每日排程目標: {userProfile.dailyHoursGoal} 小時</span>
                </div>

                <button
                  onClick={() => onNavigateTab('planner')}
                  className="px-5 py-2.5 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-black text-xs flex items-center space-x-1.5 shadow hover:opacity-90 transition transform active:scale-95"
                >
                  <span>開始今天計畫</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Light gradient backdrop decor */}
              <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-gradient-to-tr from-amber-200/30 dark:from-indigo-600/20 via-rose-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            </div>
          </GlowCard>
        </div>

        {/* Exam Countdown Card */}
        <div className="lg:col-span-4">
          <GlowCard className="rounded-[2.5rem]">
            <div className="bg-slate-950 dark:bg-slate-900 text-white border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-colors duration-300 h-full min-h-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 dark:text-amber-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Exam Countdown</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-extrabold text-slate-300">
                  {exam.date}
                </span>
              </div>

              <div className="my-4 text-center">
                <span className="text-xs font-extrabold text-slate-400 block mb-1 truncate px-2">
                  {exam.name}
                </span>
                <div className="text-6xl sm:text-7xl font-black tracking-tighter text-white font-mono my-1">
                  {exam.daysLeft}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-rose-400 block">
                  DAYS REMAINING
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-semibold text-slate-400">
                <div className="flex justify-between">
                  <span>準備考科數:</span>
                  <span className="text-white font-black">{userProfile.selectedSubjects.length} 科</span>
                </div>
                <div className="flex justify-between">
                  <span>衝刺模式狀態:</span>
                  <span className="text-emerald-400 font-black">高效規劃中</span>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

      </div>

      {/* Middle Grid: Today's Schedule + Key Progress + Score Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Schedule Quick View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GlowCard className="rounded-[2.5rem]">
            <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6 transition-colors duration-300">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-black text-slate-950 dark:text-white text-lg tracking-tight">
                    今日讀書進度一覽 ({completedCount} / {schedule.length})
                  </h3>
                </div>

                <button
                  onClick={() => onNavigateTab('planner')}
                  className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
                  <span>管理完整的讀書計畫</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Task Rows */}
              <div className="space-y-3">
                {schedule.length === 0 ? (
                  <div className="text-center py-10 bg-[#f4f6fb] dark:bg-slate-950 rounded-2xl text-slate-400 font-extrabold text-xs">
                    今天尚未排定學習排程，前往【智慧讀書計畫】一鍵生成！
                  </div>
                ) : (
                  schedule.slice(0, 4).map((block) => (
                    <div
                      key={block.id}
                      onClick={() => toggleTask(block.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                        block.completed
                          ? 'bg-slate-100/80 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                          : 'bg-[#f4f6fb] dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-950 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button className="text-slate-400 hover:text-slate-950 dark:hover:text-white transition">
                          {block.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-slate-950 dark:text-emerald-400 fill-slate-950/10 dark:fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-950 dark:bg-indigo-600 text-white font-mono">
                              {block.timeRange}
                            </span>
                            <span className="font-black text-xs text-slate-950 dark:text-white">{block.subject}</span>
                          </div>
                          <p className={`text-xs font-bold mt-1 ${block.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {block.topic}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        block.priority === 'High'
                          ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}>
                        {block.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          </GlowCard>
        </div>

        {/* Right Column: Recent Scores Snapshot (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <GlowCard className="rounded-[2.5rem]">
            <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4 transition-colors duration-300 h-full flex flex-col justify-between">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-slate-950 dark:text-white text-base tracking-tight">最新測驗成績</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline">
                  圖表 Dashboard
                </button>
              </div>

              {latestScore ? (
                <div className="bg-[#f4f6fb] dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-black text-slate-500">
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">{latestScore.date}</span>
                    <span className="text-slate-950 dark:text-white font-extrabold">{latestScore.examName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {Object.entries(latestScore.scores).slice(0, 4).map(([sub, sc]) => (
                      <div key={sub} className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 font-bold block truncate">{sub}</span>
                        <span className="text-sm font-black text-slate-950 dark:text-white">{sc} 分</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">尚未輸入測驗紀錄</div>
              )}

              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-400/10 p-3 rounded-xl border border-amber-200 dark:border-amber-400/20">
                📈 <span className="font-black text-slate-950 dark:text-white">趨勢分析：</span> 數學與英文呈現穩定上揚趨勢，保持高強度錯題復盤！
              </p>

            </div>
          </GlowCard>
        </div>

      </div>

      {/* Quick Access Feature Hub Bento Grid */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2 block">
          CORE FEATURE HUBS · 核心智慧學習功能捷徑
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Weakness AI */}
          <GlowCard className="rounded-3xl">
            <div
              onClick={() => onNavigateTab('weakness')}
              className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-950 dark:hover:border-slate-700 transition cursor-pointer space-y-3 group h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 rounded-2xl group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  診斷
                </span>
              </div>
              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  AI 弱點分析
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  精準拆解模擬考錯題盲點，拒絕無用刷題
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Card 2: AI Tutor */}
          <GlowCard className="rounded-3xl">
            <div
              onClick={() => onNavigateTab('tutor')}
              className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-950 dark:hover:border-slate-700 transition cursor-pointer space-y-3 group h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 rounded-2xl group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  問答
                </span>
              </div>
              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  AI 問答助教
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  觀念拆解 + 經典範例 + 隨堂演練測驗
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Card 3: Flip Clock Pomodoro */}
          <GlowCard className="rounded-3xl">
            <div
              onClick={() => onNavigateTab('pomodoro')}
              className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-950 dark:hover:border-slate-700 transition cursor-pointer space-y-3 group h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 rounded-2xl group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  沉浸
                </span>
              </div>
              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  翻頁時鐘番茄鐘
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  3D 機械質感翻頁 + 沉浸式白噪音環境音
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Card 4: Historical Archive */}
          <GlowCard className="rounded-3xl">
            <div
              onClick={() => onNavigateTab('history')}
              className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-950 dark:hover:border-slate-700 transition cursor-pointer space-y-3 group h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-2xl group-hover:scale-110 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  復盤
                </span>
              </div>
              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  往日讀書回顧
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  查看過往每日專注時數、任務清單與 AI 復盤評價
                </p>
              </div>
            </div>
          </GlowCard>

        </div>
      </div>

    </div>
  );
};
