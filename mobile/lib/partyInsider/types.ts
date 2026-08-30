export type TribeDateDetails = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minutes: string;
  seconds: string;
};

export type TribeImageSize = {
  width: number;
  height: number;
  url: string;
  'mime-type'?: string;
  filesize?: number;
};

export type TribeImage = {
  url: string;
  id?: number;
  extension?: string;
  width?: number;
  height?: number;
  filesize?: number;
  sizes?: Record<string, TribeImageSize>;
};

export type TribeCategory = {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
};

export type TribeVenue = {
  id?: number;
  venue?: string;
  slug?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  phone?: string;
  website?: string;
  url?: string;
  description?: string;
  image?: TribeImage | false | null;
};

export type TribeEvent = {
  id: number;
  title: string;
  description?: string;
  url?: string;
  rest_url?: string;
  slug?: string;
  image?: TribeImage | false | null;
  start_date?: string;
  start_date_details?: TribeDateDetails;
  utc_start_date?: string;
  timezone?: string;
  cost?: string;
  website?: string;
  featured?: boolean;
  categories?: TribeCategory[];
  tags?: unknown[];
  venue?: TribeVenue | TribeVenue[] | false | null;
};

export type TribeEventsList = {
  events?: TribeEvent[];
  rest_url?: string;
  next_rest_url?: string;
  total?: number;
  total_pages?: number;
};
