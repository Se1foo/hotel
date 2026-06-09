import { useState } from 'react';
import { Calendar, List, MapPin, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const UPCOMING_TRIPS = [
  {
    id: 'TRP-10492',
    destination: 'Swiss Alps',
    title: 'Alpine Escape Suite',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    guests: '2 Adults',
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800',
    startDay: 12, // simple mock for calendar
    endDay: 18,
  },
  {
    id: 'TRP-88312',
    destination: 'Kyoto, Japan',
    title: 'Zen Garden Pavilion',
    checkIn: 'Nov 05, 2026',
    checkOut: 'Nov 12, 2026',
    guests: '2 Adults',
    status: 'Processing',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    startDay: -1, // out of current month
    endDay: -1,
  }
];

export default function MyTripsPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'itinerary'>('itinerary');

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-16">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px]">
        
        {/* Header & Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[40px] md:text-[52px] font-extrabold text-[#1A1A1A] tracking-tight leading-[1.1]">
              My <span className="text-[#8B6B10]">Trips</span>
            </h1>
            <p className="text-[#666666] text-[16px] md:text-[18px] mt-4 max-w-2xl leading-relaxed">
              Manage your upcoming stays, view past itineraries, and discover your next great escape.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-white border border-[#F0F0F0] rounded-full shadow-sm w-fit relative z-0">
            <button
              onClick={() => setViewMode('itinerary')}
              className={`relative px-6 py-2.5 rounded-full flex items-center gap-2 font-bold text-[14px] transition-colors z-10 ${
                viewMode === 'itinerary' ? 'text-white' : 'text-[#666666] hover:text-[#1A1A1A]'
              }`}
            >
              {viewMode === 'itinerary' && (
                <motion.div
                  layoutId="tripToggleBg"
                  className="absolute inset-0 bg-[#8B6B10] rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <List className="w-4 h-4" />
              Itinerary
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`relative px-6 py-2.5 rounded-full flex items-center gap-2 font-bold text-[14px] transition-colors z-10 ${
                viewMode === 'calendar' ? 'text-white' : 'text-[#666666] hover:text-[#1A1A1A]'
              }`}
            >
              {viewMode === 'calendar' && (
                <motion.div
                  layoutId="tripToggleBg"
                  className="absolute inset-0 bg-[#8B6B10] rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
          </div>
        </div>

        {/* View Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'itinerary' ? (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {UPCOMING_TRIPS.map((trip) => (
                <div key={trip.id} className="bg-white rounded-2xl p-4 md:p-6 border border-[#F0F0F0] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group">
                  
                  {/* Thumbnail */}
                  <div className="w-full md:w-[240px] h-[160px] rounded-xl overflow-hidden shrink-0 relative">
                    <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/95 text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                      {trip.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#8B6B10] mb-1.5 font-bold text-[11px] uppercase tracking-widest">
                        <MapPin className="w-3 h-3" />
                        <span>{trip.destination}</span>
                      </div>
                      <h3 className="text-[22px] font-bold text-[#1A1A1A] tracking-tight">{trip.title}</h3>
                      <p className="text-[#666666] text-[14px] mt-1">Reservation #{trip.id}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#F0F0F0]">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Check In</span>
                        <span className="text-[#666666] text-[14px] font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {trip.checkIn}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Check Out</span>
                        <span className="text-[#666666] text-[14px] font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {trip.checkOut}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Guests</span>
                        <span className="text-[#666666] text-[14px] font-medium">{trip.guests}</span>
                      </div>
                      <div className="ml-auto">
                        <button className="flex items-center gap-1.5 font-bold text-[#8B6B10] hover:text-[#70550B] transition-colors text-[14px]">
                          Manage Trip <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[20px] font-bold text-[#1A1A1A]">October 2026</h3>
                <div className="flex gap-2">
                  <button className="p-2 border border-[#F0F0F0] rounded-full hover:bg-[#F5F3F3] transition-colors">&larr;</button>
                  <button className="p-2 border border-[#F0F0F0] rounded-full hover:bg-[#F5F3F3] transition-colors">&rarr;</button>
                </div>
              </div>

              {/* Simple Tailwind Grid Calendar */}
              <div className="grid grid-cols-7 gap-px bg-[#F0F0F0] border border-[#F0F0F0] rounded-xl overflow-hidden">
                {/* Days of Week */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-white p-3 text-center text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for start offset */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white/50 h-[100px] md:h-[120px] p-2 text-[#CCCCCC] text-[14px] font-medium text-right">
                    {27 + i}
                  </div>
                ))}

                {/* Days of Month */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isTripStart = UPCOMING_TRIPS[0].startDay === day;
                  const isTripEnd = UPCOMING_TRIPS[0].endDay === day;
                  const isTripMiddle = day > UPCOMING_TRIPS[0].startDay && day < UPCOMING_TRIPS[0].endDay;
                  
                  return (
                    <div 
                      key={day} 
                      className={`h-[100px] md:h-[120px] p-2 text-right relative transition-colors ${
                        isTripStart || isTripEnd || isTripMiddle ? 'bg-[#8B6B10]/10' : 'bg-white hover:bg-[#F5F3F3]'
                      }`}
                    >
                      <span className={`text-[14px] font-medium w-7 h-7 flex items-center justify-center rounded-full ml-auto ${
                        isTripStart ? 'bg-[#8B6B10] text-white' : 'text-[#1A1A1A]'
                      }`}>
                        {day}
                      </span>
                      
                      {isTripStart && (
                        <div className="absolute bottom-2 left-2 right-2 bg-[#8B6B10] text-white text-[10px] font-bold px-2 py-1.5 rounded truncate shadow-sm">
                          {UPCOMING_TRIPS[0].destination}
                        </div>
                      )}
                      {(isTripMiddle || isTripEnd) && (
                        <div className="absolute bottom-2 left-0 right-0 h-6 bg-[#8B6B10]/20" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
