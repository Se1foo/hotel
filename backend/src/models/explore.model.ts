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
  userRatings: { userId: string; rating: number }[];
  image: string;
  tags: string[];
  // Deal fields
  isDeal?: boolean;
  originalPrice?: number;
  dealTag?: string;
  dealType?: 'featured' | 'small' | 'medium';
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
  userRatings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true }
  }],
  image: { type: String, required: true },
  tags: { type: [String], default: [] },
  isDeal: { type: Boolean, default: false },
  originalPrice: { type: Number },
  dealTag: { type: String },
  dealType: { type: String, enum: ['featured', 'small', 'medium'] }
}, {
  timestamps: true
});

export const DestinationModel = mongoose.model<IDestination>('Destination', DestinationSchema);
