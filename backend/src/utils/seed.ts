import { DestinationModel } from '../models/explore.model';
import { env } from '../config/env';

/**
 * Builds an Unsplash delivery URL.
 *
 * Every seeded image previously pointed at `lh3.googleusercontent.com/aida-public/...`
 * — temporary Google Stitch export URLs. Those expire, so the entire catalogue
 * would eventually render as broken images. These are stable Unsplash photo IDs,
 * each verified to resolve, requested at a sensible size rather than full res.
 */
const img = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${width}`;

interface SeedDestination {
  id: number;
  title: string;
  location: string;
  country: string;
  description: string;
  beds: string;
  capacity: string;
  amenities: string[];
  price: number;
  rating: number;
  images: string[];
  tags: string[];
  isDeal?: boolean;
  originalPrice?: number;
  dealTag?: string;
  dealType?: 'featured' | 'medium' | 'small';
}

const CATALOGUE: SeedDestination[] = [
  {
    id: 1,
    title: 'Viceroy Bali Valley Resort',
    location: 'Ubud, Bali',
    country: 'ID',
    description:
      'A cluster of private-pool villas terraced into the Petanu river gorge. Every suite opens onto its own infinity edge, and breakfast arrives by floating tray.\n\nThe spa runs traditional Balinese treatments until late, and the resort will arrange sunrise hikes on Mount Batur with a private guide.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Private Pool', 'Spa', 'Free Wi-Fi', 'Fine Dining', 'Airport Transfer'],
    price: 1250,
    originalPrice: 1800,
    rating: 4.9,
    images: [img('1566073771259-6a8506099945'), img('1571003123894-1f0594d2b5d9'), img('1520250497591-112f2f40a3f4')],
    tags: ['Luxury', 'Romantic', 'Jungle'],
    isDeal: true,
    dealTag: 'Top pick',
    dealType: 'featured',
  },
  {
    id: 2,
    title: 'Aura Caldera Suites',
    location: 'Oia, Santorini',
    country: 'GR',
    description:
      'Whitewashed cave suites carved into the caldera wall, each with a private plunge pool angled directly at the sunset.\n\nA five-minute walk from Oia village, but far enough down the cliff path that the crowds never reach you.',
    beds: '1 Queen',
    capacity: 'Up to 2',
    amenities: ['Ocean View', 'Plunge Pool', 'Balcony', 'Breakfast Included', 'Free Wi-Fi'],
    price: 780,
    originalPrice: 1200,
    rating: 4.8,
    images: [img('1564501049412-61c2a3083791'), img('1600585154340-be6161a56a0c'), img('1571003123894-1f0594d2b5d9')],
    tags: ['Romantic', 'Ocean View', 'Adults Only'],
    isDeal: true,
    dealTag: 'Save 35%',
    dealType: 'small',
  },
  {
    id: 3,
    title: 'Coco Bodu Hithi',
    location: 'North Malé Atoll',
    country: 'MV',
    description:
      'Overwater villas on stilts above a protected lagoon, reached by a twenty-minute speedboat from Malé.\n\nThe house reef starts at the end of your deck ladder — reef sharks and turtles most mornings, no boat required.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Overwater Villa', 'Snorkeling', 'Private Deck', 'Spa', 'Fine Dining'],
    price: 1450,
    originalPrice: 2100,
    rating: 5.0,
    images: [img('1582719508461-905c673771fd'), img('1551882547-ff40c63fe5fa'), img('1502920917128-1aa500764cbd')],
    tags: ['Beachfront', 'Tropical', 'Diving'],
    isDeal: true,
    dealTag: 'Flash deal',
    dealType: 'small',
  },
  {
    id: 4,
    title: 'The Chedi Andermatt',
    location: 'Andermatt, Swiss Alps',
    country: 'CH',
    description:
      'Alpine-Asian design at 1,400 metres, with ski-in access to the Gemsstock and a 35-metre indoor pool under a glass roof.\n\nRate includes daily breakfast and one 60-minute massage per guest.',
    beds: '1 King, 1 Sofa Bed',
    capacity: 'Up to 3',
    amenities: ['Ski-in Access', 'Spa', 'Fireplace', 'Indoor Pool', 'Mountain View'],
    price: 1100,
    originalPrice: 1600,
    rating: 4.9,
    images: [img('1530122037265-a5f1f91d3b99'), img('1611892440504-42a792e24d32'), img('1444201983204-c43cbd584d93')],
    tags: ['Ski Resort', 'Mountain View', 'Spa'],
    isDeal: true,
    dealTag: 'Winter escape',
    dealType: 'medium',
  },
  {
    id: 5,
    title: 'Villa Amalfitana',
    location: 'Positano, Amalfi Coast',
    country: 'IT',
    description:
      'A restored cliffside villa on four levels, sleeping six across three bedrooms with a shared terrace over the bay.\n\nThe kitchen is fully equipped, and a local chef can be booked for dinner service with a day of notice.',
    beds: '2 Queen, 1 Twin',
    capacity: 'Up to 6',
    amenities: ['Ocean View', 'Terrace', 'Full Kitchen', 'Free Wi-Fi', 'Smart TV'],
    price: 950,
    rating: 4.7,
    images: [img('1520250497591-112f2f40a3f4'), img('1600585154340-be6161a56a0c'), img('1571003123894-1f0594d2b5d9')],
    tags: ['Family Friendly', 'Ocean View', 'Villa'],
  },
  {
    id: 6,
    title: 'Zermatt Timber Lodge',
    location: 'Zermatt, Valais',
    country: 'CH',
    description:
      'A century-old larch chalet a short walk from the Sunnegga funicular, with the Matterhorn framed in the living-room window.\n\nCar-free village; the lodge arranges electric taxi pickup from Täsch station.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Fireplace', 'Mini Bar', 'Mountain View', 'Ski Storage', 'Free Wi-Fi'],
    price: 620,
    rating: 4.8,
    images: [img('1444201983204-c43cbd584d93'), img('1611892440504-42a792e24d32'), img('1530122037265-a5f1f91d3b99')],
    tags: ['Ski-in', 'Fireplace', 'Mountain View'],
  },
  {
    id: 7,
    title: 'The Downtown Penthouse',
    location: 'Downtown, Dubai',
    country: 'AE',
    description:
      'Floor 58, with a wraparound terrace looking straight down the length of the Burj Khalifa.\n\nBuilding amenities include a rooftop infinity pool, a 24-hour gym and residents-only access to the observation deck.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['City View', 'Private Pool', 'Smart TV', 'Gym Access', 'Air Conditioning'],
    price: 1280,
    rating: 4.9,
    images: [img('1512453979798-5ea266f8880c'), img('1600585154340-be6161a56a0c'), img('1542314831-068cd1dbfeeb')],
    tags: ['City View', 'Pool', 'Business'],
  },
  {
    id: 8,
    title: 'Zen Garden Pavilion',
    location: 'Higashiyama, Kyoto',
    country: 'JP',
    description:
      'A machiya townhouse restored by a Kyoto carpentry studio, with tatami rooms opening onto a moss garden and a cedar soaking tub.\n\nWalking distance to Kiyomizu-dera; the host serves matcha on arrival.',
    beds: '2 Futon',
    capacity: 'Up to 4',
    amenities: ['Garden View', 'Soaking Tub', 'Free Wi-Fi', 'Breakfast Included'],
    price: 540,
    rating: 4.9,
    images: [img('1493976040374-85c8e12f0c0e'), img('1512917774080-9991f1c4c750'), img('1571003123894-1f0594d2b5d9')],
    tags: ['Cultural', 'Garden', 'Design'],
  },
  {
    id: 9,
    title: 'Casa del Mar',
    location: 'Tulum, Quintana Roo',
    country: 'MX',
    description:
      'A thatched beachfront casita on the quiet southern stretch of the Tulum hotel zone, twenty metres from the water.\n\nSolar powered and off-grid by design, so evenings are candlelit and the wifi is deliberately slow.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Beachfront', 'Ocean View', 'Outdoor Shower', 'Breakfast Included'],
    price: 460,
    rating: 4.6,
    images: [img('1551882547-ff40c63fe5fa'), img('1502920917128-1aa500764cbd'), img('1582719508461-905c673771fd')],
    tags: ['Beachfront', 'Eco', 'Tropical'],
  },
  {
    id: 10,
    title: 'Glenfinnan Highland Retreat',
    location: 'Glenfinnan, Scottish Highlands',
    country: 'GB',
    description:
      'A stone shooting lodge on forty private acres above Loch Shiel, with a wood-fired hot tub on the back terrace.\n\nStalking, fly fishing and a guided walk to the Glenfinnan viaduct can all be arranged through the estate.',
    beds: '3 Queen, 2 Twin',
    capacity: 'Up to 8',
    amenities: ['Fireplace', 'Hot Tub', 'Full Kitchen', 'Loch View', 'Pet Friendly'],
    price: 720,
    rating: 4.7,
    images: [img('1445019980597-93fa8acb246c'), img('1444201983204-c43cbd584d93'), img('1611892440504-42a792e24d32')],
    tags: ['Family Friendly', 'Countryside', 'Pet Friendly'],
  },
  {
    id: 11,
    title: 'Riad Dar Yasmine',
    location: 'Medina, Marrakech',
    country: 'MA',
    description:
      'Six rooms around a tiled courtyard with an orange tree and a cold plunge pool, hidden behind an unmarked door in the old medina.\n\nRooftop breakfast over the Koutoubia, and a hammam on the ground floor bookable by the hour.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Courtyard Pool', 'Hammam', 'Rooftop Terrace', 'Breakfast Included', 'Free Wi-Fi'],
    price: 320,
    rating: 4.8,
    images: [img('1540541338287-41700207dee6'), img('1596394516093-501ba68a0ba6'), img('1512917774080-9991f1c4c750')],
    tags: ['Cultural', 'Boutique', 'City Centre'],
  },
  {
    id: 12,
    title: 'Aspen Powder Lodge',
    location: 'Aspen, Colorado',
    country: 'US',
    description:
      'Ski-in, ski-out on Ajax with a boot-warming room, a double-height stone hearth and a chef-service option for groups.\n\nWalk to the Silver Queen gondola in under four minutes.',
    beds: '2 King, 1 Bunk',
    capacity: 'Up to 6',
    amenities: ['Ski-in Access', 'Fireplace', 'Hot Tub', 'Mountain View', 'Ski Storage'],
    price: 890,
    originalPrice: 1150,
    rating: 4.7,
    images: [img('1611892440504-42a792e24d32'), img('1530122037265-a5f1f91d3b99'), img('1444201983204-c43cbd584d93')],
    tags: ['Ski Resort', 'Family Friendly', 'Mountain View'],
    isDeal: true,
    dealTag: 'Early season',
    dealType: 'small',
  },
];

/** Hero image is `images[0]`, so the two can never drift apart. */
const initialDestinations = CATALOGUE.map(({ images, ...rest }) => ({
  ...rest,
  image: images[0],
  images,
  isDeal: rest.isDeal ?? false,
  reviews: [],
}));

/**
 * Seeds sample destinations.
 *
 * This previously ran `DestinationModel.deleteMany({})` followed by
 * `insertMany` on **every single server start** — so every restart silently
 * destroyed all user ratings and reset the catalogue, and any redeploy wiped
 * real data. It also unconditionally dropped a legacy `deals` collection.
 *
 * Now it is a no-op when the collection already holds data. Set
 * `SEED_FORCE=true` to deliberately reset (refused in production).
 */
export async function seedDatabase(): Promise<void> {
  if (!env.seedOnStart) {
    console.log('[seed] Skipped (SEED_ON_START=false).');
    return;
  }

  if (env.seedForce) {
    if (env.isProduction) {
      // A destructive reset in production is almost certainly a misconfiguration.
      console.error('[seed] Refusing to run SEED_FORCE in production. Aborting seed.');
      return;
    }
    console.warn('[seed] SEED_FORCE=true - replacing all destinations and their reviews.');
    await DestinationModel.deleteMany({});
  }

  const existing = await DestinationModel.countDocuments().exec();
  if (existing > 0) {
    console.log(`[seed] Skipped - ${existing} destinations already present.`);
    return;
  }

  await DestinationModel.insertMany(initialDestinations);
  console.log(`[seed] Inserted ${initialDestinations.length} sample destinations.`);
}
