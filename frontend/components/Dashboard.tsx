import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, Clock, Smile, Activity, Plus, X, Trash2, Award } from 'lucide-react';
import { ScoreRecord } from '../types';
import { GlowCard } from './GlowCard';

interface DashboardProps {
  scores: ScoreRecord[];
  setScores: React.Dispatch<React.SetStateAction<ScoreRecord[]>>;
  subjects: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ scores, setScores, subjects }) => {
  // Modal for Custom Test Scores Input
  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);
  const [examName, setExamName] = useState('第一次全區模考');
  const [examDate, setExamDate] = useState('12/15');
  
  // Dynamic scores map state
  const [customScoresMap, setCustomScoresMap] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    subjects.forEach((s) => {
      init[s] = 85;
    });
    return init;
  });

  const handleScoreChange = (subject: string, value: number) => {
    setCustomScoresMap((prev) => ({
      ...prev,
      [subject]: value
    }));
  };

  const handleAddCustomScore = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ScoreRecord = {
      id: `score-${Date.now()}`,
      date: examDate,
      examName,
      scores: { ...customScoresMap }
    };

    setScores((prev) => [...prev, newRecord]);
    setIsAddScoreModalOpen(false);
  };

  const handleDeleteScore = (id: string) => {
    setScores((prev) => prev.filter((item) => item.id !== id));
  };

  // Generate dynamic chart data based on subjects
  const chartData = scores.map((item) => {
    const dataObj: Record<string, any> = { name: item.examName };
    subjects.forEach((sub) => {
      dataObj[sub] = item.scores[sub] || 0;
    });
    return dataObj;
  });

  const studyHoursData = [
    { day: '週一', focusHours: 3.5, goal: 3.0 },
    { day: '週二', focusHours: 4.0, goal: 3.5 },
    { day: '週三', focusHours: 2.5, goal: 3.0 },
    { day: '週四', focusHours: 4.5, goal: 4.0 },
    { day: '週五', focusHours: 3.0, goal: 3.0 },
    { day: '週六', focusHours: 6.0, goal: 5.5 },
    { day: '週日', focusHours: 5.5, goal: 5.0 }
  ];

  const LINE_COLORS = ['#818cf8', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top AI Insight Bento Card */}
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-slate-950 dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 text-white rounded-[2.5rem] p-8 shadow-sm space-y-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-amber-300 dark:text-amber-400 tracking-widest">
              <Activity className="w-4 h-4" />
              <span>AI Performance Overview</span>
            </div>

            <button
              onClick={() => setIsAddScoreModalOpen(true)}
              className="px-5 py-2.5 bg-amber-300 dark:bg-indigo-600 hover:opacity-90 text-slate-950 dark:text-white rounded-full text-xs font-black flex items-center space-x-1.5 transition transform active:scale-95 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>自訂測驗成績</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 dark:bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block">黃金讀書時段</span>
              <p className="text-xl font-black text-amber-300 dark:text-amber-400 mt-1">晚上 20:00 ~ 21:30</p>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">解題正確率 88%</span>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block">易拖延科目</span>
              <p className="text-xl font-black text-rose-300 dark:text-rose-400 mt-1">英文作文與背單字</p>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">建議排在精神最佳時</span>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block">情緒與壓力指標</span>
              <div className="flex items-center space-x-2 mt-1">
                <Smile className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-black text-white">狀態穩定充沛</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">連 3 天精力飽滿</span>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <GlowCard className="rounded-[2.5rem]">
          <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4 transition-colors duration-300 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-slate-950 dark:text-white" />
                <h3 className="font-extrabold text-slate-950 dark:text-white text-base">各科成績進步趨勢圖</h3>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                共 {scores.length} 次考試紀錄
              </span>
            </div>

            <div className="h-64 pt-2">
              {scores.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 font-bold text-xs">
                  <Award className="w-8 h-8 opacity-40 mb-2" />
                  <span>尚無測驗分數紀錄，請點擊右上角【自訂測驗成績】</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', color: '#fff', border: '1px solid #334155' }} />
                    <Legend />
                    {subjects.map((sub, idx) => (
                      <Line
                        key={sub}
                        type="monotone"
                        dataKey={sub}
                        stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </GlowCard>

        {/* Bar Chart */}
        <GlowCard className="rounded-[2.5rem]">
          <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4 transition-colors duration-300 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-slate-950 dark:text-white" />
                <h3 className="font-extrabold text-slate-950 dark:text-white text-base">每週專注時數</h3>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300">
                達標率 105%
              </span>
            </div>

            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', color: '#fff', border: '1px solid #334155' }} />
                  <Legend />
                  <Bar dataKey="focusHours" name="實際專注" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="goal" name="目標時數" fill="#334155" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlowCard>

      </div>

      {/* 測驗紀錄清單 */}
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-950 dark:text-white text-base">測驗歷史明細與分數表</h3>
          
          {scores.length === 0 ? (
            <div className="text-center py-10 bg-[#f4f6fb] dark:bg-slate-950 rounded-2xl text-slate-400 font-bold text-xs">
              目前尚無測驗紀錄，請點擊上方【自訂測驗成績】新增您的第一筆考試分數！
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {scores.map((rec) => (
                <div key={rec.id} className="bg-[#f4f6fb] dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 relative group">
                  <button
                    onClick={() => handleDeleteScore(rec.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition"
                    title="刪除測驗"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 font-mono block">{rec.date}</span>
                  <h4 className="font-black text-slate-950 dark:text-white text-sm">{rec.examName}</h4>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-extrabold">
                    {Object.entries(rec.scores).map(([sub, score]) => (
                      <div key={sub} className="bg-white dark:bg-slate-900 p-1.5 rounded-lg text-center border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px] truncate">{sub}</span>
                        <span className="text-slate-950 dark:text-white font-black">{score} 分</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlowCard>

      {/* 自訂成績 Modal */}
      {isAddScoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-slate-700 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative space-y-6 max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setIsAddScoreModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1.5 rounded-full bg-[#f4f6fb] dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest block mb-1">
                Custom Exam Entry
              </span>
              <h3 className="font-black text-slate-950 dark:text-white text-2xl tracking-tight">
                新增自訂測驗成績
              </h3>
            </div>

            <form onSubmit={handleAddCustomScore} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold">測驗名稱</label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="如: 第一次全區模考"
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold">測驗日期</label>
                  <input
                    type="text"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    placeholder="如: 12/15"
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-slate-500 dark:text-slate-400 font-extrabold block">輸入各科得分</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {subjects.map((sub) => (
                    <div key={sub} className="space-y-1">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold block truncate">{sub}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={customScoresMap[sub] ?? 80}
                        onChange={(e) => handleScoreChange(sub, Number(e.target.value))}
                        className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddScoreModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-slate-600 dark:text-slate-400 font-black hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-black shadow-lg"
                >
                  確認儲存成績
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
