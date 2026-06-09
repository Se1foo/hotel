import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  user: mongoose.Types.ObjectId;
  tripId: string; // e.g., 'TRP-10492'
  destinationId?: number;
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

const tripSchema = new Schema<ITrip>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tripId: {
      type: String,
      required: true,
    },
    destinationId: {
      type: Number,
      required: false,
    },
    destination: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    guests: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Processing', 'Cancelled'],
      default: 'Processing',
    },
    image: {
      type: String,
      required: true,
    },
    startDay: {
      type: Number,
      required: true,
    },
    endDay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const TripModel = mongoose.model<ITrip>('Trip', tripSchema);
