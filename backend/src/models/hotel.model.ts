import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  location: string;
  description: string;
  amenities: string[];
  images: string[];
  rating: number;
  pricePerNight: number;
  contactNumber?: string;
}

const HotelSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  rating: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  contactNumber: { type: String }
}, {
  timestamps: true
});

export const HotelModel = mongoose.model<IHotel>('Hotel', HotelSchema);
