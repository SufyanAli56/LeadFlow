export interface LeadSearchParams {
  businessType: string;
  location: string;
  keywords: string;
  limit: number;
}

export interface LeadSearchResult {
  sourceId: string | null;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewsCount: number | null;
  googleMapsUrl: string | null;
}

export interface FindLeadsResponse {
  leads: LeadSearchResult[];
}

export type AddLeadFromSearchOutcome =
  | "added"
  | "already_added"
  | "missing_source_id"
  | "error";
