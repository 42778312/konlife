export type ApiEventStatus = 'current' | 'upcoming' | 'past' | 'unknown';

export interface ApiNamedTerm {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  count?: number | null;
}

export interface ApiVenue {
  id: number;
  name: string;
  slug?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zip?: string | null;
  phone?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  url?: string | null;
}

export interface ApiOrganizer {
  id: number;
  name: string;
  slug?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  description?: string | null;
  url?: string | null;
}

export interface ApiSourceInfo {
  name: string;
  url: string;
}

export interface ApiEvent {
  id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  excerpt?: string | null;
  url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  timezone?: string;
  all_day?: boolean;
  status?: ApiEventStatus;
  is_current?: boolean;
  is_upcoming?: boolean;
  is_past?: boolean;
  is_party?: boolean;
  party_score?: number;
  cost?: string | null;
  website?: string | null;
  image?: string | null;
  venue?: ApiVenue | null;
  organizers?: ApiOrganizer[];
  categories?: ApiNamedTerm[];
  tags?: ApiNamedTerm[];
  featured?: boolean;
  ticketed?: boolean;
  is_virtual?: boolean;
  source?: ApiSourceInfo;
}

export interface EventListResponse {
  items: ApiEvent[];
  page: number;
  per_page: number;
  total: number;
  has_next: boolean;
}
