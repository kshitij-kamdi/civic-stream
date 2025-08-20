export type UserRole = 'citizen' | 'official' | 'admin';

export type GrievanceStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'rejected';

export type GrievanceCategory = 'sanitation' | 'electricity' | 'water_supply' | 'roads' | 'public_transport' | 'healthcare' | 'education' | 'other';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  department?: string; // For officials
  isActive: boolean;
  createdAt: string;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  address: string;
  pincode: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  status: GrievanceStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string; // Official ID
  assignedToName?: string;
  slaHours: number; // SLA in hours
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  isEscalated: boolean;
  attachments?: string[];
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: GrievanceStatus;
  timestamp: string;
  updatedBy: string;
  updatedByName: string;
  remarks?: string;
  isEscalation?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
}

export interface SeedData {
  users: User[];
  grievances: Grievance[];
}

export const GRIEVANCE_CATEGORIES: { value: GrievanceCategory; label: string; slaHours: number }[] = [
  { value: 'sanitation', label: 'Sanitation & Waste Management', slaHours: 24 },
  { value: 'electricity', label: 'Electricity & Power', slaHours: 12 },
  { value: 'water_supply', label: 'Water Supply', slaHours: 8 },
  { value: 'roads', label: 'Roads & Infrastructure', slaHours: 48 },
  { value: 'public_transport', label: 'Public Transportation', slaHours: 24 },
  { value: 'healthcare', label: 'Healthcare Services', slaHours: 6 },
  { value: 'education', label: 'Education', slaHours: 72 },
  { value: 'other', label: 'Other Issues', slaHours: 48 }
];

export const STATUS_LABELS: Record<GrievanceStatus, string> = {
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected'
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
};