import { createElement } from 'react';
import {
  BedDouble,
  Building2,
  CheckCircle,
  Flame,
  Martini,
  Mountain,
  Snowflake,
  Sparkles,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
} from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Single amenity → icon map. This logic was duplicated in `RoomCard` and
 * `DestinationDetails` with different sizes and slightly different rules, so the
 * same amenity could render two different icons on two pages.
 *
 * Order matters: the first matching keyword wins, so specific terms come before
 * generic ones ("ocean view" must beat the bare "view").
 */
const AMENITY_ICONS: ReadonlyArray<[readonly string[], ComponentType<{ className?: string }>]> = [
  [['wi-fi', 'wifi', 'internet'], Wifi],
  [['tv', 'television'], Tv],
  [['fireplace', 'fire'], Flame],
  [['pool', 'lagoon', 'overwater', 'snorkel', 'beach', 'ocean'], Waves],
  [['ski', 'slope', 'alpine', 'mountain'], Mountain],
  [['spa', 'massage', 'sauna'], Sparkles],
  [['mini bar', 'minibar', 'bar', 'lounge'], Martini],
  [['breakfast', 'dining', 'restaurant', 'cuisine'], UtensilsCrossed],
  [['air con', 'aircon', 'a/c', 'climate'], Snowflake],
  [['city', 'view', 'balcony', 'terrace', 'deck'], Building2],
  [['bed', 'king', 'queen', 'suite'], BedDouble],
];

/** Resolves an amenity label to a stable, module-level icon component. */
function resolveIcon(amenity: string): ComponentType<{ className?: string }> {
  const normalized = amenity.toLowerCase();
  for (const [keywords, Icon] of AMENITY_ICONS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) return Icon;
  }
  return CheckCircle;
}

interface AmenityIconProps {
  amenity: string;
  className?: string;
}

export function AmenityIcon({ amenity, className = 'w-4 h-4' }: AmenityIconProps) {
  // `createElement` rather than `<Icon />`: the resolved component is a stable
  // module-level reference, but rendering a locally-bound variable as JSX trips
  // React's "components created during render" rule.
  return createElement(resolveIcon(amenity), { className });
}
