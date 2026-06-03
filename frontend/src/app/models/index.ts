// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'rep';
  avatar?: string;
}

// Auth
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'rep';
}

// Lead
export interface Activity {
  type: 'call' | 'email' | 'note' | 'meeting';
  description: string;
  createdBy: User;
  createdAt: string;
}

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  source: 'Instagram' | 'Website' | 'Referral' | 'LinkedIn' | 'Other';
  status: 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';
  score: number;
  notes?: string;
  assignedTo?: User;
  createdBy: User;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadPayload {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status?: string;
  notes?: string;
  assignedTo?: string;
  score?: number;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  pages: number;
}

// Contact
export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  linkedLeads: Lead[];
  createdBy: User;
  createdAt: string;
}

export interface ContactPayload {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
}

// Deal
export interface Deal {
  _id: string;
  title: string;
  value: number;
  probability: number;
  stage: 'Prospect' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeDate?: string;
  leadId?: Lead;
  assignedTo?: User;
  createdBy: User;
  notes?: string;
  createdAt: string;
}

export interface DealPayload {
  title: string;
  value: number;
  probability?: number;
  stage?: string;
  closeDate?: string;
  leadId?: string;
  assignedTo?: string;
  notes?: string;
}

// Analytics
export interface AnalyticsSummary {
  totalLeads: number;
  totalContacts: number;
  totalDeals: number;
  totalUsers: number;
  totalRevenue: number;
  pipelineValue: number;
  leadsByStatus: { _id: string; count: number }[];
  leadsBySource: { _id: string; count: number }[];
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
