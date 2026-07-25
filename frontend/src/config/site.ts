/**
 * Single source of truth for brand + contact details.
 *
 * The codebase previously carried three different brand names ("HOTEL.",
 * "Luxe Reserve", "StayEase") across the navbar, footer, logo and testimonial
 * copy. Everything now reads from here.
 */
export const site = {
  name: 'Luxe Reserve',
  tagline: 'Curated stays, effortlessly booked',
  description:
    'Luxe Reserve curates a collection of exceptional hotels, villas and lodges worldwide — with transparent pricing, instant confirmation and a best-price guarantee.',
  contact: {
    email: 'reservations@luxereserve.com',
    phone: '+1 (800) 123-4567',
    phoneHref: '+18001234567',
    address: '123 Luxury Ave, Beverly Hills, CA 90210',
  },
} as const;

export interface NavLink {
  name: string;
  path: string;
  /** Hidden from signed-out visitors, since the route is protected anyway. */
  requiresAuth?: boolean;
}

export const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Deals', path: '/deals' },
  { name: 'Saved', path: '/saved', requiresAuth: true },
  { name: 'My Trips', path: '/trips', requiresAuth: true },
  { name: 'Contact', path: '/contact' },
];

/** Footer navigation never advertises routes that would bounce to /login. */
export const publicNavLinks = navLinks.filter((link) => !link.requiresAuth);
