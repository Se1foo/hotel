export type DealType = 'featured' | 'medium' | 'small';

export type TripStatus = 'Confirmed' | 'Processing' | 'Cancelled';

export interface Review {
  userId: string;
  authorName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Destination {
  id: number;
  title: string;
  location: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
  description: string;
  beds: string;
  capacity: string;
  amenities: string[];
  price: number;
  rating: number;
  /** Replaces `userRatings` — reviews now carry optional prose and a timestamp. */
  reviews: Review[];
  /** Hero image; always `images[0]`. */
  image: string;
  images: string[];
  tags: string[];
  isDeal?: boolean;
  originalPrice?: number;
  dealTag?: string;
  dealType?: DealType;
}

/**
 * Deals are Destinations flagged with `isDeal`, served by `/api/deals`.
 *
 * This used to be a second `interface Deal` declared alongside a conflicting
 * one, which TypeScript merged into an unbuildable type (TS2430/TS2717).
 */
export type Deal = Destination;

export interface User {
  id: string;
  name: string;
  email: string;
  /** Stringified destination ids the user has saved. */
  savedDeals: string[];
  isVerified: boolean;
  authProvider: 'local' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  _id: string;
  tripId: string;
  destinationId: number;
  destination: string;
  title: string;
  /** ISO 8601 date strings. */
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: TripStatus;
  image: string;
  createdAt?: string;
}
