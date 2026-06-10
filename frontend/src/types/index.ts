export type DealType = 'featured' | 'small' | 'medium';

export interface Deal {
  id: number;
  title: string;
  location: string;
  originalPrice: number;
  price: number;
  image: string;
  tag: string;
  type: DealType;
  description?: string;
}

export interface Destination {
  id: number;
  title: string;
  location: string;
  description: string;
  beds: string;
  capacity: string;
  amenities: string[];
  price: number;
  rating: number;
  userRatings?: { userId: string; rating: number }[];
  image: string;
  tags: string[];
  // Deal fields
  isDeal?: boolean;
  originalPrice?: number;
  dealTag?: string;
  dealType?: DealType;
}

export interface Deal extends Destination {
  tag?: string; // mapping for compatibility if needed
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedDeals: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  _id: string;
  tripId: string;
  destination: string;
  title: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  status: 'Confirmed' | 'Processing' | 'Cancelled';
  image: string;
  startDay: number;
  endDay: number;
}
