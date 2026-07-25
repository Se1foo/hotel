import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  /** Set once the reservations team has replied. */
  handled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    handled: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const ContactMessageModel = mongoose.model<IContactMessage>(
  'ContactMessage',
  contactMessageSchema,
);
