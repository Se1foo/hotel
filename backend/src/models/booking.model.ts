export interface Booking {
  id: string;
  guestName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'draft' | 'confirmed' | 'cancelled';
}
