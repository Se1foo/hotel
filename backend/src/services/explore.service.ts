import type { Destination } from '../models/explore.model';

const destinations: Destination[] = [
  {
    id: 1,
    title: 'Amalfi Coast',
    location: 'Italy',
    price: 450,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbHMKCei7mmrOymzoIULhD05UHKO_4DpM4XcBDlpg-s00ajskPcLhK-nYpXRznEvjGxtsH54_fu7lXjRjZ4iLA75WyvdMc3NJKB2iTfKoW0tidFxpffazymEQbu4uiGBd3rE2_PPsb8Cbaih_cfkTkVFtDFMF82PMQMD5_9w2pzzOYVBF0IjpzBeCY6iuaW4ST63vSzXh4K3OfIeSzI31eQYHSTvJJnkWJVR4JkCGD4clVq2KYl31croSSEWRidxu0xrsjwpYsAviG',
    tags: ['Spa', 'Ocean View']
  },
  {
    id: 2,
    title: 'Zermatt Lodge',
    location: 'Switzerland',
    price: 620,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUfwWdKRvO1buZfglUVqQs8qSewU_ORIsLeKAYaxRVLNlzNxoXOXt9eAOkl3jPQ8o5b2xkPGBnZmKd7lCyz1Li_I5vbvNxAnkEHaQ1i0-bBYDzgBq4_fSlM7KEdsB7rMffutV3batXKJYYMYE0VktGvlZu5pJpVnGKra8faIVUn34oF4Y_os7kKTVs7IbMN08OxVs0M0_AKP0tU7EtYhC6o1aIQtLO3_t-VAPDPBBowv_h__Q9lXD9VnSq99CmfmTUKOyyDbhU2pF3',
    tags: ['Ski-in', 'Fireplace']
  },
  {
    id: 3,
    title: 'The Downtown',
    location: 'Dubai, UAE',
    price: 380,
    rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwMLTPEC-IZvKjPbnLWLnYboEqCaRy6hvvzMpD8z_nmkD9kIIEQkGIMBg7cXOi3XPevqfhRdD9Wt26XA4j_SzD3MTlmZLUs7oPwjklfK8Fx3nfYy6nmEabwZIdNjX17-OA7aQfoFccNM9pjT3oLv7KYOaVQy2uoDH0HXjO2TyWAPEoWz3ocGC3pGCqus_s5TlvitmaVKRtjOxgQYgf0JyI6vGfkV5xLGdZrxYy0GM_4A1F5SHI8VQtBYjPpuwzx_QfhRie8MMNB02',
    tags: ['City View', 'Pool']
  }
];

export function getDestinations(): Destination[] {
  return destinations;
}
