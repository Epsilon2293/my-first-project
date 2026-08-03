export type SubjectType = string;

export interface TimeBlock {
  id: string;
  timeRange: string;
  subject: SubjectType;
  topic: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  notes?: string;
}

export interface ExamInfo {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  daysLeft: number;
  targetScore: number;
  subjects: SubjectType[];
}

export interface SubjectLevel {
  subject: SubjectType;
  level: number; // 1-5 stars
  weakTopics: string[];
}

export interface ScoreRecord {
  id: string;
  date: string;
  examName: string;
  scores: Record<string, number>; // e.g. { '數學A/B': 88, '英文': 75 }
}

export interface SubTopicAnalysis {
  name: string;
  mastery: number; // 0 - 100
  status: 'Needs Work' | 'Moderate' | 'Mastered';
  suggestedAction: string;
}

export interface SubjectWeakness {
  subject: SubjectType;
  overallScore: number;
  subtopics: SubTopicAnalysis[];
}

export interface DailyLog {
  id: string;
  date: string;
  topicsCovered: string[];
  exercisesCompleted: number;
  reflection: string;
  blockers: string;
  focusMinutes: number;
  mood: '😊' | '😐' | '😞';
}

export interface StudyBuddy {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  target: string;
  activeSubject: SubjectType;
  status: 'Online' | 'Focusing' | 'Offline';
  streakDays: number;
}

export interface EfficiencyInsight {
  peakHours: string;
  procrastinationRiskSubject: SubjectType;
  mostProductiveDay: string;
  aiSuggestion: string;
  stressAlert: boolean;
}

export interface HistoryDayRecord {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  mood: '😊' | '😐' | '😞';
  tasksCompleted: TimeBlock[];
  log?: DailyLog;
  scoreRecord?: ScoreRecord;
  aiReview?: string;
}

export interface UserProfile {
  studentName: string;
  email: string;
  avatarUrl?: string;
  gradeTrack: string; // e.g. 高三自然組, 高三社會組
  targetUniversity: string; // e.g. 台大電機系
  examName: string; // e.g. 114 學測
  examDate: string; // YYYY-MM-DD
  targetScore: number;
  dailyHoursGoal: number;
  selectedSubjects: string[];
  enableDailyNotification: boolean;
  notificationTime: string; // e.g. '08:00'
  aiTutorStyle: 'warm' | 'strict' | 'concise';
  aiPlanStrategy: 'weakness' | 'balanced' | 'sprint';
  geminiApiKey?: string;
  isSetupCompleted: boolean;
}
