import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { TripModel } from '../models/trip.model';
import { z } from 'zod';

const router = Router();

// Zod schema for Trip
const tripSchema = z.object({
  tripId: z.string(),
  destination: z.string(),
  title: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.string(),
  status: z.enum(['Confirmed', 'Processing', 'Cancelled']),
  image: z.string().url(),
  startDay: z.number(),
  endDay: z.number()
});

// GET /api/trips - Fetch all trips for authenticated user
const getTrips = async (req: any, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const trips = await TripModel.find({ user: userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server error fetching trips' });
  }
};

// POST /api/trips - Create a new trip
const createTrip = async (req: any, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const parseResult = tripSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: 'Invalid trip data', issues: parseResult.error.issues });
      return;
    }

    const newTrip = new TripModel({
      user: userId,
      ...parseResult.data
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Server error creating trip' });
  }
};

// POST /api/trips/migrate - Temporary endpoint to migrate mock trips
const migrateTrips = async (req: any, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Mock data from frontend
    const UPCOMING_TRIPS = [
      {
        tripId: 'TRP-10492',
        destination: 'Swiss Alps',
        title: 'Alpine Escape Suite',
        checkIn: 'Oct 12, 2026',
        checkOut: 'Oct 18, 2026',
        guests: '2 Adults',
        status: 'Confirmed' as const,
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800',
        startDay: 12,
        endDay: 18,
      },
      {
        tripId: 'TRP-88312',
        destination: 'Kyoto, Japan',
        title: 'Zen Garden Pavilion',
        checkIn: 'Nov 05, 2026',
        checkOut: 'Nov 12, 2026',
        guests: '2 Adults',
        status: 'Processing' as const,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
        startDay: -1,
        endDay: -1,
      }
    ];

    // Delete existing mock trips to avoid duplicates if run multiple times
    await TripModel.deleteMany({ user: userId });

    const tripsToInsert = UPCOMING_TRIPS.map(trip => ({ ...trip, user: userId }));
    const inserted = await TripModel.insertMany(tripsToInsert);

    res.status(201).json({ message: 'Migration successful', trips: inserted });
  } catch (error) {
    console.error('Error migrating trips:', error);
    res.status(500).json({ message: 'Server error migrating trips' });
  }
};

router.get('/', verifyToken, getTrips);
router.post('/', verifyToken, createTrip);
router.post('/migrate', verifyToken, migrateTrips);

export default router;
