import type { VenuePin } from '@/lib/mapVenues';

export type MapCanvasProps = {
  pins: VenuePin[];
  selectedId: string | null;
  interactive: boolean;
  compact: boolean;
  onSelectPin: (id: string | null) => void;
};
