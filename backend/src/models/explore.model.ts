import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
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

const DestinationSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  beds: { type: String, required: true },
  capacity: { type: String, required: true },
  amenities: { type: [String], required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  tags: { type: [String], default: [] }
}, {
  timestamps: true
});

export const DestinationModel = mongoose.model<IDestination>('Destination', DestinationSchema);
