import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Target,
  Check,
  Sparkles,
  Settings,
  Bell,
  Sliders,
  Trash2,
  Download,
  BookOpen,
  Cpu,
  Bot,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_SUBJECTS } from '../constants';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenSubjectManager: () => void;
  onResetData?: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenSubjectManager,
  onResetData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'exam' | 'subjects' | 'ai' | 'notifications' | 'data'>('profile');

  // Form State
  const [studentName, setStudentName] = useState(userProfile.studentName || '領航學生');
  const [email, setEmail] = useState(userProfile.email || 'student@studypilot.edu.tw');
  const [gradeTrack, setGradeTrack] = useState(userProfile.gradeTrack || '高三自然組');
  const [targetUniversity, setTargetUniversity] = useState(userProfile.targetUniversity || '台大電機系');
  const [examName, setExamName] = useState(userProfile.examName || '114 學科能力測驗 (學測)');
  const [examDate, setExamDate] = useState(userProfile.examDate || '2025-01-18');
  const [targetScore, setTargetScore] = useState(userProfile.targetScore || 56);
  const [dailyHoursGoal, setDailyHoursGoal] = useState(userProfile.dailyHoursGoal || 3.5);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    userProfile.selectedSubjects.length > 0 ? userProfile.selectedSubjects : DEFAULT_SUBJECTS
  );
  const [enableDailyNotification, setEnableDailyNotification] = useState(userProfile.enableDailyNotification ?? true);
  const [notificationTime, setNotificationTime] = useState(userProfile.notificationTime || '08:00');
  
  // Custom Gemini API Key State
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return userProfile.geminiApiKey || (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '');
  });
  const [showApiKey, setShowApiKey] = useState(false);

  // AI Preferences
  const [aiTutorStyle, setAiTutorStyle] = useState<'warm' | 'strict' | 'concise'>(userProfile.aiTutorStyle || 'warm');
  const [aiPlanStrategy, setAiPlanStrategy] = useState<'weakness' | 'balanced' | 'sprint'>(userProfile.aiPlanStrategy || 'weakness');

  useEffect(() => {
    if (userProfile.geminiApiKey) {
      setGeminiApiKey(userProfile.geminiApiKey);
    }
  }, [userProfile.geminiApiKey]);

  if (!isOpen) return null;

  const toggleSubjectSelection = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length <= 1) {
        alert('請至少保留一個重點考科！');
        return;
      }
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Save custom API key to localStorage for geminiService access
    const trimmedApiKey = geminiApiKey.trim();
    if (typeof window !== 'undefined') {
      if (trimmedApiKey) {
        localStorage.setItem('gemini_api_key', trimmedApiKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }

    const updatedProfile: UserProfile = {
      studentName: studentName.trim() || '領航學生',
      email: email.trim() || 'student@studypilot.edu.tw',
      avatarUrl: userProfile.avatarUrl,
      gradeTrack,
      targetUniversity: targetUniversity.trim() || '目標大學校系',
      examName: examName.trim() || '114 學測',
      examDate,
      targetScore: Number(targetScore) || 56,
      dailyHoursGoal: Number(dailyHoursGoal) || 3.5,
      selectedSubjects,
      enableDailyNotification,
      notificationTime,
      aiTutorStyle,
      aiPlanStrategy,
      geminiApiKey: trimmedApiKey,
      isSetupCompleted: true
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  const handleExportDataBackup = () => {
    const backupData = {
      userProfile: {
        studentName,
        email,
        gradeTrack,
        targetUniversity,
        examName,
        examDate,
        targetScore,
        dailyHoursGoal,
        selectedSubjects,
        aiTutorStyle,
        aiPlanStrategy
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyPilot_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-slate-700 rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1.5 rounded-full bg-[#f4f6fb] dark:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-950 dark:bg-indigo-600 text-white rounded-2xl shadow-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest block mb-0.5">
              SYSTEM & ACCOUNT SETTINGS
            </span>
            <h2 className="font-black text-slate-950 dark:text-white text-2xl sm:text-3xl tracking-tight">
              設定
            </h2>
          </div>
        </div>

        {/* Inner Sub-Navigation Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800 scrollbar-none">
          {[
            { id: 'profile', label: '個人檔案', icon: User },
            { id: 'exam', label: '大考目標', icon: Target },
            { id: 'subjects', label: '準備考科', icon: BookOpen },
            { id: 'ai', label: 'AI 引擎與 API', icon: Cpu },
            { id: 'notifications', label: '通知偏好', icon: Bell },
            { id: 'data', label: '帳號與備份', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-black transition whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#f4f6fb] dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSaveAll} className="space-y-6 text-xs font-semibold">
          
          {/* TAB 1: Profile Settings */}
          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-[#f4f6fb] dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-full bg-slate-950 dark:bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                  {studentName.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-base">{studentName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{gradeTrack} · {targetUniversity}</p>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
                    ✓ 已驗證 AI 學員帳號
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">學生姓名 / 暱稱</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">帳號 Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">年級與類組</label>
                  <select
                    value={gradeTrack}
                    onChange={(e) => setGradeTrack(e.target.value)}
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  >
                    <option value="高三自然組">高三自然組</option>
                    <option value="高三社會組">高三社會組</option>
                    <option value="高二自然組">高二自然組</option>
                    <option value="高二社會組">高二社會組</option>
                    <option value="高一學生">高一學生</option>
                    <option value="重考生">重考生</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500 inline" />
                    <span>第一志願目標大學校系</span>
                  </label>
                  <input
                    type="text"
                    value={targetUniversity}
                    onChange={(e) => setTargetUniversity(e.target.value)}
                    required
                    placeholder="如: 台大電機系"
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Exam & Countdown Goal */}
          {activeSubTab === 'exam' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">主要大考名稱</label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    required
                    placeholder="如: 114 學測"
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">考試日期</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">每日目標讀書時間 (小時)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    step="0.5"
                    value={dailyHoursGoal}
                    onChange={(e) => setDailyHoursGoal(Number(e.target.value))}
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 dark:text-slate-400 font-extrabold block">目標級分 / 總分</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    required
                    className="w-full bg-[#f4f6fb] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-extrabold text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Selected Subjects Management */}
          {activeSubTab === 'subjects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 block">
                  選擇目前重點準備科目 ({selectedSubjects.length})
                </span>
                <button
                  type="button"
                  onClick={onOpenSubjectManager}
                  className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>進階新增/刪除自訂科目</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 bg-[#f4f6fb] dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                {DEFAULT_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubjectSelection(sub)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Custom Gemini API Key & AI Preferences */}
          {activeSubTab === 'ai' && (
            <div className="space-y-5">
              
              {/* Custom Gemini API Key Card */}
              <div className="bg-[#f4f6fb] dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h4 className="font-extrabold text-slate-950 dark:text-white text-sm">自訂 Google Gemini API Key</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">填寫個人專屬金鑰，直接連結 Gemini 2.5 AI 模型服務</p>
                    </div>
                  </div>

                  {geminiApiKey.trim() ? (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>已配置 API Key</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>尚未設定 Key</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block">Gemini API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="貼上您的 AI Studio Gemini API Key (如: AIzaSy...)"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pr-10 font-mono text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title={showApiKey ? '隱藏 API Key' : '顯示 API Key'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>金鑰將安全僅儲存於您個人的瀏覽器 LocalStorage 中</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline flex items-center space-x-1"
                  >
                    <span>免費取得 Gemini API Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* AI Tutor Style */}
              <div className="space-y-2">
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block">AI 問答助教輔導風格</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'warm', title: '溫暖鼓勵型', desc: '詳細耐心的基本概念拆解與正面肯定' },
                    { id: 'strict', title: '高標嚴格型', desc: '強調歷屆試題高分標竿與嚴謹觀念' },
                    { id: 'concise', title: '簡潔極速型', desc: '直奔範例步驟與核心解答精髓' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setAiTutorStyle(style.id as any)}
                      className={`p-3.5 rounded-2xl border text-left space-y-1 transition ${
                        aiTutorStyle === style.id
                          ? 'bg-slate-950 dark:bg-indigo-600 text-white border-slate-950 dark:border-indigo-500 shadow-md'
                          : 'bg-[#f4f6fb] dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="font-black text-xs block">{style.title}</span>
                      <span className="text-[10px] opacity-80 block font-normal">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Strategy */}
              <div className="space-y-2">
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block">AI 讀書計畫智慧排程權重</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'weakness', title: '弱科突破優先', desc: '掌握度低於 60% 之科目時數增加 40%' },
                    { id: 'balanced', title: '均衡平演分配', desc: '各科依大考級分權重平演排程' },
                    { id: 'sprint', title: '考前刷題模式', desc: '提升歷屆試題與模考檢討比重至 70%' }
                  ].map((strat) => (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => setAiPlanStrategy(strat.id as any)}
                      className={`p-3.5 rounded-2xl border text-left space-y-1 transition ${
                        aiPlanStrategy === strat.id
                          ? 'bg-slate-950 dark:bg-indigo-600 text-white border-slate-950 dark:border-indigo-500 shadow-md'
                          : 'bg-[#f4f6fb] dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="font-black text-xs block">{strat.title}</span>
                      <span className="text-[10px] opacity-80 block font-normal">{strat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications & Preferences */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-4">
              <div className="bg-[#f4f6fb] dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-950 dark:text-white block text-sm">每日 AI 讀書計畫提醒</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">每天定時發送個人化 AI 研讀建議與倒數計時</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableDailyNotification}
                    onChange={(e) => setEnableDailyNotification(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {enableDailyNotification && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300 font-extrabold">每日提醒時間</span>
                    <input
                      type="time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-extrabold text-slate-950 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Account Backup & Data Reset */}
          {activeSubTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-[#f4f6fb] dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                  <Download className="w-4 h-4" />
                  <span>資料備份與匯出</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  匯出您包含目標志願、考科設定與讀書目標的 JSON 備份檔。
                </p>
                <button
                  type="button"
                  onClick={handleExportDataBackup}
                  className="px-5 py-2.5 rounded-full bg-slate-950 dark:bg-slate-800 text-white font-extrabold text-xs shadow"
                >
                  下載學習備份檔 (JSON)
                </button>
              </div>

              {onResetData && (
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-5 rounded-2xl space-y-3">
                  <span className="font-black text-rose-800 dark:text-rose-400 text-sm block">危險區域：重置系統資料</span>
                  <p className="text-rose-700 dark:text-rose-300 text-xs">
                    將清除本機已儲存的初始設定與自訂數據，恢復為系統預設值。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('確定要清除設定並重新進行初始設定嗎？')) {
                        onResetData();
                      }
                    }}
                    className="px-5 py-2.5 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow flex items-center space-x-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>清除並重新初始設定</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modal Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-slate-600 dark:text-slate-400 font-extrabold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-slate-950 dark:bg-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-lg flex items-center space-x-2 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>儲存並更新設定</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
