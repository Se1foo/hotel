import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Users, BedDouble, Wifi, Tv, Flame, Building2, Calendar, CheckCircle } from 'lucide-react';
import { useDestination, useRateDestination } from '../lib/api';
import { useAuth } from '../components/auth/AuthContext';
import api from '../lib/axios';

const getAmenityIcon = (amenity: string) => {
  const normalized = amenity.toLowerCase();
  if (normalized.includes('tv')) return <Tv className="w-5 h-5" />;
  if (normalized.includes('wi-fi') || normalized.includes('wifi')) return <Wifi className="w-5 h-5" />;
  if (normalized.includes('fire')) return <Flame className="w-5 h-5" />;
  if (normalized.includes('city') || normalized.includes('view') || normalized.includes('pool')) return <Building2 className="w-5 h-5" />;
  return <CheckCircle className="w-5 h-5" />;
};

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: destination, isLoading, isError } = useDestination(id);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [hoverRating, setHoverRating] = useState<number>(0);
  const rateMutation = useRateDestination();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center pt-32">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#8B6B10] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (isError || !destination) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Destination Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-[#8B6B10] font-semibold hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      await api.post('/trips', {
        tripId: `TRP-${Math.floor(Math.random() * 100000)}`,
        destinationId: destination.id,
        destination: destination.location,
        title: destination.title,
        checkIn: checkIn || new Date().toISOString(),
        checkOut: checkOut || new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
        guests: '2 Adults',
        status: 'Processing',
        image: destination.image,
        startDay: -1,
        endDay: -1,
      });
      navigate('/trips');
    } catch (error: any) {
      setBookingError(error.response?.data?.error || 'Failed to book the trip.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Image Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-gray-200">
        <img 
          src={destination.image} 
          alt={destination.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-28 left-5 md:left-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] relative -mt-20 md:-mt-32 z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_-6px_rgba(0,0,0,0.03)] border border-[#F0F0F0]"
          >
            {/* Header Group */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-[#8B6B10] mb-3 font-bold text-[12px] uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.location}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
                  {destination.title}
                </h1>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FAF9F6] border border-[#EBEBEB] text-[#1A1A1A] font-semibold text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-[#E1A624] text-[#E1A624]" /> 
                      {destination.rating} {destination.userRatings?.length ? `(${destination.userRatings.length} reviews)` : ''}
                    </div>
                    {destination.tags?.map((tag, idx) => (
                      <div key={idx} className="bg-[#FAF9F6] border border-[#EBEBEB] text-[#666666] font-medium text-sm px-4 py-1.5 rounded-full">
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* Interactive Rating Component */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm font-medium text-gray-500 mr-2">Rate this destination:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login', { state: { from: location } });
                            return;
                          }
                          if (id) {
                            rateMutation.mutate({ id, rating: star });
                          }
                        }}
                        disabled={rateMutation.isPending}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-6 h-6 transition-colors ${
                            star <= hoverRating 
                              ? 'fill-[#E1A624] text-[#E1A624]' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </button>
                    ))}
                    {rateMutation.isPending && <span className="ml-2 text-xs text-gray-400">Saving...</span>}
                    {rateMutation.isSuccess && <span className="ml-2 text-xs text-green-600 font-medium">Saved!</span>}
                    {rateMutation.isError && (
                      <span className="ml-2 text-xs text-red-500 font-medium">
                        {(rateMutation.error as any)?.response?.data?.error || 'Error saving rating'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#F0F0F0] my-8" />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm mb-1">Guests</span>
                <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold">
                  <Users className="w-5 h-5 text-[#8B6B10]" /> {destination.capacity}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm mb-1">Beds</span>
                <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold">
                  <BedDouble className="w-5 h-5 text-[#8B6B10]" /> {destination.beds}
                </div>
              </div>
            </div>

            <hr className="border-[#F0F0F0] my-8" />

            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">About this place</h3>
              <p className="text-[#666666] leading-relaxed whitespace-pre-line text-lg">
                {destination.description}
              </p>
            </div>

            <hr className="border-[#F0F0F0] my-8" />

            {/* Amenities */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {destination.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[#1A1A1A] font-medium">
                    <div className="text-[#8B6B10]">{getAmenityIcon(amenity)}</div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Sticky Booking Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-[400px] lg:sticky lg:top-32"
          >
            <div className="bg-white rounded-3xl p-8 shadow-[0_12px_40px_-6px_rgba(0,0,0,0.06)] border border-[#F0F0F0]">
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-[#1A1A1A]">${destination.price}</span>
                <span className="text-[#666666] font-medium">/ night</span>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] font-medium"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] font-medium"
                    />
                  </div>
                </div>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
                  {bookingError}
                </div>
              )}

              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-[#1A1A1A] text-white font-bold py-4 rounded-2xl hover:bg-[#8B6B10] transition-colors flex items-center justify-center shadow-md disabled:opacity-75"
              >
                {isBooking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Reserve Now'
                )}
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">You won't be charged yet</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
