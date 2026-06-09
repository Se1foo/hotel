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
  image: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedDeals: string[];
  createdAt: string;
  updatedAt: string;
}
