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
