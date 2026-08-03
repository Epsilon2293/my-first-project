import { ExamInfo, TimeBlock, ScoreRecord, DailyLog, StudyBuddy, SubjectWeakness, HistoryDayRecord, UserProfile } from './types';

export const DEFAULT_SUBJECTS: string[] = [
  '數學A/B',
  '英文',
  '物理',
  '化學',
  '生物',
  '國文',
  '歷史',
  '地理',
  '公民'
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  studentName: '領航學生',
  email: 'student@studypilot.edu.tw',
  avatarUrl: 'https://picsum.photos/seed/studypilot_user/120/120',
  gradeTrack: '高三自然組',
  targetUniversity: '台大電機系',
  examName: '114 學科能力測驗 (學測)',
  examDate: '2025-01-18',
  targetScore: 56,
  dailyHoursGoal: 3.5,
  selectedSubjects: DEFAULT_SUBJECTS,
  enableDailyNotification: true,
  notificationTime: '08:00',
  aiTutorStyle: 'warm',
  aiPlanStrategy: 'weakness',
  geminiApiKey: '',
  isSetupCompleted: false
};

export const DEFAULT_EXAM: ExamInfo = {
  id: '114-csat',
  name: '114 學科能力測驗 (學測)',
  date: '2025-01-18',
  daysLeft: 58,
  targetScore: 56,
  subjects: DEFAULT_SUBJECTS
};

export const INITIAL_SCHEDULE: TimeBlock[] = [
  {
    id: '1',
    timeRange: '18:00 ~ 19:00',
    subject: '數學A/B',
    topic: '排列組合與機率經典題刷題',
    priority: 'High',
    completed: true,
    notes: '務必搞懂組合公式的適用條件'
  },
  {
    id: '2',
    timeRange: '19:10 ~ 20:00',
    subject: '英文',
    topic: '學測高頻率 7000 單字 Unit 24 + 閱讀理解',
    priority: 'Medium',
    completed: false
  },
  {
    id: '3',
    timeRange: '20:10 ~ 21:00',
    subject: '物理',
    topic: '牛頓第二運動定律與斜面受力分析',
    priority: 'High',
    completed: false
  },
  {
    id: '4',
    timeRange: '21:10 ~ 21:50',
    subject: '化學',
    topic: '化學平衡常數與勒沙特列原理實驗',
    priority: 'Low',
    completed: false
  }
];

export const MOCK_SCORES: ScoreRecord[] = [
  { id: '1', date: '09/15', examName: '第一次模考', scores: { '數學A/B': 68, '英文': 82, '物理': 65, '化學': 70, '國文': 85 } },
  { id: '2', date: '10/12', examName: '第一次段考', scores: { '數學A/B': 74, '英文': 85, '物理': 71, '化學': 76, '國文': 88 } },
  { id: '3', date: '11/05', examName: '第二次模考', scores: { '數學A/B': 81, '英文': 88, '物理': 78, '化學': 82, '國文': 90 } },
  { id: '4', date: '11/28', examName: '第三次模考', scores: { '數學A/B': 88, '英文': 91, '物理': 84, '化學': 86, '國文': 92 } }
];

export const MOCK_WEAKNESSES: SubjectWeakness[] = [
  {
    subject: '數學A/B',
    overallScore: 82,
    subtopics: [
      { name: '多項式函數', mastery: 92, status: 'Mastered', suggestedAction: '保持基本複習即可' },
      { name: '排列組合', mastery: 52, status: 'Needs Work', suggestedAction: '建議補強分組分群與重複組合觀念' },
      { name: '古典機率', mastery: 48, status: 'Needs Work', suggestedAction: '先將條件機率定義弄懂，並練習歷屆試題' },
      { name: '三角函數', mastery: 85, status: 'Mastered', suggestedAction: '留意和差角公式變形' }
    ]
  },
  {
    subject: '英文',
    overallScore: 88,
    subtopics: [
      { name: '詞彙與片語', mastery: 90, status: 'Mastered', suggestedAction: '維持每日固定記誦 20 字' },
      { name: '文法與句型', mastery: 55, status: 'Needs Work', suggestedAction: '加強分詞構句與倒裝句用法' },
      { name: '閱讀測驗', mastery: 86, status: 'Moderate', suggestedAction: '練習文章速讀與主旨擷取技巧' },
      { name: '英文作文', mastery: 72, status: 'Moderate', suggestedAction: '每週完成一篇文脈連貫練習' }
    ]
  }
];

export const MOCK_BUDDIES: StudyBuddy[] = [
  {
    id: 'b1',
    name: '建宏 (建中)',
    avatar: 'https://picsum.photos/seed/build1/100/100',
    grade: '高三自然組',
    target: '台大電機系',
    activeSubject: '物理',
    status: 'Focusing',
    streakDays: 18
  },
  {
    id: 'b2',
    name: '敏婷 (北一女)',
    avatar: 'https://picsum.photos/seed/girl2/100/100',
    grade: '高三社會組',
    target: '台大法律系',
    activeSubject: '英文',
    status: 'Focusing',
    streakDays: 25
  },
  {
    id: 'b3',
    name: '宇翔 (台中一中)',
    avatar: 'https://picsum.photos/seed/boy3/100/100',
    grade: '高三自然組',
    target: '陽明交大資工',
    activeSubject: '數學A/B',
    status: 'Online',
    streakDays: 12
  }
];

export const INITIAL_LOGS: DailyLog[] = [
  {
    id: 'log-1',
    date: '2024-11-26',
    topicsCovered: ['數學：機率與統計', '物理：電磁感應觀念'],
    exercisesCompleted: 28,
    reflection: '今天數學排列組合觀念有變清晰，但算條件機率時依然容易粗心漏掉限制條件。',
    blockers: '對於古典機率中的取後不放回邏輯需要再解 5 題觀念題。',
    focusMinutes: 145,
    mood: '😊'
  }
];

export const MOCK_HISTORY_RECORDS: HistoryDayRecord[] = [
  {
    date: '2024-11-28',
    focusMinutes: 210,
    mood: '😊',
    tasksCompleted: [
      { id: 'h1', timeRange: '18:00 ~ 19:30', subject: '數學A/B', topic: '完成第三次模考檢討與排列組合觀念整理', priority: 'High', completed: true },
      { id: 'h2', timeRange: '19:40 ~ 20:30', subject: '英文', topic: '英文學測閱讀理解 2 篇 + 寫作金句背誦', priority: 'High', completed: true },
      { id: 'h3', timeRange: '20:40 ~ 21:30', subject: '物理', topic: '電磁學磁力與勞侖茲力公式推導練習', priority: 'Medium', completed: true }
    ],
    log: {
      id: 'hlog-1',
      date: '2024-11-28',
      topicsCovered: ['第三次模考檢討', '英文閱讀理解', '物理電磁學'],
      exercisesCompleted: 35,
      reflection: '模考數學拿到 88 分！排列組合粗心減少很多，代表前陣子的補強有效。',
      blockers: '物理幾題電磁效應計算步驟稍嫌繁瑣，需要加強運算速度。',
      focusMinutes: 210,
      mood: '😊'
    },
    scoreRecord: { id: '4', date: '11/28', examName: '第三次模考', scores: { '數學A/B': 88, '英文': 91, '物理': 84, '化學': 86, '國文': 92 } },
    aiReview: '🎯【AI 復盤評價】這是一次質量的突破！當日專注時數達 210 分鐘，模考成績數學與英文均創下個人新高。您展現了極佳的錯題檢討習慣，請繼續維持目前的節奏！'
  },
  {
    date: '2024-11-27',
    focusMinutes: 160,
    mood: '😐',
    tasksCompleted: [
      { id: 'h4', timeRange: '18:30 ~ 19:30', subject: '化學', topic: '化學反應速率與催化劑實驗範例演算', priority: 'Medium', completed: true },
      { id: 'h5', timeRange: '19:40 ~ 20:40', subject: '國文', topic: '古文十五篇重點復習與閱讀測驗題庫', priority: 'Low', completed: true }
    ],
    log: {
      id: 'hlog-2',
      date: '2024-11-27',
      topicsCovered: ['化學反應速率', '國文古文十五'],
      exercisesCompleted: 22,
      reflection: '今天上完課比較疲累，但依然堅持完成了化學與國文的排程。',
      blockers: '晚上思考速度變慢，寫題目有些恍神。',
      focusMinutes: 160,
      mood: '😐'
    },
    aiReview: '💡【AI 復盤評價】雖然體力較為疲憊，但依然完成了 160 分鐘沉浸讀書。建議在疲憊日安排較輕量的單字或古文複習，適度休息能讓隔天的精神更集中！'
  },
  {
    date: '2024-11-26',
    focusMinutes: 145,
    mood: '😊',
    tasksCompleted: [
      { id: 'h6', timeRange: '18:00 ~ 19:00', subject: '數學A/B', topic: '古典機率與條件機率定義觀念釐清', priority: 'High', completed: true },
      { id: 'h7', timeRange: '19:10 ~ 20:10', subject: '物理', topic: '牛頓定律與斜面力學運動方程解析', priority: 'High', completed: true }
    ],
    log: {
      id: 'hlog-3',
      date: '2024-11-26',
      topicsCovered: ['數學：機率與統計', '物理：電磁感應觀念'],
      exercisesCompleted: 28,
      reflection: '今天數學排列組合觀念有變清晰，但算條件機率時依然容易粗心漏掉限制條件。',
      blockers: '對於古典機率中的取後不放回邏輯需要再解 5 題觀念題。',
      focusMinutes: 145,
      mood: '😊'
    },
    aiReview: '✨【AI 復盤評價】數學與物理的高優先權單元執行度很高！條件機率觀念已經建立，建議趁記憶猶新完成隨堂測驗題。'
  },
  {
    date: '2024-11-25',
    focusMinutes: 180,
    mood: '😞',
    tasksCompleted: [
      { id: 'h8', timeRange: '19:00 ~ 20:30', subject: '英文', topic: '英文作文翻譯練習與文章句型結構調整', priority: 'Medium', completed: true }
    ],
    log: {
      id: 'hlog-4',
      date: '2024-11-25',
      topicsCovered: ['英文作文與翻譯'],
      exercisesCompleted: 15,
      reflection: '今天讀書效率較低，作文卡關許久，情緒有些焦慮。',
      blockers: '作文卡在段落轉折詞使用不順。',
      focusMinutes: 180,
      mood: '😞'
    },
    aiReview: '🌿【AI 復盤評價】遇到學習瓶頸是常態，焦慮代表您十分在乎自己的進步！作文轉折詞可以先積累 5 個高頻萬用句型，不要給自己過大壓力，明天會更好！'
  }
];
