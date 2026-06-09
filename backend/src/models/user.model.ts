import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string; // Optional for Google users
  savedDeals: string[];
  refreshTokens: string[];
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  authProvider: 'local' | 'google';
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // Optional
    savedDeals: { type: [String], default: [] },
    refreshTokens: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String },
  },
  { timestamps: true }
);

// Add transformation to remove sensitive fields when JSON is returned
UserSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.refreshTokens;
    return ret;
  }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
