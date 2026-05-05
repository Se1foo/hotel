import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Quote, Star, CheckCircle } from 'lucide-react';

export default function Deals() {
  return (
    <main className="flex-grow w-full">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-h1 text-h1 text-primary mb-6"
        >
          Exclusive Escapes
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12"
        >
          Handpicked luxury deals for your next getaway. Uncover hidden gems and unparalleled luxury.
        </motion.p>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="font-label-caps text-label-caps px-6 py-3 bg-secondary-fixed text-on-secondary-fixed rounded-full transition-colors shadow-sm">Last Minute</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="font-label-caps text-label-caps px-6 py-3 bg-surface-container text-on-surface rounded-full hover:bg-surface-variant transition-colors shadow-sm">Summer Specials</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="font-label-caps text-label-caps px-6 py-3 bg-surface-container text-on-surface rounded-full hover:bg-surface-variant transition-colors shadow-sm">Flash Deals</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="font-label-caps text-label-caps px-6 py-3 bg-surface-container text-on-surface rounded-full hover:bg-surface-variant transition-colors shadow-sm">Member Only</motion.button>
        </motion.div>
      </section>

      {/* Dynamic Grid Section */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[400px]">
          {/* Featured Large Card */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient-elevated hover:shadow-ambient-floating border border-outline-variant/30 overflow-hidden group relative flex flex-col justify-end p-8 cursor-pointer transition-shadow"
          >
            <img alt="Luxury villa in Bali" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaLP227AGZW2E3Pp7jwBBCUbBcbliZyqs3LwwaqkBA1kf4aS2O5zg7-3TMrFEp6NZXYjh9mmDX7KDjKfc62rc-hPGUxwxnNHkFtAf9s1OMf_utZdsio_y9wpPBvM1diZZaZ6yfO3W09YQaRCt-3Nk5SCH4xk2SUxpy3UrysJt23eK6xYuwCfHz7UdoBixG7XEUaDJPMWBErMF78Ixb1X1XBy9pCydS6AcYfwd4T3ZoDyNvlzC_XASMHkp6gpAjpckWiAlAGjwjTXLs"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute top-6 left-6 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps px-3 py-1.5 rounded-full shadow-md z-10">
              Top Pick
            </div>
            
            <div className="relative z-10 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-body-md flex items-center gap-1 mb-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    Ubud, Bali
                  </p>
                  <h3 className="font-h2 text-3xl font-medium mb-2">Viceroy Bali Luxury Resort</h3>
                </div>
                <div className="text-right">
                  <p className="font-body-md text-white/70 line-through text-sm mb-1">$1,800/night</p>
                  <p className="font-h3 text-2xl font-semibold">$1,250<span className="text-lg font-normal text-white/80">/night</span></p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Small Card 1 */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient-elevated hover:shadow-ambient-floating border border-outline-variant/30 overflow-hidden group flex flex-col cursor-pointer transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <img alt="Santorini view" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWkmvep8j9PtpsJ38xYfcvQ3ZVGWc9SgKQTVJRP8Su47falc6Hcu-ccqFB7LKxnCLIip6HE1qv73w5v2jQzNXxXGvtN-RA6iM_9YGa9z_3TCB7PWm6obiQqCtyDnqHcx-N6L6Q7nz5qtAOX_Wb1ykyUyihortQkI76VZA6ifm6Sf6hAzUYclWaDZG0D9op6xTLirT5DErSF2sWWDbtvGY2qvub5J3KIrgKd_k9yxjW4lEPPsmbZziS5lw341csXVxS0i5yxLjlsIcU"/>
              <div className="absolute top-4 left-4 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps px-3 py-1.5 rounded-full shadow-md">
                Save 35%
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-h3 text-xl text-primary mb-1">Aura Suites</h3>
              <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" />
                Santorini, Greece
              </p>
              <div className="mt-auto pt-4 flex justify-between items-end border-t border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-body-md text-xs text-on-surface-variant line-through decoration-outline">$1,200</span>
                  <span className="font-h3 text-xl text-primary">$780<span className="font-body-md text-sm text-on-surface-variant">/n</span></span>
                </div>
                <button className="font-body-md text-sm text-primary font-medium group-hover:text-secondary flex items-center gap-1 transition-colors">
                  View Deal
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.article>

          {/* Small Card 2 */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient-elevated hover:shadow-ambient-floating border border-outline-variant/30 overflow-hidden group flex flex-col cursor-pointer transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <img alt="Maldives water villa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWoaw2MxH4yyUrW4TMotsxLeDBxp21VJPXthmlubbwD-LJ3iKF8eG7nrae90uWD9vKMnWT3HnpHUCO4HRjxzbWlMHZGiOp2C1KTh7AvrmNK_2Z3M_KrkV4JCx6MTuAzyrnXsyosXdl5zS-TQyVix7LSuQ73EGA_hK0J1fR3b6Cpq7rlLgoTpWSKiZH28V7Qomt34hP5KFD4tIHhycuzjr9m_Ihp_vJqNMEt2vTHNMqFjfUn1kIpesPg6lolZxwX806YTebn5U47pTO"/>
              <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-caps text-label-caps px-3 py-1.5 rounded-full shadow-md">
                Flash Deal
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-h3 text-xl text-primary mb-1">Coco Bodu Hithi</h3>
              <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" />
                Maldives
              </p>
              <div className="mt-auto pt-4 flex justify-between items-end border-t border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-body-md text-xs text-on-surface-variant line-through decoration-outline">$2,100</span>
                  <span className="font-h3 text-xl text-primary">$1,450<span className="font-body-md text-sm text-on-surface-variant">/n</span></span>
                </div>
                <button className="font-body-md text-sm text-primary font-medium group-hover:text-secondary flex items-center gap-1 transition-colors">
                  View Deal
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.article>

          {/* Medium Card */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient-elevated hover:shadow-ambient-floating border border-outline-variant/30 overflow-hidden group flex flex-col md:flex-row cursor-pointer transition-shadow"
          >
            <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
              <img alt="Swiss Alps Chalet" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPTO_482M6QwYIY9u_ji_KpjqMY2xYGwU5m---wEbUFK7E-GYOzk-pcIyuPFj2XJUaUGlvvUc3oqqixgckHzZVtL9aOD6PNH1G6H2f36XCmoW9VEibnI-ZlDo0P2z3synlyp-EEvOdHROMxiMZnMeVm344ZHa-E0FUFyvoqo5mZfjcOi9974wjskpVNAb64-BVZAJ5fiQEvLcLddRKiGOFH87CaxRunT3LYyU67qE7XQlgtDUxcDLFeGjCUphiP_2jLdeInK-CIr2G"/>
              <div className="absolute top-4 left-4 bg-primary text-white font-label-caps text-label-caps px-3 py-1.5 rounded-full shadow-md">
                Winter Escape
              </div>
            </div>
            <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
              <h3 className="font-h3 text-2xl text-primary mb-2">The Chedi Andermatt</h3>
              <p className="font-body-md text-on-surface-variant flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4" />
                Swiss Alps, Switzerland
              </p>
              <p className="font-body-md text-on-surface-variant mb-6 line-clamp-3">Experience unparalleled alpine luxury with exclusive access to premium ski slopes and world-class spa facilities. Includes daily breakfast and one massage.</p>
              <div className="mt-auto pt-6 flex justify-between items-end border-t border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-body-md text-sm text-on-surface-variant line-through decoration-outline">$1,600</span>
                  <span className="font-h3 text-2xl text-primary">$1,100<span className="font-body-md text-sm text-on-surface-variant">/night</span></span>
                </div>
                <button className="font-body-md px-6 py-2 bg-primary text-on-primary rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Book Now
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.article>
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
          <h2 className="font-h2 text-h2 text-primary mb-4">Traveler Stories</h2>
          <p className="font-body-lg text-on-surface-variant">Real experiences from our discerning guests.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface rounded-xl p-8 border border-outline-variant/20 shadow-sm relative pt-12 hover:-translate-y-2 hover:shadow-ambient-elevated transition-all duration-300"
          >
            <Quote className="absolute top-6 left-8 text-secondary/30 w-9 h-9" />
            <div className="flex gap-1 mb-4 text-secondary">
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
            </div>
            <p className="font-body-md text-on-surface mb-6 italic">"The attention to detail at Aura Suites was impeccable. Booking through StayEase gave us a seamless VIP experience from start to finish."</p>
            <div className="flex items-center gap-4">
              <img alt="Sarah J." className="w-12 h-12 rounded-full object-cover border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWqXxF10yVtQz9zt5NzpV0ksLh-AlFWB0wEwcGGfN_VAKJ67ajdWoycXdzgS22aA4hnQxohe-qCr-CfnLjyMxP6mn2zKhIhtuCXSba6fK2kD6T0QA9eENsjhqW2YwyYKzAO4vOsxvi133p098Gai-_421cq5uDq7Wwhh3POMTC6pLpDDR1aUrDq_q6Au4iDs9kJIScmC__9womTYAim5z9V-RaHV8rjTNykAo0gcTpJojwJtkPXDgvMkKqPeg2KNM6X85b1YDVOCf5"/>
              <div>
                <p className="font-h3 text-sm font-semibold text-primary">Sarah J.</p>
                <p className="font-body-md text-xs text-on-surface-variant">Stayed at Aura Suites</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface rounded-xl p-8 border border-outline-variant/20 shadow-sm relative pt-12 hover:-translate-y-2 hover:shadow-ambient-elevated transition-all duration-300"
          >
            <Quote className="absolute top-6 left-8 text-secondary/30 w-9 h-9" />
            <div className="flex gap-1 mb-4 text-secondary">
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
            </div>
            <p className="font-body-md text-on-surface mb-6 italic">"Finding such an exclusive deal for The Chedi was a dream. The booking process was effortless and the price genuinely couldn't be beaten."</p>
            <div className="flex items-center gap-4">
              <img alt="Michael T." className="w-12 h-12 rounded-full object-cover border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQHacJh1-p8dAdmUlE5v_zv27K1t1MlQkJY45a4hInklHpIqsmh1ez36AZRoJWcAJHjFpbiqSJBnTz1WfnXpiOy5GsJgoUAcpyR1cAzuKZ7Uwu-iPP3mIvsqK04R67BJr3bMhsQf5jAEt9aldTZDQCLUwRPL8hzwGWTWfii1uXI1twyCgcX8fMtlNPQ9WsvK3uXvUgc_C7Ifds8N5GaAAJ35EaXVPZpM5bkvgY6REVUs-hHTTryg5K2qSww_jWI94yY8HmnD0MzIQr"/>
              <div>
                <p className="font-h3 text-sm font-semibold text-primary">Michael T.</p>
                <p className="font-body-md text-xs text-on-surface-variant">Stayed at The Chedi</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-surface rounded-xl p-8 border border-outline-variant/20 shadow-sm relative pt-12 hover:-translate-y-2 hover:shadow-ambient-elevated transition-all duration-300"
          >
            <Quote className="absolute top-6 left-8 text-secondary/30 w-9 h-9" />
            <div className="flex gap-1 mb-4 text-secondary">
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
              <Star className="w-4.5 h-4.5 fill-current" />
            </div>
            <p className="font-body-md text-on-surface mb-6 italic">"The flash deal alert saved us over $2000 on our Maldives honeymoon. StayEase is now my go-to for luxury travel."</p>
            <div className="flex items-center gap-4">
              <img alt="Elena R." className="w-12 h-12 rounded-full object-cover border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbO5vDpW5MvnpQy7f_Nx17nqmIb6GeKRSRKwHGY2guNTxM44O0KEY3W2wUhEuoNTH4TS5e3pPaaT-Uo37nZRLos1hf6SLXKBYnNslJMVxtmkhKUaSdcgaEnfcq2GERSxcEbBdnR6stOdzS8sfQUgZ_qMfR5Ze43YlOa-noLrMQ8lg5w8qWiEgMO6yNEuvdGkGuGJq5zffm7NvWZm2LNLnH5l4_E3vHUguGsEKd7vQ7T9eApsWbEyg8hE_CybZ96e8SZSxWrTYh8ig3"/>
              <div>
                <p className="font-h3 text-sm font-semibold text-primary">Elena R.</p>
                <p className="font-body-md text-xs text-on-surface-variant">Stayed at Coco Bodu Hithi</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section - Integrated */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-ambient-floating hover:shadow-ambient-elevated transition-shadow duration-500"
        >
          {/* Abstract background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10">
            <CheckCircle className="w-12 h-12 text-secondary-fixed mb-6 block mx-auto" aria-hidden="true" />
            <h2 className="font-h2 text-h2 text-white mb-4">Best Price Guarantee</h2>
            <p className="font-body-lg text-white/80 max-w-2xl mx-auto mb-8">
              If you find a lower price on another website, we'll match it and give you an additional 10% off. Book directly with absolute confidence.
            </p>
            <button className="font-label-caps tracking-widest text-secondary-fixed uppercase hover:text-white transition-colors border-b border-secondary-fixed pb-1 hover:border-white flex items-center justify-center gap-2 mx-auto group">
              Learn More
              <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
