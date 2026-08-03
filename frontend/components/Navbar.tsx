import React from 'react';
import { Flame, ShieldAlert, Clock, Bell, Sun, Moon, BookPlus, Settings } from 'lucide-react';
import { ExamInfo, UserProfile } from '../types';

interface NavbarProps {
  exam: ExamInfo;
  userProfile: UserProfile;
  isSprintMode: boolean;
  onToggleSprintModal: () => void;
  onOpenSubjectManager: () => void;
  onOpenAccountModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  exam,
  userProfile,
  isSprintMode,
  onToggleSprintModal,
  onOpenSubjectManager,
  onOpenAccountModal,
  activeTab,
  setActiveTab,
  isDark,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 px-4 sm:px-8 pt-4 pb-2 bg-[#eef1f6]/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-full px-6 py-3 shadow-sm flex items-center justify-between transition-colors duration-300">
        
        {/* Brand Logo - Clickable to open Settings Modal */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onOpenAccountModal}
          title="點擊進行帳號與系統設定"
        >
          <div className="w-10 h-10 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xl flex items-center justify-center tracking-tighter group-hover:scale-105 transition-transform shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tighter text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                STUDYPILOT
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-400 text-slate-950 tracking-wider flex items-center space-x-1">
                <span>AI v2.5</span>
                <Settings className="w-3 h-3 opacity-60 inline ml-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Center Exam Countdown Badge */}
        <div className="hidden lg:flex items-center space-x-2 bg-[#f4f6fb] dark:bg-slate-950 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Clock className="w-4 h-4 text-slate-950 dark:text-amber-400" />
          <span>{exam.name}</span>
          <span className="bg-slate-950 dark:bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black">
            倒數 {exam.daysLeft} 天
          </span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Custom Subject Manager Button */}
          <button
            onClick={onOpenSubjectManager}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-extrabold bg-[#f4f6fb] dark:bg-slate-800 text-slate-950 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <BookPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>自訂科目</span>
          </button>

          <button
            onClick={onToggleSprintModal}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all transform hover:scale-105 ${
              isSprintMode
                ? 'bg-rose-500 text-white border-2 border-slate-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 dark:from-indigo-900/60 dark:via-purple-900/60 dark:to-rose-900/60 text-slate-950 dark:text-slate-100 hover:opacity-90 border border-slate-900/10 dark:border-slate-700'
            }`}
          >
            {isSprintMode ? (
              <>
                <ShieldAlert className="w-4 h-4 animate-bounce" />
                <span className="font-extrabold">考前高壓衝刺中</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-slate-950 dark:fill-amber-400 dark:text-amber-400" />
                <span className="font-extrabold">切換考前衝刺</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-400 transition"
              title={isDark ? "切換至淺色主題" : "切換至深色主題"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">
              <Bell className="w-4 h-4" />
            </button>
            
            <div 
              onClick={onOpenAccountModal}
              className="w-9 h-9 rounded-full bg-slate-950 dark:bg-indigo-600 text-white flex items-center justify-center font-extrabold text-[11px] tracking-tight shadow-md cursor-pointer hover:scale-105 transition"
              title={`${userProfile.studentName} (${userProfile.gradeTrack}) - 點擊打開設定`}
            >
              {userProfile.studentName.slice(0, 2)}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
