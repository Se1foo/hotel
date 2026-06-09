import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Quote, Star, CheckCircle } from 'lucide-react';
import { useDeals } from '../lib/api';

export default function Deals() {
  const { data: deals = [], isLoading, isError, error } = useDeals();

  if (isLoading) {
    return (
      <main className="flex-grow w-full flex flex-col items-center justify-center min-h-[500px] bg-[#FAF9F6] pt-24">
        <div className="w-10 h-10 border-4 border-[#8B6B10] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[14px] font-bold text-gray-500 tracking-widest uppercase">Curating Deals...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-grow w-full flex flex-col items-center justify-center min-h-[500px] bg-[#FAF9F6] pt-24">
        <p className="text-2xl font-bold text-red-600 mb-2">Failed to load deals</p>
        <p className="text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </main>
    );
  }

  if (deals.length === 0) {
    return (
      <main className="flex-grow w-full flex items-center justify-center min-h-[500px] bg-[#FAF9F6] pt-24">
        <p className="text-xl font-medium text-gray-500">No exclusive escapes available at the moment.</p>
      </main>
    );
  }

  const featuredDeal = deals.find((d) => d.type === 'featured');
  const smallDeals = deals.filter((d) => d.type === 'small');
  const mediumDeal = deals.find((d) => d.type === 'medium');

  return (
    <main className="flex-grow w-full bg-[#FAF9F6] pt-32 pb-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 text-center pb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[48px] md:text-[56px] font-extrabold text-[#1A1A1A] tracking-tight leading-tight mb-6"
        >
          Exclusive <span className="text-[#8B6B10]">Escapes</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#666666] text-[18px] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Handpicked luxury deals for your next getaway. Uncover hidden gems and unparalleled experiences at exceptional value.
        </motion.p>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-[12px] font-bold tracking-widest uppercase px-6 py-3 bg-[#1A1A1A] text-white rounded-full transition-colors shadow-md">Last Minute</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-[12px] font-bold tracking-widest uppercase px-6 py-3 bg-white border border-[#EBEBEB] text-[#1A1A1A] rounded-full hover:border-[#8B6B10] transition-colors shadow-sm">Summer Specials</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-[12px] font-bold tracking-widest uppercase px-6 py-3 bg-white border border-[#EBEBEB] text-[#1A1A1A] rounded-full hover:border-[#8B6B10] transition-colors shadow-sm">Flash Deals</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-[12px] font-bold tracking-widest uppercase px-6 py-3 bg-white border border-[#EBEBEB] text-[#1A1A1A] rounded-full hover:border-[#8B6B10] transition-colors shadow-sm">Member Only</motion.button>
        </motion.div>
      </section>

      {/* Dynamic Grid Section */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[420px]">
          {/* Featured Large Card */}
          {featuredDeal && (
            <motion.article 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-8 rounded-3xl overflow-hidden group relative flex flex-col justify-end p-8 cursor-pointer shadow-lg"
            >
              <img alt={featuredDeal.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={featuredDeal.image}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="absolute top-6 left-6 bg-[#8B6B10] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-md z-10">
                {featuredDeal.tag}
              </div>
              
              <div className="relative z-10 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <p className="text-[13px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <MapPin className="w-4 h-4 text-[#8B6B10]" />
                      {featuredDeal.location}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{featuredDeal.title}</h3>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-white/60 line-through text-sm font-medium mb-1">${featuredDeal.originalPrice.toLocaleString()}/night</p>
                    <p className="text-3xl font-bold">${featuredDeal.price.toLocaleString()}<span className="text-lg font-normal text-white/80">/night</span></p>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* Small Cards */}
          {smallDeals.map((deal, idx) => (
            <motion.article 
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
              className="md:col-span-4 bg-white rounded-3xl border border-[#F0F0F0] overflow-hidden group flex flex-col cursor-pointer hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.05)] transition-all duration-300"
            >
              <div className="relative h-[220px] overflow-hidden">
                <img alt={deal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={deal.image}/>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                  {deal.tag}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[11px] font-bold text-[#8B6B10] uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {deal.location}
                </p>
                <h3 className="text-[20px] font-extrabold text-[#1A1A1A] tracking-tight mb-4 leading-tight">{deal.title}</h3>
                <div className="mt-auto pt-4 flex justify-between items-end border-t border-[#F0F0F0]">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-gray-400 line-through">${deal.originalPrice.toLocaleString()}</span>
                    <span className="text-[22px] font-bold text-[#1A1A1A]">${deal.price.toLocaleString()}<span className="text-[14px] font-normal text-gray-500">/n</span></span>
                  </div>
                  <button className="text-[14px] font-bold text-[#8B6B10] group-hover:text-[#1A1A1A] flex items-center gap-1.5 transition-colors">
                    View Deal
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}

          {/* Medium Card */}
          {mediumDeal && (
            <motion.article 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-8 bg-white rounded-3xl border border-[#F0F0F0] overflow-hidden group flex flex-col md:flex-row cursor-pointer hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.05)] transition-all duration-300"
            >
              <div className="relative w-full md:w-1/2 h-[240px] md:h-full overflow-hidden">
                <img alt={mediumDeal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={mediumDeal.image}/>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                <div className="absolute top-6 left-6 bg-[#8B6B10] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                  {mediumDeal.tag}
                </div>
              </div>
              <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
                <p className="text-[11px] font-bold text-[#8B6B10] uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {mediumDeal.location}
                </p>
                <h3 className="text-[24px] font-extrabold text-[#1A1A1A] tracking-tight mb-3">{mediumDeal.title}</h3>
                <p className="text-[#666666] text-[15px] leading-relaxed mb-6 line-clamp-3">
                  {mediumDeal.description}
                </p>
                <div className="mt-auto pt-6 flex justify-between items-end border-t border-[#F0F0F0]">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-gray-400 line-through">${mediumDeal.originalPrice.toLocaleString()}</span>
                    <span className="text-[28px] font-bold text-[#1A1A1A]">${mediumDeal.price.toLocaleString()}<span className="text-[15px] font-normal text-gray-500">/night</span></span>
                  </div>
                  <button className="text-[13px] font-bold tracking-widest uppercase px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#8B6B10] transition-colors flex items-center gap-2">
                    Book Now
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </section>

      {/* Featured Destination / Lifestyle Section */}
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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-all duration-700 group-hover:bg-black/60"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <span className="text-[12px] font-bold text-[#8B6B10] uppercase tracking-[0.2em] mb-4 block drop-shadow-md">Featured Destination</span>
          <h2 className="text-white text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-xl">The Amalfi Coast</h2>
          <p className="text-white/90 mb-8 text-lg md:text-xl drop-shadow-md leading-relaxed">
            Discover cliffside luxury and Mediterranean charm with our curated collection of Italian coastal retreats. Up to 40% off premium suites.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[14px] font-bold tracking-widest uppercase px-8 py-4 bg-white text-[#1A1A1A] rounded-full hover:text-[#8B6B10] transition-colors shadow-2xl flex items-center justify-center gap-2 mx-auto group/btn"
          >
            Explore Amalfi Deals
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </motion.button>
        </motion.div>
      </section>

      {/* Guest Stories */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-extrabold text-[#1A1A1A] tracking-tight mb-4">Traveler Stories</h2>
          <p className="text-[18px] text-[#666666]">Real experiences from our discerning guests.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-[#F0F0F0] relative pt-14 hover:-translate-y-2 hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.05)] transition-all duration-300"
          >
            <Quote className="absolute top-6 left-8 text-[#8B6B10]/20 w-10 h-10" />
            <div className="flex gap-1 mb-5 text-[#8B6B10]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-[#4A4A4A] text-[15px] leading-relaxed mb-8 italic">"The attention to detail at Aura Suites was impeccable. Booking through StayEase gave us a seamless VIP experience from start to finish."</p>
            <div className="flex items-center gap-4 mt-auto">
              <img alt="Sarah J." className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWqXxF10yVtQz9zt5NzpV0ksLh-AlFWB0wEwcGGfN_VAKJ67ajdWoycXdzgS22aA4hnQxohe-qCr-CfnLjyMxP6mn2zKhIhtuCXSba6fK2kD6T0QA9eENsjhqW2YwyYKzAO4vOsxvi133p098Gai-_421cq5uDq7Wwhh3POMTC6pLpDDR1aUrDq_q6Au4iDs9kJIScmC__9womTYAim5z9V-RaHV8rjTNykAo0gcTpJojwJtkPXDgvMkKqPeg2KNM6X85b1YDVOCf5"/>
              <div>
                <p className="text-[14px] font-extrabold text-[#1A1A1A]">Sarah J.</p>
                <p className="text-[12px] font-medium text-gray-500">Stayed at Aura Suites</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-[#F0F0F0] relative pt-14 hover:-translate-y-2 hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.05)] transition-all duration-300"
          >
            <Quote className="absolute top-6 left-8 text-[#8B6B10]/20 w-10 h-10" />
            <div className="flex gap-1 mb-5 text-[#8B6B10]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-[#4A4A4A] text-[15px] leading-relaxed mb-8 italic">"Finding such an exclusive deal for The Chedi was a dream. The booking process was effortless and the price genuinely couldn't be beaten."</p>
            <div className="flex items-center gap-4 mt-auto">
              <img alt="Michael T." className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQHacJh1-p8dAdmUlE5v_zv27K1t1MlQkJY45a4hInklHpIqsmh1ez36AZRoJWcAJHjFpbiqSJBnTz1WfnXpiOy5GsJgoUAcpyR1cAzuKZ7Uwu-iPP3mIvsqK04R67BJr3bMhsQf5jAEt9aldTZDQCLUwRPL8hzwGWTWfii1uXI1twyCgcX8fMtlNPQ9WsvK3uXvUgc_C7Ifds8N5GaAAJ35EaXVPZpM5bkvgY6REVUs-hHTTryg5K2qSww_jWI94yY8HmnD0MzIQr"/>
              <div>
                <p className="text-[14px] font-extrabold text-[#1A1A1A]">Michael T.</p>
                <p className="text-[12px] font-medium text-gray-500">Stayed at The Chedi</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-[#F0F0F0] relative pt-14 hover:-translate-y-2 hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.05)] transition-all duration-300"
          >
            <Quote className="absolute top-6 left-8 text-[#8B6B10]/20 w-10 h-10" />
            <div className="flex gap-1 mb-5 text-[#8B6B10]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-[#4A4A4A] text-[15px] leading-relaxed mb-8 italic">"The flash deal alert saved us over $2000 on our Maldives honeymoon. StayEase is now my go-to for luxury travel booking."</p>
            <div className="flex items-center gap-4 mt-auto">
              <img alt="Elena R." className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbO5vDpW5MvnpQy7f_Nx17nqmIb6GeKRSRKwHGY2guNTxM44O0KEY3W2wUhEuoNTH4TS5e3pPaaT-Uo37nZRLos1hf6SLXKBYnNslJMVxtmkhKUaSdcgaEnfcq2GERSxcEbBdnR6stOdzS8sfQUgZ_qMfR5Ze43YlOa-noLrMQ8lg5w8qWiEgMO6yNEuvdGkGuGJq5zffm7NvWZm2LNLnH5l4_E3vHUguGsEKd7vQ7T9eApsWbEyg8hE_CybZ96e8SZSxWrTYh8ig3"/>
              <div>
                <p className="text-[14px] font-extrabold text-[#1A1A1A]">Elena R.</p>
                <p className="text-[12px] font-medium text-gray-500">Stayed at Coco Bodu Hithi</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1A1A] rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl"
        >
          {/* Abstract background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10">
            <CheckCircle className="w-14 h-14 text-[#8B6B10] mb-6 block mx-auto" />
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Best Price Guarantee</h2>
            <p className="text-gray-300 text-[16px] max-w-2xl mx-auto mb-8 leading-relaxed">
              If you find a lower price on another website, we'll match it and give you an additional 10% off. Book directly with absolute confidence.
            </p>
            <button className="text-[12px] font-bold tracking-widest text-[#8B6B10] uppercase hover:text-white transition-colors border-b-2 border-[#8B6B10] pb-1 hover:border-white flex items-center justify-center gap-2 mx-auto group">
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
