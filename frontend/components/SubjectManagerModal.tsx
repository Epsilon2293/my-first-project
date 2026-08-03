import React, { useState } from 'react';
import { X, Plus, BookOpen, Trash2, Sparkles } from 'lucide-react';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: string[];
  onAddSubject: (subjectName: string) => void;
  onRemoveSubject: (subjectName: string) => void;
}

export const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddSubject,
  onRemoveSubject
}) => {
  const [newSubjectInput, setNewSubjectInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubjectInput.trim();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) {
      alert('該科目名稱已存在！');
      return;
    }
    onAddSubject(trimmed);
    setNewSubjectInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-slate-700 rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1.5 rounded-full bg-[#f4f6fb] dark:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest block">
              CUSTOM SUBJECTS
            </span>
            <h3 className="font-black text-slate-950 dark:text-white text-2xl tracking-tight">
              自訂學習科目管理
            </h3>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
          您可以自由新增如「地球科學、資訊科學、APCS、微積分、分科測驗專科」等自訂科目，AI 讀書計畫、弱點診斷與問答助教將自動同步支援！
        </p>

        {/* Add Subject Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newSubjectInput}
            onChange={(e) => setNewSubjectInput(e.target.value)}
            placeholder="輸入新科目名稱 (如: 地球科學)"
            className="flex-1 bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-extrabold text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-slate-950 dark:bg-indigo-600 hover:opacity-90 text-white font-extrabold text-xs rounded-2xl flex items-center space-x-1.5 shadow transition transform active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>新增科目</span>
          </button>
        </form>

        {/* Current Subjects List */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black uppercase text-slate-400 block">
            目前所有考科 ({subjects.length})
          </span>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {subjects.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#f4f6fb] dark:bg-slate-950 text-slate-950 dark:text-slate-100 border border-slate-200 dark:border-slate-800 group"
              >
                <span>{sub}</span>
                <button
                  onClick={() => onRemoveSubject(sub)}
                  className="text-slate-400 hover:text-rose-500 transition ml-1"
                  title={`刪除 ${sub}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-black text-xs shadow-md"
          >
            完成設定
          </button>
        </div>

      </div>
    </div>
  );
};
