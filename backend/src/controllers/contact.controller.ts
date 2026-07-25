import type { NextFunction, Request, Response } from 'express';
import { ContactMessageModel } from '../models/contact.model';
import { ContactMessageSchema } from '../utils/validation';

/**
 * Persists an enquiry from the contact form.
 *
 * The form previously had no endpoint at all: the page ran a `setTimeout(1200)`,
 * showed "Message Sent!", and discarded whatever the visitor typed. Messages are
 * now stored so they can actually be answered.
 */
export async function submitContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = ContactMessageSchema.parse(req.body);
    const saved = await ContactMessageModel.create(input);

    // TODO: forward to the reservations inbox via a transactional email provider.
    console.log(`[contact] New enquiry ${saved.id} from ${saved.email}`);

    res.status(201).json({ message: 'Thanks — we will be in touch within one business day.' });
  } catch (error) {
    next(error);
  }
}
