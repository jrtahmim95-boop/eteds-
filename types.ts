
export type Category = 'Sleep' | 'Study' | 'Sports' | 'Expense' | 'Income' | 'Prayer' | 'Mood' | 'General';

export interface LogEntry {
  id: string;
  category: Category;
  value: number;
  unit: string;
  description: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  role: 'Student' | 'Businessman' | 'Housewife' | 'Guest';
  bioKey?: string; // Simulated biometric key
  onboarded: boolean;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  members: LeaderboardMember[];
  createdBy: string;
}

export interface LeaderboardMember {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  lastUpdate: number;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  timeframe: 'Monthly' | 'Yearly';
  tasks: SubTask[];
  category: Category;
  deadline: number;
}

export interface PlannerTask {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
  notificationEnabled: boolean;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
}

export interface VaultItem {
  id: string;
  label: string;
  value: string; // Encrypted
  category: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type VideoAspectRatio = "16:9" | "9:16";
