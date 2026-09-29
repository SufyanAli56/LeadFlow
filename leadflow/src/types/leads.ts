export interface Lead {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  rating?: number;
  totalRatings?: number;
  googleMapsUri?: string;
}