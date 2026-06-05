export type Currency = 'SAR';

export enum Category {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  ACCOMMODATION = 'Accommodation',
  ACTIVITIES = 'Activities',
  SHOPPING = 'Shopping',
  OTHER = 'Other',
  SUBSCRIPTION = 'Subscription'
}

export interface User {
  id: string;
  name: string;
  email: string;
  personalBalance: number; // New: Personal wallet balance
}

export interface Member {
  userId: string;
  name: string;
  contributionAmount: number; // In SAR
  hasPaid: boolean;
  avatar?: string;
}

export interface Expense {
  id: string;
  userId: string; // Who authorized the spend (usually matches a member)
  userName: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
}

export interface Group {
  id: string;
  name: string;
  targetAmount: number;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
  createdBy: string; // User ID of the creator
}

export interface Subscription {
  id: string;
  serviceName: string;
  icon: string;
  color: string;
  totalPrice: number;
  myShare: number;
  members: { name: string; avatar?: string }[];
  renewalDate: string;
}

export interface RefundResult {
  userId: string;
  userName: string;
  refundAmount: number;
  percentage: number;
}
