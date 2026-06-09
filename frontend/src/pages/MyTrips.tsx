import { useState } from 'react';
import { Calendar, List, MapPin, ArrowRight, Clock, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/auth/AuthContext';
import { useTrips } from '../lib/api';
import { Link } from 'react-router-dom';

export default function MyTripsPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'itinerary'>('itinerary');
  const { isAuthenticated } = useAuth();
  const { data: upcomingTrips = [], isLoading } = useTrips(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-16 flex flex-col items-center">
        <LogIn className="w-16 h-16 text-[#8B6B10] mb-6" />
        <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-4">Log in to view your trips</h2>
        <p className="text-[#666666] mb-8">You need an account to manage your itineraries and bookings.</p>
        <Link to="/login" className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full font-bold hover:bg-[#8B6B10] transition-colors">
          Log In or Sign Up
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8B6B10] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#666666] font-bold">Loading your trips...</p>
      </div>
    );
  }

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
              {upcomingTrips.map((trip) => (
                <div key={trip._id} className="bg-white rounded-2xl p-4 md:p-6 border border-[#F0F0F0] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group">
                  
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
                      <p className="text-[#666666] text-[14px] mt-1">Reservation #{trip.tripId}</p>
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
                  const firstTrip = upcomingTrips[0];
                  const isTripStart = firstTrip?.startDay === day;
                  const isTripEnd = firstTrip?.endDay === day;
                  const isTripMiddle = firstTrip && day > firstTrip.startDay && day < firstTrip.endDay;
                  
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
                          {upcomingTrips[0]?.destination}
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
