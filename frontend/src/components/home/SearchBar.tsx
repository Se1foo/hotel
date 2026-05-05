import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

export const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('2 Adults, 1 Room');

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-20 max-w-[1000px] mx-auto px-6 -mt-[80px]"
    >
      <div className="bg-surface rounded-xl shadow-[0_12px_32px_rgba(4,22,39,0.08)] p-6 md:p-8 flex flex-col md:flex-row items-end gap-6 md:gap-4 lg:gap-6">
        
        <div className="w-full md:w-1/3">
          <label htmlFor="location-input" className="block font-label-caps text-xs md:text-label-caps text-on-surface-variant mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" aria-hidden="true" />
            <input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-md pl-10 pr-4 min-h-[44px] py-3 font-body-md text-base md:text-body-md text-on-surface placeholder:text-on-surface-variant/70 transition-colors outline-none" 
              placeholder="Where are you going?" type="text" id="location-input" autoComplete="off" />
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <label htmlFor="dates-input" className="block font-label-caps text-xs md:text-label-caps text-on-surface-variant mb-2">Dates</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" aria-hidden="true" />
            <input 
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-md pl-10 pr-4 min-h-[44px] py-3 font-body-md text-base md:text-body-md text-on-surface placeholder:text-on-surface-variant/70 transition-colors outline-none" 
              placeholder="Check-in & Check-out" type="text" id="dates-input" autoComplete="off" />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="guests-select" className="block font-label-caps text-xs md:text-label-caps text-on-surface-variant mb-2">Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" aria-hidden="true" />
            <select id="guests-select" value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-md pl-10 pr-8 min-h-[44px] py-3 font-body-md text-base md:text-body-md text-on-surface appearance-none transition-colors outline-none cursor-pointer"
            >
              <option>2 Adults, 1 Room</option>
              <option>1 Adult, 1 Room</option>
              <option>Family (4)</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-auto mt-2 md:mt-0">
          <button className="w-full md:w-auto min-h-[44px] min-w-[44px] bg-primary text-on-primary font-body-md text-body-md px-8 py-3 rounded-lg hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] transition-[background-color,transform,box-shadow] duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(4,22,39,0.15)]">
            <Search className="w-5 h-5" aria-hidden="true" />
            Search
          </button>
        </div>
        
      </div>
    </motion.section>
  );
};
