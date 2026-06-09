import mongoose, { Schema, Document } from 'mongoose';

export type DealType = 'featured' | 'small' | 'medium';

export interface IDeal extends Document {
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

const DealSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  tag: { type: String, required: true },
  type: { type: String, enum: ['featured', 'small', 'medium'], required: true },
  description: { type: String }
}, {
  timestamps: true
});

export const DealModel = mongoose.model<IDeal>('Deal', DealSchema);
