import React, { useState } from 'react';
import { Brain, Search, RefreshCw, Plus } from 'lucide-react';
import { SubjectWeakness } from '../types';
import { MOCK_WEAKNESSES } from '../constants';
import { analyzeSubjectWeakness } from '../services/geminiService';
import { GlowCard } from './GlowCard';

interface WeaknessAnalysisProps {
  subjects: string[];
  onOpenSubjectManager: () => void;
}

export const WeaknessAnalysis: React.FC<WeaknessAnalysisProps> = ({
  subjects,
  onOpenSubjectManager
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || '數學A/B');
  const [weaknessList, setWeaknessList] = useState<SubjectWeakness[]>(MOCK_WEAKNESSES);
  const [testInput, setTestInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentWeakness = weaknessList.find((w) => w.subject === selectedSubject) || {
    subject: selectedSubject,
    overallScore: 75,
    subtopics: [
      { name: '核心概念基礎', mastery: 75, status: 'Moderate' as const, suggestedAction: '寫更多演練練習題以提升熟悉度' }
    ]
  };

  const handleRunAiAnalysis = async () => {
    if (!testInput.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeSubjectWeakness(selectedSubject, testInput);
    
    setWeaknessList((prev) => {
      const filtered = prev.filter((item) => item.subject !== selectedSubject);
      return [...filtered, result];
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <GlowCard className="rounded-[2.5rem]">
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6 transition-colors duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">
                AI Diagnostic System
              </span>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                科目弱點深度診斷與攻防建議
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenSubjectManager}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增科目</span>
              </button>
              <div className="bg-[#f4f6fb] dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                針對盲點精準補強，拒絕無用刷題
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition ${
                  selectedSubject === sub
                    ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#f4f6fb] dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {currentWeakness ? (
            <div className="space-y-6">
              <div className="bg-slate-950 dark:bg-slate-950 text-white p-6 rounded-2xl flex items-center justify-between border border-slate-800">
                <div>
                  <span className="text-xs font-black uppercase text-slate-400">【{currentWeakness.subject}】預估掌握度</span>
                  <div className="text-4xl font-black text-white mt-1">
                    {currentWeakness.overallScore} <span className="text-lg font-bold text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-300 text-slate-950">
                    優先改善掌握度 &lt; 60% 之單元
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentWeakness.subtopics.map((sub, idx) => (
                  <GlowCard key={idx} className="rounded-2xl">
                    <div className="bg-[#f4f6fb] dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 h-full">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-950 dark:text-white text-base">{sub.name}</span>
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            sub.status === 'Needs Work'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                              : sub.status === 'Moderate'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                          <span>單元熟練度</span>
                          <span className="text-slate-950 dark:text-slate-200">{sub.mastery}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              sub.mastery < 60 ? 'bg-rose-500' : sub.mastery < 80 ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${sub.mastery}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        💡 <span className="font-extrabold text-slate-950 dark:text-amber-300">AI 補強對策：</span> {sub.suggestedAction}
                      </p>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-950 dark:text-indigo-400" />
              <span>輸入最新考卷錯題進行動態分析</span>
            </h3>
            <textarea
              rows={3}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={`輸入在【${selectedSubject}】寫錯的題目或概念...`}
              className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-slate-950 dark:focus:border-indigo-500"
            />
            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing || !testInput.trim()}
              className="px-6 py-3 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-extrabold text-xs flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>分析單元中...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>重新生成弱點診斷</span>
                </>
              )}
            </button>
          </div>

        </div>
      </GlowCard>
    </div>
  );
};
