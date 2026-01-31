
export type Category = 'Sleep' | 'Study' | 'Sports' | 'Expense' | 'Income' | 'Prayer' | 'Mood' | 'General';

export interface LogEntry {
  id: string;
  category: Category;
  value: number;
  unit: string;
  description: string;
  timestamp: number;
  rawText?: string;
}

export interface UserProfile {
  name: string;
  role: 'Student' | 'Business' | 'Housewife' | 'Guest';
  bioKey?: string;
  onboarded: boolean;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: number;
}

export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type VideoAspectRatio = "16:9" | "9:16";
