import mongoose, { Document, Schema } from 'mongoose';

export type TripStatus = 'Confirmed' | 'Processing' | 'Cancelled';

export interface ITrip extends Document {
  user: mongoose.Types.ObjectId;
  /** Human-facing reference, e.g. `TRP-8A3F91`. Generated server-side. */
  tripId: string;
  destinationId: number;
  destination: string;
  title: string;
  /**
   * Real `Date` values. These were `String` before, so the API stored whatever
   * the client sent — ISO timestamps from the booking form and pre-formatted
   * strings like "Oct 12, 2026" from the seeder — making them unsortable and
   * unfilterable.
   */
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  /** Captured at booking time so a later price change can't rewrite history. */
  pricePerNight: number;
  totalPrice: number;
  status: TripStatus;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: String, required: true, unique: true },
    destinationId: { type: Number, required: true, index: true },
    destination: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    // Was a free-text String holding the hardcoded literal "2 Adults".
    guests: { type: Number, required: true, min: 1, max: 20 },
    nights: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Confirmed', 'Processing', 'Cancelled'],
      default: 'Confirmed',
    },
    image: { type: String, required: true },
    // `startDay` / `endDay` integer columns are gone — they existed only to feed
    // the hardcoded single-month calendar and were written as -1 sentinels.
  },
  { timestamps: true },
);

// Supports the "my trips, soonest first" listing and the overlap check.
tripSchema.index({ user: 1, checkIn: 1 });

tripSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const output = ret as unknown as Record<string, unknown>;
    delete output.__v;
    // The owner is implied by the authenticated request; don't leak the id.
    delete output.user;
    return output;
  },
});

export const TripModel = mongoose.model<ITrip>('Trip', tripSchema);
