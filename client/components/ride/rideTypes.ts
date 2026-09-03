import type { RidePlaceDto } from '@/lib/api/taxi';

export type RidePlace = RidePlaceDto;

export type RidePathPoint = {
  latitude: number;
  longitude: number;
};

export type RideMapProps = {
  origin: RidePlace | null;
  destination: RidePlace | null;
  path: RidePathPoint[] | null;
  bottomPad: number;
};
