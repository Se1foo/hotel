import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const destinations = [
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

export const TrendingGrid = () => {
  return (
    <section className="max-w-container-max mx-auto px-6 pb-section-padding pt-16">
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-h2 text-balance text-h2 text-on-surface mb-12 text-center"
      >
        Trending Destinations
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-card-gap">
        {destinations.map((dest, index) => (
          <motion.article 
            key={dest.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            className="bg-surface rounded-xl shadow-[0_4px_16px_rgba(4,22,39,0.05)] border border-surface-variant/30 overflow-hidden group cursor-pointer hover:shadow-[0_20px_40px_rgba(4,22,39,0.12)] transition-shadow duration-500"
          >
            <div className="relative h-64 overflow-hidden">
              <motion.img 
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                alt={dest.title} 
                className="w-full h-full object-cover" 
                src={dest.image} 
                loading="lazy" 
              />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-secondary fill-secondary" aria-hidden="true" />
                <span className="font-label-caps text-label-caps text-on-surface">{dest.rating}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-h3 text-h3 text-on-surface">{dest.title}</h3>
                <div className="text-right">
                  <span className="block font-label-caps text-label-caps text-on-surface-variant">From</span>
                  <span className="font-body-lg text-body-lg font-medium text-primary">
                    ${dest.price}<span className="text-sm font-normal text-on-surface-variant">/nt</span>
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">{dest.location}</p>
              <div className="flex gap-2">
                {dest.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-secondary-container/30 hover:bg-secondary-container/50 text-primary font-label-caps text-label-caps uppercase rounded-full px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
