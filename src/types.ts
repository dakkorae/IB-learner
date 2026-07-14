export type LearnerProfileKey =
  | 'Inquirers'
  | 'Knowledgeable'
  | 'Thinkers'
  | 'Communicators'
  | 'Principled'
  | 'Open-minded'
  | 'Caring'
  | 'Risk-takers'
  | 'Balanced'
  | 'Reflective';

export interface ProfileDefinition {
  key: LearnerProfileKey;
  name: string;
  englishName: string;
  emoji: string;
  color: string; // Tailwind color class or hex
  borderColor: string;
  bgColor: string;
  textColor: string;
  mission: string;
  description: string;
  tips: string[];
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  completed: LearnerProfileKey[]; // keys of profiles completed on this day
  submitted: boolean;
  memo?: string;
}

export type ViewType = 'dashboard' | 'mission' | 'profiles' | 'settings' | 'badges';
export type TimePeriod = 'day' | 'week' | 'month' | '3months' | '6months' | '1year';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirementDescription: string;
  profileKey?: LearnerProfileKey;
  requiredCount: number;
  type: 'profile_count' | 'total_days';
}

