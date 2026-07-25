import mongoose, { Document, Schema } from 'mongoose';

/**
 * A refresh token that has already been rotated away.
 *
 * Rotation on its own is unsafe against benign races: two tabs (or React
 * StrictMode's double-invoked effect, or a network retry) can each present the
 * same valid token, the first rotates it, and the second gets a 401 that logs
 * the user out. Retaining the token briefly, alongside the token that replaced
 * it, lets the loser of that race be answered correctly.
 *
 * Presenting a rotated token *after* the grace window has passed is treated as
 * theft, and revokes the whole session family.
 */
export interface RotatedToken {
  token: string;
  replacedBy: string;
  rotatedAt: Date;
}

export interface IUser extends Document {
  /** Mongoose's `id` virtual — the stringified `_id`. Declared so callers can
   *  read `user.id` without a cast. */
  readonly id: string;
  name: string;
  email: string;
  /** Absent for accounts created through Google. */
  passwordHash?: string;
  /** Stringified destination ids the user has saved. */
  savedDeals: string[];
  refreshTokens: string[];
  rotatedTokens: RotatedToken[];
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  /** SHA-256 of the emailed reset token — never the token itself. */
  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;
  authProvider: 'local' | 'google';
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rotatedTokenSchema = new Schema<RotatedToken>(
  {
    token: { type: String, required: true },
    replacedBy: { type: String, required: true },
    rotatedAt: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    passwordHash: { type: String },
    savedDeals: { type: [String], default: [] },
    refreshTokens: { type: [String], default: [] },
    rotatedTokens: { type: [rotatedTokenSchema], default: [] },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, index: true },
    verificationTokenExpires: { type: Date },
    passwordResetTokenHash: { type: String, index: true },
    passwordResetExpires: { type: Date },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, sparse: true },
  },
  { timestamps: true },
);

/**
 * Strips everything sensitive before serialisation. Also removes the
 * verification and reset tokens, which the previous transform left in place —
 * so `GET /auth/me` handed the caller a token that could verify the account.
 */
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const output = ret as unknown as Record<string, unknown>;
    output.id = output._id ? String(output._id) : undefined;
    delete output._id;
    delete output.__v;
    delete output.passwordHash;
    delete output.refreshTokens;
    delete output.rotatedTokens;
    delete output.verificationToken;
    delete output.verificationTokenExpires;
    delete output.passwordResetTokenHash;
    delete output.passwordResetExpires;
    return output;
  },
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
