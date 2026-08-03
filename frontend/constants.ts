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

export const INITIAL_SCHEDULE: TimeBlock[] = [];

export const MOCK_SCORES: ScoreRecord[] = [];

export const MOCK_WEAKNESSES: SubjectWeakness[] = [];

export const MOCK_BUDDIES: StudyBuddy[] = [];

export const INITIAL_LOGS: DailyLog[] = [];

export const MOCK_HISTORY_RECORDS: HistoryDayRecord[] = [];
