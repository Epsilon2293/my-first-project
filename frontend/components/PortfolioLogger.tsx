import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { DailyLog } from '../types';
import { INITIAL_LOGS } from '../constants';
import { generatePortfolioPDFContent } from '../services/geminiService';

export const PortfolioLogger: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>(INITIAL_LOGS);
  const [topics, setTopics] = useState('');
  const [exercisesCount, setExercisesCount] = useState(20);
  const [reflection, setReflection] = useState('');
  const [blockers, setBlockers] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [pdfMarkdown, setPdfMarkdown] = useState<string | null>(null);

  const handleAddLog = () => {
    if (!reflection.trim()) return;
    const newEntry: DailyLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      topicsCovered: topics.split(',').map((t) => t.trim()),
      exercisesCompleted: Number(exercisesCount) || 0,
      reflection,
      blockers,
      focusMinutes: 120,
      mood: '😊'
    };
    setLogs([newEntry, ...logs]);
    setTopics('');
    setReflection('');
    setBlockers('');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const content = await generatePortfolioPDFContent(logs);
    setPdfMarkdown(content);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block mb-1">
            Learning Portfolio
          </span>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">高中學習歷程檔案自動生成</h2>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            日常累積學習反思，一鍵統整為符合教育部格式之歷程心得
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="px-6 py-3 bg-slate-950 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full flex items-center space-x-2 transition disabled:opacity-50"
        >
          {isExporting ? (
            <span>生成檔案中...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>匯出學習歷程 (PDF/MD)</span>
            </>
          )}
        </button>
      </div>

      {pdfMarkdown && (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-indigo-500 rounded-[2rem] p-8 shadow-md relative space-y-4">
          <button
            onClick={() => setPdfMarkdown(null)}
            className="absolute top-6 right-6 text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-950 dark:text-white px-3 py-1.5 rounded-full"
          >
            關閉預覽
          </button>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
            ✨ AI 歷程檔案完成
          </span>
          <div className="bg-[#f4f6fb] dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-950 dark:text-slate-200 whitespace-pre-line font-mono max-h-96 overflow-y-auto leading-relaxed">
            {pdfMarkdown}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-4 transition-colors duration-300">
        <h3 className="font-extrabold text-slate-950 dark:text-white text-sm flex items-center space-x-2">
          <Plus className="w-4 h-4 text-slate-950 dark:text-indigo-400" />
          <span>紀錄今天讀書反思</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="讀了哪些單元？(如: 數學機率)"
            className="bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
          />
          <input
            type="number"
            value={exercisesCount}
            onChange={(e) => setExercisesCount(Number(e.target.value))}
            placeholder="完成題數"
            className="bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
          />
        </div>

        <textarea
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="學習心得與收穫..."
          className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
        />

        <input
          type="text"
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          placeholder="遇到的卡關與困難..."
          className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
        />

        <button
          onClick={handleAddLog}
          className="px-6 py-2.5 bg-slate-950 dark:bg-indigo-600 text-white font-extrabold text-xs rounded-full shadow"
        >
          儲存今日日誌
        </button>
      </div>

      {/* History */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-950 dark:text-white text-sm px-2">歷史學習紀錄</h3>
        {logs.map((log) => (
          <div key={log.id} className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="font-mono text-slate-950 dark:text-white">{log.date}</span>
              <span>完成 {log.exercisesCompleted} 題練習</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.reflection}</p>
            {log.blockers && (
              <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-400/10 p-2.5 rounded-xl border border-amber-200 dark:border-amber-400/20">
                ⚠️ 遇到的卡關：{log.blockers}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
