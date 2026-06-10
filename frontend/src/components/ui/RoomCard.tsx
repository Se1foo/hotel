import { ArrowRight, BedDouble, Users, Tv, Wifi, Flame, Building2, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Destination } from '../../types';

interface RoomCardProps {
  room: Destination;
}

const getAmenityIcon = (amenity: string) => {
  const normalized = amenity.toLowerCase();
  if (normalized.includes('tv')) return <Tv className="w-4 h-4 text-[#4A4A4A]" />;
  if (normalized.includes('wi-fi') || normalized.includes('wifi')) return <Wifi className="w-4 h-4 text-[#4A4A4A]" />;
  if (normalized.includes('fire')) return <Flame className="w-4 h-4 text-[#4A4A4A]" />;
  if (normalized.includes('city') || normalized.includes('view') || normalized.includes('pool')) return <Building2 className="w-4 h-4 text-[#4A4A4A]" />;
  return <BedDouble className="w-4 h-4 text-[#4A4A4A]" />;
};

export const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col border border-[#F0F0F0] hover:-translate-y-1">
      <div className="relative h-[240px] overflow-hidden bg-gray-100">
        <img 
          src={room.image} 
          alt={room.title} 
          className="w-full h-full object-cover"
        />
        {room.rating >= 4.9 && room.price < 1000 && (
          <div className="absolute top-4 left-4 bg-white/95 text-[#1A1A1A] font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#E1A624] text-[#E1A624]" /> {room.rating}
          </div>
        )}
        {room.isDeal && room.dealTag && (
          <div className="absolute top-4 right-4 bg-[#1A1A1A] text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm">
            {room.dealTag}
          </div>
        )}
        {room.price >= 1000 && !room.isDeal && (
          <div className="absolute top-4 left-4 bg-[#8B6B10] text-white font-semibold text-xs px-3 py-1 rounded shadow-sm">
            Premium
          </div>
        )}
      </div>

      <div className="p-6 md:p-7 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-[#8B6B10] mb-2 font-bold text-[11px] uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>{room.location}</span>
          </div>
          <h3 className="text-[22px] font-bold text-[#1A1A1A] mb-2 tracking-tight">{room.title}</h3>
          <p className="text-[#666666] mb-6 leading-relaxed line-clamp-2 min-h-[48px] text-[15px] font-normal">
            {room.description}
          </p>

          {/* Features Row */}
          <div className="flex flex-wrap items-center gap-5 mb-6 text-[#666666] text-[13px] font-medium">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-[#4A4A4A]" />
              <span>{room.beds}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#4A4A4A]" />
              <span>{room.capacity}</span>
            </div>
            {room.amenities.slice(0, 1).map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-[#F0F0F0]">
          <div className="flex flex-col">
            {room.isDeal && room.originalPrice && (
              <span className="text-[13px] font-medium text-gray-400 line-through">${room.originalPrice.toLocaleString()}</span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-[#1A1A1A]">${room.price.toLocaleString()}</span>
              <span className="text-[#666666] text-[13px] font-medium">/night</span>
            </div>
          </div>
          <Link 
            to={`/destination/${room.id}`}
            className="flex items-center gap-1.5 font-bold text-[#8B6B10] hover:text-[#70550B] transition-colors group/link text-[14px]"
          >
            Select Room 
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
