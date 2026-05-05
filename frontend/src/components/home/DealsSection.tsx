import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Quote, Star, CheckCircle } from 'lucide-react';

// Types for the deals
type Deal = {
  id: number;
  title: string;
  location: string;
  originalPrice: number;
  price: number;
  image: string;
  tag: string;
  type: 'featured' | 'small' | 'medium';
  description?: string;
};

let cachedDeals: Deal[] | null = null;

export const DealsSection = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cachedDeals) {
      setDeals(cachedDeals);
      setLoading(false);
      return;
    }
    fetch('http://localhost:5000/api/deals')
      .then((res) => res.json())
      .then((data) => {
        setDeals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch deals:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="deals" className="pt-20 max-w-[1200px] mx-auto px-6 md:px-12 py-24 text-center min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </section>
    );
  }

  // Group deals for grid layout
  const featuredDeal = deals.find(d => d.type === 'featured');
  const smallDeals = deals.filter(d => d.type === 'small');
  const mediumDeal = deals.find(d => d.type === 'medium');

  return (
    <section id="deals" className="pt-20 pb-24">
      {/* Intro Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-12 md:pt-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-h1 text-4xl md:text-5xl text-primary mb-6"
        >
          Exclusive Escapes
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto mb-12"
        >
          Handpicked luxury deals for your next getaway. Uncover hidden gems and unparalleled luxury.
        </motion.p>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {['Last Minute', 'Summer Specials', 'Flash Deals', 'Member Only'].map((filter, i) => (
            <motion.button 
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`font-label-caps text-xs tracking-widest px-6 py-3 rounded-full shadow-sm transition-colors ${i === 0 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface hover:bg-surface-variant'}`}
            >
              {filter.toUpperCase()}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[400px]">
          
          {/* Featured Deal */}
          {featuredDeal && (
            <motion.article 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(4, 22, 39, 0.12)' }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient-elevated border border-outline-variant/30 overflow-hidden group relative flex flex-col justify-end p-8"
            >
              <img alt={featuredDeal.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={featuredDeal.image}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-6 left-6 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-xs tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md z-10">
                {featuredDeal.tag}
              </div>
              
              <div className="relative z-10 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-body-md flex items-center gap-1 mb-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      {featuredDeal.location}
                    </p>
                    <h3 className="font-h2 text-3xl font-medium mb-2">{featuredDeal.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md text-white/70 line-through text-sm mb-1">${featuredDeal.originalPrice.toLocaleString()}/night</p>
                    <p className="font-h3 text-2xl font-semibold">${featuredDeal.price.toLocaleString()}<span className="text-lg font-normal text-white/80">/night</span></p>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* Small Deals */}
          {smallDeals.map((deal, index) => (
            <motion.article 
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(4, 22, 39, 0.12)' }}
              className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient-elevated border border-outline-variant/30 overflow-hidden group flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img alt={deal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={deal.image}/>
                <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-caps text-xs tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md">
                  {deal.tag}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-xl text-primary mb-1">{deal.title}</h3>
                <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4" />
                  {deal.location}
                </p>
                <div className="mt-auto pt-4 flex justify-between items-end border-t border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="font-body-md text-xs text-on-surface-variant line-through decoration-outline">${deal.originalPrice.toLocaleString()}</span>
                    <span className="font-h3 text-xl text-primary">${deal.price.toLocaleString()}<span className="font-body-md text-sm text-on-surface-variant">/n</span></span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-body-md text-sm text-primary font-medium hover:text-secondary"
                  >
                    View Deal
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}

          {/* Medium Deal */}
          {mediumDeal && (
            <motion.article 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(4, 22, 39, 0.12)' }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient-elevated border border-outline-variant/30 overflow-hidden group flex flex-col md:flex-row"
            >
              <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
                <img alt={mediumDeal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={mediumDeal.image}/>
                <div className="absolute top-4 left-4 bg-primary text-white font-label-caps text-xs tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md">
                  {mediumDeal.tag}
                </div>
              </div>
              <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
                <h3 className="font-h3 text-2xl text-primary mb-2">{mediumDeal.title}</h3>
                <p className="font-body-md text-on-surface-variant flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4" />
                  {mediumDeal.location}
                </p>
                <p className="font-body-md text-on-surface-variant mb-6 line-clamp-3">{mediumDeal.description}</p>
                <div className="mt-auto pt-6 flex justify-between items-end border-t border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="font-body-md text-sm text-on-surface-variant line-through decoration-outline">${mediumDeal.originalPrice.toLocaleString()}</span>
                    <span className="font-h3 text-2xl text-primary">${mediumDeal.price.toLocaleString()}<span className="font-body-md text-sm text-on-surface-variant">/night</span></span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-body-md px-6 py-2 bg-primary text-on-primary rounded hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.article>
          )}

        </div>
      </div>
    

      {/* Featured Destination */}
      <section className="relative w-full h-[600px] flex items-center justify-center mb-24 overflow-hidden group">
        <motion.img 
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.05 }}
          transition={{ duration: 10, ease: "linear" }}
          viewport={{ once: false }}
          alt="Amalfi Coast" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBCCGpkA_InLa3R5wsfU_LX15rwJKZ37axve-Xamd-zJiOIzV5pOcpXPXhAsoCu6KlsM2PHZtGMNGB3Gz8eYqsbvU-dnQ3FykmA6MXItCQsyFnln5wXreJ9CUSjq5stpMuBLziDiAp63f1iYpkOGEsmCBSDjhGYEh1wfV_8yQxj4-TMELwJCIobK5cPliRSODTGJdwCysLcFf8yjgIlPiBEQLRIRKTNBQkBca_bM-9rGBxfpQPGrJD9AXoIQmvikEdFBao8i35Udm_"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-700 group-hover:bg-black/70"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <span className="font-label-caps text-yellow-400 tracking-widest mb-4 block drop-shadow-lg opacity-90">Featured Destination</span>
          <h2 className="font-h1 text-white text-5xl md:text-6xl mb-6 drop-shadow-2xl font-bold">The Amalfi Coast</h2>
          <p className="font-body-lg text-white mb-8 text-lg md:text-xl drop-shadow-lg opacity-95">Discover cliffside luxury and Mediterranean charm with our curated collection of Italian coastal retreats. Up to 40% off premium suites.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-body-md px-8 py-4 bg-white text-primary rounded-full hover:bg-gray-100 transition-colors shadow-2xl font-medium text-lg flex items-center justify-center gap-2 mx-auto group/btn"
          >
            Explore Amalfi Deals
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>

      {/* Guest Stories */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-24">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-h2 text-h2 text-primary mb-4"
          >
            Traveler Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body-lg text-on-surface-variant"
          >
            Real experiences from our discerning guests.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              text: "The attention to detail at Aura Suites was impeccable. Booking through StayEase gave us a seamless VIP experience from start to finish.",
              name: "Sarah J.", location: "Stayed at Aura Suites",
              avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWqXxF10yVtQz9zt5NzpV0ksLh-AlFWB0wEwcGGfN_VAKJ67ajdWoycXdzgS22aA4hnQxohe-qCr-CfnLjyMxP6mn2zKhIhtuCXSba6fK2kD6T0QA9eENsjhqW2YwyYKzAO4vOsxvi133p098Gai-_421cq5uDq7Wwhh3POMTC6pLpDDR1aUrDq_q6Au4iDs9kJIScmC__9womTYAim5z9V-RaHV8rjTNykAo0gcTpJojwJtkPXDgvMkKqPeg2KNM6X85b1YDVOCf5"
            },
            {
              text: "Finding such an exclusive deal for The Chedi was a dream. The booking process was effortless and the price genuinely couldn't be beaten.",
              name: "Michael T.", location: "Stayed at The Chedi",
              avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQHacJh1-p8dAdmUlE5v_zv27K1t1MlQkJY45a4hInklHpIqsmh1ez36AZRoJWcAJHjFpbiqSJBnTz1WfnXpiOy5GsJgoUAcpyR1cAzuKZ7Uwu-iPP3mIvsqK04R67BJr3bMhsQf5jAEt9aldTZDQCLUwRPL8hzwGWTWfii1uXI1twyCgcX8fMtlNPQ9WsvK3uXvUgc_C7Ifds8N5GaAAJ35EaXVPZpM5bkvgY6REVUs-hHTTryg5K2qSww_jWI94yY8HmnD0MzIQr"
            },
            {
              text: "The flash deal alert saved us over $2000 on our Maldives honeymoon. StayEase is now my go-to for luxury travel.",
              name: "Elena R.", location: "Stayed at Coco Bodu Hithi",
              avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbO5vDpW5MvnpQy7f_Nx17nqmIb6GeKRSRKwHGY2guNTxM44O0KEY3W2wUhEuoNTH4TS5e3pPaaT-Uo37nZRLos1hf6SLXKBYnNslJMVxtmkhKUaSdcgaEnfcq2GERSxcEbBdnR6stOdzS8sfQUgZ_qMfR5Ze43YlOa-noLrMQ8lg5w8qWiEgMO6yNEuvdGkGuGJq5zffm7NvWZm2LNLnH5l4_E3vHUguGsEKd7vQ7T9eApsWbEyg8hE_CybZ96e8SZSxWrTYh8ig3"
            }
          ].map((story, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }}
              className="bg-surface rounded-xl p-8 border border-outline-variant/20 shadow-sm relative pt-12"
            >
              <Quote className="absolute top-6 left-8 text-secondary/30 w-9 h-9" />
              <div className="flex gap-1 mb-4 text-secondary">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4.5 h-4.5 fill-current" />
                ))}
              </div>
              <p className="font-body-md text-on-surface mb-6 italic">"{story.text}"</p>
              <div className="flex items-center gap-4">
                <img alt={story.name} className="w-12 h-12 rounded-full object-cover border-2 border-surface-container" src={story.avatar}/>
                <div>
                  <p className="font-h3 text-sm font-semibold text-primary">{story.name}</p>
                  <p className="font-body-md text-xs text-on-surface-variant">{story.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-ambient-floating"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10">
            <CheckCircle className="w-12 h-12 text-secondary-fixed mb-6 block mx-auto" />
            <h2 className="font-h2 text-h2 text-white mb-4">Best Price Guarantee</h2>
            <p className="font-body-lg text-white/80 max-w-2xl mx-auto mb-8">
              If you find a lower price on another website, we'll match it and give you an additional 10% off. Book directly with absolute confidence.
            </p>
            <button className="font-label-caps tracking-widest text-secondary-fixed uppercase hover:text-white transition-colors border-b border-secondary-fixed pb-1 hover:border-white">Learn More</button>
          </div>
        </motion.div>
      </section>
</section>
  );
};
