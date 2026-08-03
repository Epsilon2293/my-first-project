import React, { useState, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Brain,
  Bot,
  Flame,
  BarChart3,
  FileText,
  Users,
  Quote,
  History
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { SchedulePlanner } from './components/SchedulePlanner';
import { WeaknessAnalysis } from './components/WeaknessAnalysis';
import { AiTutorChat } from './components/AiTutorChat';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Dashboard } from './components/Dashboard';
import { PortfolioLogger } from './components/PortfolioLogger';
import { StudyBuddy } from './components/StudyBuddy';
import { HistoryReview } from './components/HistoryReview';
import { ExamSprintModal } from './components/ExamSprintModal';
import { SubjectManagerModal } from './components/SubjectManagerModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';

import { DEFAULT_EXAM, INITIAL_SCHEDULE, MOCK_SCORES, DEFAULT_SUBJECTS, DEFAULT_USER_PROFILE } from './constants';
import { TimeBlock, ScoreRecord, UserProfile, ExamInfo } from './types';
import { getDailyInsight } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'planner' | 'weakness' | 'tutor' | 'pomodoro' | 'dashboard' | 'portfolio' | 'buddy' | 'history'>('overview');
  const [schedule, setSchedule] = useState<TimeBlock[]>(INITIAL_SCHEDULE);
  const [scores, setScores] = useState<ScoreRecord[]>(MOCK_SCORES);
  
  // User Account & Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USER_PROFILE;
  });

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(!userProfile.isSetupCompleted);

  // Custom Subjects State
  const [subjects, setSubjects] = useState<string[]>(userProfile.selectedSubjects || DEFAULT_SUBJECTS);
  const [isSubjectManagerOpen, setIsSubjectManagerOpen] = useState(false);

  const [isSprintMode, setIsSprintMode] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  
  // Dynamic Exam info based on user account setup
  const examInfo: ExamInfo = {
    id: 'custom-exam',
    name: userProfile.examName || DEFAULT_EXAM.name,
    date: userProfile.examDate || DEFAULT_EXAM.date,
    daysLeft: Math.max(0, Math.ceil((new Date(userProfile.examDate || '2025-01-18').getTime() - new Date().getTime()) / (1000 * 3600 * 24))),
    targetScore: userProfile.targetScore || 56,
    subjects: subjects
  };

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const [dailyQuote, setDailyQuote] = useState<{ quote: string; advice: string; efficiencyTip: string }>({
    quote: '今天數學完成率高，建議趁狀態好再完成一回歷屆試題！',
    advice: '適度保持專注與休息節奏，學測高分指日可待。',
    efficiencyTip: '晚上 20:00 - 21:30 邏輯力最佳。'
  });

  useEffect(() => {
    getDailyInsight(75, '😊', 135).then((data) => {
      if (data) setDailyQuote(data);
    });
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setSubjects(newProfile.selectedSubjects);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
  };

  const handleResetData = () => {
    localStorage.removeItem('user_profile');
    setUserProfile(DEFAULT_USER_PROFILE);
    setSubjects(DEFAULT_SUBJECTS);
    setIsAccountModalOpen(true);
  };

  const handleAddSubject = (newSub: string) => {
    if (!subjects.includes(newSub)) {
      const updated = [...subjects, newSub];
      setSubjects(updated);
      setUserProfile((prev) => ({ ...prev, selectedSubjects: updated }));
    }
  };

  const handleRemoveSubject = (subToRemove: string) => {
    if (subjects.length <= 1) {
      alert('請至少保留一個科目！');
      return;
    }
    const updated = subjects.filter((s) => s !== subToRemove);
    setSubjects(updated);
    setUserProfile((prev) => ({ ...prev, selectedSubjects: updated }));
  };

  const handleCompletePomodoro = (minutes: number) => {
    // optional callback
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] dark:bg-slate-950 text-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-slate-950 dark:selection:bg-amber-300 selection:text-white dark:selection:text-slate-950 transition-colors duration-300 pb-12">
      {/* Top Navbar */}
      <Navbar
        exam={examInfo}
        userProfile={userProfile}
        isSprintMode={isSprintMode}
        onToggleSprintModal={() => setIsSprintModalOpen(true)}
        onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        
        {/* Daily Insight Banner Pill */}
        <div className="bg-white dark:bg-slate-900 border border-slate-900/10 dark:border-slate-800 rounded-full px-6 py-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-400/20 text-amber-900 dark:text-amber-300 rounded-full shrink-0">
              <Quote className="w-4 h-4 fill-amber-900 dark:fill-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-widest block">
                Daily AI Insight
              </span>
              <p className="text-xs font-extrabold text-slate-950 dark:text-slate-100">
                "{dailyQuote.quote}"
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-[#f4f6fb] dark:bg-slate-950 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
            💡 <span className="text-slate-950 dark:text-amber-300 font-extrabold">效率提醒:</span> {dailyQuote.efficiencyTip}
          </div>
        </div>

        {/* Tab Navigation Pills */}
        <nav className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'overview', label: '總覽 Hub', icon: Compass },
            { id: 'planner', label: '智慧讀書計畫', icon: Calendar },
            { id: 'weakness', label: 'AI 弱點分析', icon: Brain },
            { id: 'tutor', label: 'AI 問答助教', icon: Bot },
            { id: 'pomodoro', label: '極致專注番茄鐘', icon: Flame },
            { id: 'dashboard', label: '成績 Dashboards', icon: BarChart3 },
            { id: 'history', label: '往日回顧', icon: History },
            { id: 'portfolio', label: '學習歷程紀錄', icon: FileText },
            { id: 'buddy', label: 'AI 線上學伴', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-full text-xs font-black transition-all transform active:scale-95 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Tab View */}
        {activeTab === 'overview' && (
          <Overview
            userProfile={userProfile}
            exam={examInfo}
            schedule={schedule}
            setSchedule={setSchedule}
            scores={scores}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
          />
        )}

        {activeTab === 'planner' && (
          <SchedulePlanner
            schedule={schedule}
            setSchedule={setSchedule}
            daysLeft={examInfo.daysLeft}
            subjects={subjects}
            dailyHoursGoal={userProfile.dailyHoursGoal}
            onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
          />
        )}

        {activeTab === 'weakness' && (
          <WeaknessAnalysis
            subjects={subjects}
            onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
          />
        )}

        {activeTab === 'tutor' && (
          <AiTutorChat
            subjects={subjects}
          />
        )}

        {activeTab === 'pomodoro' && <PomodoroTimer onCompleteSession={handleCompletePomodoro} />}

        {activeTab === 'dashboard' && (
          <Dashboard
            scores={scores}
            setScores={setScores}
            subjects={subjects}
          />
        )}

        {activeTab === 'history' && <HistoryReview />}

        {activeTab === 'portfolio' && <PortfolioLogger />}

        {activeTab === 'buddy' && <StudyBuddy />}
      </main>

      {/* Modals */}
      <AccountSettingsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onOpenSubjectManager={() => setIsSubjectManagerOpen(true)}
        onResetData={handleResetData}
      />

      <ExamSprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        isSprintMode={isSprintMode}
        setIsSprintMode={setIsSprintMode}
      />

      <SubjectManagerModal
        isOpen={isSubjectManagerOpen}
        onClose={() => setIsSubjectManagerOpen(false)}
        subjects={subjects}
        onAddSubject={handleAddSubject}
        onRemoveSubject={handleRemoveSubject}
      />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs font-extrabold text-slate-400 dark:text-slate-600">
        <p>STUDYPILOT AI © 2025 · HIGH SCHOOL LEARNING ECOSYSTEM</p>
      </footer>
    </div>
  );
}
