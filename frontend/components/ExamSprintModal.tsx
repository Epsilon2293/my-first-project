import React from 'react';
import { ShieldAlert, X, Check } from 'lucide-react';

interface ExamSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSprintMode: boolean;
  setIsSprintMode: (val: boolean) => void;
}

export const ExamSprintModal: React.FC<ExamSprintModalProps> = ({
  isOpen,
  onClose,
  isSprintMode,
  setIsSprintMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-slate-700 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1.5 rounded-full bg-[#f4f6fb] dark:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-slate-950 dark:text-white text-xl tracking-tight">AI 考前高壓衝刺模式</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">學測最後階段自動優化策略</p>
          </div>
        </div>

        <div className="space-y-3 text-xs font-bold text-slate-800 dark:text-slate-200 bg-[#f4f6fb] dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-start space-x-2">
            <Check className="w-4 h-4 text-slate-950 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>將【歷屆試題與模擬考刷題】排程比例調升至 70%</span>
          </div>
          <div className="flex items-start space-x-2">
            <Check className="w-4 h-4 text-slate-950 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>暫停學習全新章節，聚焦全範圍跨單元觀念鞏固</span>
          </div>
          <div className="flex items-start space-x-2">
            <Check className="w-4 h-4 text-slate-950 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>自動於週末排定模擬試題演練時間</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
            狀態：{isSprintMode ? '啟用中' : '關閉中'}
          </span>
          <button
            onClick={() => {
              setIsSprintMode(!isSprintMode);
              onClose();
            }}
            className={`px-6 py-3 rounded-full text-xs font-black transition ${
              isSprintMode
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-200'
                : 'bg-slate-950 dark:bg-rose-600 text-white hover:bg-slate-800'
            }`}
          >
            {isSprintMode ? '關閉衝刺模式' : '🔥 啟動考前衝刺'}
          </button>
        </div>

      </div>
    </div>
  );
};
