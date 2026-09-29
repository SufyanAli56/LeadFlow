export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed";

export type LeadSource = "manual" | "google_maps";

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string | null;
  phone?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
  address?: string | null;
  category?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  google_maps_url?: string | null;
  source: LeadSource;
  source_id?: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface CreateLeadData {
  name: string;
  company: string;
  email?: string | null;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  address?: string | null;
  category?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  google_maps_url?: string | null;
  source?: LeadSource;
  source_id?: string | null;
  status?: LeadStatus;
}

export interface UpdateLeadData {
  name: string;
  company: string;
  email?: string | null;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  address?: string | null;
  category?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  google_maps_url?: string | null;
  status: LeadStatus;
}
