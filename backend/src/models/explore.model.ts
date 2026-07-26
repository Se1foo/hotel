import mongoose, { Document, Schema } from 'mongoose';

export type DealType = 'featured' | 'medium' | 'small';

export interface IReview {
  userId: mongoose.Types.ObjectId | string;
  /** Denormalised so the reviews list doesn't need a populate on every read. */
  authorName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IDestination extends Document {
  /** Stable public identifier used in URLs, distinct from `_id`. */
  id: number;
  title: string;
  location: string;
  /** ISO 3166-1 alpha-2, for grouping and flags. */
  country: string;
  description: string;
  beds: string;
  capacity: string;
  amenities: string[];
  price: number;
  rating: number;
  /**
   * Replaces `userRatings`. A rating with no words attached tells a prospective
   * guest very little, so reviews now carry optional prose and a timestamp.
   */
  reviews: IReview[];
  /** Primary/hero image. Kept as its own field so list views need only one URL. */
  image: string;
  /** Gallery, hero first. */
  images: string[];
  tags: string[];
  isDeal: boolean;
  originalPrice?: number;
  dealTag?: string;
  dealType?: DealType;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true, trim: true, maxlength: 120 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const destinationSchema = new Schema<IDestination>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2 },
    description: { type: String, required: true },
    beds: { type: String, required: true },
    capacity: { type: String, required: true },
    amenities: { type: [String], required: true, default: [] },
    price: { type: Number, required: true, min: 0, index: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviews: { type: [reviewSchema], default: [] },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    isDeal: { type: Boolean, default: false, index: true },
    originalPrice: { type: Number, min: 0 },
    dealTag: { type: String, trim: true },
    dealType: { type: String, enum: ['featured', 'medium', 'small'] },
  },
  { timestamps: true },
);

// Backs the free-text location/title search.
destinationSchema.index({ title: 'text', location: 'text', tags: 'text' });

destinationSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const output = ret as unknown as Record<string, unknown>;
    // `id` is a real numeric field here, so `_id` is redundant noise.
    delete output._id;
    delete output.__v;
    return output;
  },
});

export const DestinationModel = mongoose.model<IDestination>('Destination', destinationSchema);
