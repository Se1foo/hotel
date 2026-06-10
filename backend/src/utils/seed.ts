import { DestinationModel } from '../models/explore.model';

const initialDestinations = [
  // Original Deals converted to Destinations
  {
    id: 101, // Adjusted IDs so they don't clash
    title: 'Viceroy Bali Luxury Resort',
    location: 'Ubud, Bali',
    description: 'Experience pure luxury in the heart of Bali with private pool villas and world-class dining.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Private Pool', 'Spa', 'Free Wi-Fi'],
    rating: 5.0,
    originalPrice: 1800,
    price: 1250,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaLP227AGZW2E3Pp7jwBBCUbBcbliZyqs3LwwaqkBA1kf4aS2O5zg7-3TMrFEp6NZXYjh9mmDX7KDjKfc62rc-hPGUxwxnNHkFtAf9s1OMf_utZdsio_y9wpPBvM1diZZaZ6yfO3W09YQaRCt-3Nk5SCH4xk2SUxpy3UrysJt23eK6xYuwCfHz7UdoBixG7XEUaDJPMWBErMF78Ixb1X1XBy9pCydS6AcYfwd4T3ZoDyNvlzC_XASMHkp6gpAjpckWiAlAGjwjTXLs',
    tags: ['Luxury', 'Resort'],
    isDeal: true,
    dealTag: 'Top Pick',
    dealType: 'featured',
  },
  {
    id: 102,
    title: 'Aura Suites',
    location: 'Santorini, Greece',
    description: 'Breathtaking caldera views from your private terrace. A perfect romantic getaway.',
    beds: '1 Queen',
    capacity: 'Up to 2',
    amenities: ['Ocean View', 'Balcony', 'Breakfast Included'],
    rating: 4.8,
    originalPrice: 1200,
    price: 780,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWkmvep8j9PtpsJ38xYfcvQ3ZVGWc9SgKQTVJRP8Su47falc6Hcu-ccqFB7LKxnCLIip6HE1qv73w5v2jQzNXxXGvtN-RA6iM_9YGa9z_3TCB7PWm6obiQqCtyDnqHcx-N6L6Q7nz5qtAOX_Wb1ykyUyihortQkI76VZA6ifm6Sf6hAzUYclWaDZG0D9op6xTLirT5DErSF2sWWDbtvGY2qvub5J3KIrgKd_k9yxjW4lEPPsmbZziS5lw341csXVxS0i5yxLjlsIcU',
    tags: ['Romantic', 'Ocean View'],
    isDeal: true,
    dealTag: 'Save 35%',
    dealType: 'small',
  },
  {
    id: 103,
    title: 'Coco Bodu Hithi',
    location: 'Maldives',
    description: 'Overwater villas surrounded by crystal clear lagoons. The ultimate tropical escape.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Overwater Villa', 'Snorkeling', 'Private Deck'],
    rating: 4.9,
    originalPrice: 2100,
    price: 1450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWoaw2MxH4yyUrW4TMotsxLeDBxp21VJPXthmlubbwD-LJ3iKF8eG7nrae90uWD9vKMnWT3HnpHUCO4HRjxzbWlMHZGiOp2C1KTh7AvrmNK_2Z3M_KrkV4JCx6MTuAzyrnXsyosXdl5zS-TQyVix7LSuQ73EGA_hK0J1fR3b6Cpq7rlLgoTpWSKiZH28V7Qomt34hP5KFD4tIHhycuzjr9m_Ihp_vJqNMEt2vTHNMqFjfUn1kIpesPg6lolZxwX806YTebn5U47pTO',
    tags: ['Beachfront', 'Tropical'],
    isDeal: true,
    dealTag: 'Flash Deal',
    dealType: 'small',
  },
  {
    id: 104,
    title: 'The Chedi Andermatt',
    location: 'Swiss Alps, Switzerland',
    description: 'Experience unparalleled alpine luxury with exclusive access to premium ski slopes and world-class spa facilities. Includes daily breakfast and one massage.',
    beds: '1 King, 1 Sofa Bed',
    capacity: 'Up to 3',
    amenities: ['Ski-in', 'Spa', 'Fireplace'],
    rating: 4.9,
    originalPrice: 1600,
    price: 1100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPTO_482M6QwYIY9u_ji_KpjqMY2xYGwU5m---wEbUFK7E-GYOzk-pcIyuPFj2XJUaUGlvvUc3oqqixgckHzZVtL9aOD6PNH1G6H2f36XCmoW9VEibnI-ZlDo0P2z3synlyp-EEvOdHROMxiMZnMeVm344ZHa-E0FUFyvoqo5mZfjcOi9974wjskpVNAb64-BVZAJ5fiQEvLcLddRKiGOFH87CaxRunT3LYyU67qE7XQlgtDUxcDLFeGjCUphiP_2jLdeInK-CIr2G',
    tags: ['Ski Resort', 'Mountain View'],
    isDeal: true,
    dealTag: 'Winter Escape',
    dealType: 'medium',
  },
  
  // Original Destinations
  {
    id: 1,
    title: 'Family Executive',
    location: 'Italy',
    description: 'Spacious and accommodating, designed perfectly for families needing extra room and supreme comfort during their stay.',
    beds: '2 Queen',
    capacity: 'Up to 4',
    amenities: ['Smart TV', 'Free Wi-Fi'],
    price: 650,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbHMKCei7mmrOymzoIULhD05UHKO_4DpM4XcBDlpg-s00ajskPcLhK-nYpXRznEvjGxtsH54_fu7lXjRjZ4iLA75WyvdMc3NJKB2iTfKoW0tidFxpffazymEQbu4uiGBd3rE2_PPsb8Cbaih_cfkTkVFtDFMF82PMQMD5_9w2pzzOYVBF0IjpzBeCY6iuaW4ST63vSzXh4K3OfIeSzI31eQYHSTvJJnkWJVR4JkCGD4clVq2KYl31croSSEWRidxu0xrsjwpYsAviG',
    tags: ['Spa', 'Ocean View'],
    isDeal: false,
  },
  {
    id: 2,
    title: 'Zermatt Lodge',
    location: 'Switzerland',
    description: 'A cozy alpine retreat featuring a warm fireplace and stunning mountain views right from your private balcony.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['Fireplace', 'Mini Bar'],
    price: 620,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUfwWdKRvO1buZfglUVqQs8qSewU_ORIsLeKAYaxRVLNlzNxoXOXt9eAOkl3jPQ8o5b2xkPGBnZmKd7lCyz1Li_I5vbvNxAnkEHaQ1i0-bBYDzgBq4_fSlM7KEdsB7rMffutV3batXKJYYMYE0VktGvlZu5pJpVnGKra8faIVUn34oF4Y_os7kKTVs7IbMN08OxVs0M0_AKP0tU7EtYhC6o1aIQtLO3_t-VAPDPBBowv_h__Q9lXD9VnSq99CmfmTUKOyyDbhU2pF3',
    tags: ['Ski-in', 'Fireplace'],
    isDeal: false,
  },
  {
    id: 3,
    title: 'The Downtown Penthouse',
    location: 'Dubai, UAE',
    description: 'Experience urban luxury with a panoramic city view, private pool access, and unparalleled modern amenities.',
    beds: '1 King',
    capacity: 'Up to 2',
    amenities: ['City View', 'Private Pool', 'Smart TV'],
    price: 1280,
    rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwMLTPEC-IZvKjPbnLWLnYboEqCaRy6hvvzMpD8z_nmkD9kIIEQkGIMBg7cXOi3XPevqfhRdD9Wt26XA4j_SzD3MTlmZLUs7oPwjklfK8Fx3nfYy6nmEabwZIdNjX17-OA7aQfoFccNM9pjT3oLv7KYOaVQy2uoDH0HXjO2TyWAPEoWz3ocGC3pGCqus_s5TlvitmaVKRtjOxgQYgf0JyI6vGfkV5xLGdZrxYy0GM_4A1F5SHI8VQtBYjPpuwzx_QfhRie8MMNB02',
    tags: ['City View', 'Pool'],
    isDeal: false,
  }
];

export async function seedDatabase(): Promise<void> {
  try {
    // Clear deals collection just in case it exists, but don't error if model is gone
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.collection('deals').drop();
      console.log('Dropped legacy Deals collection.');
    } catch (e) {
      // Collection might not exist
    }

    await DestinationModel.deleteMany({});
    await DestinationModel.insertMany(initialDestinations);
    console.log('Seeded Destinations collection (including deals).');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
