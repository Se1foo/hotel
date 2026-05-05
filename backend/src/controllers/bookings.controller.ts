import type { Request, Response } from 'express';
import { getBookingsRoadmapMessage, getPlannedBookings } from '../services/bookings.service';

export function listBookings(_req: Request, res: Response): void {
  res.status(501).json({
    message: getBookingsRoadmapMessage(),
    bookings: getPlannedBookings(),
  });
}

export function createBooking(_req: Request, res: Response): void {
  res.status(501).json({
    message: getBookingsRoadmapMessage(),
  });
}
