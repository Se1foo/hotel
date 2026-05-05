import { Router } from 'express';
import { createBooking, listBookings } from '../controllers/bookings.controller';

const bookingsRouter = Router();

bookingsRouter.get('/', listBookings);
bookingsRouter.post('/', createBooking);

export default bookingsRouter;
