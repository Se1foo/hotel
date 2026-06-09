import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDestinations } from '../../lib/api';
import { RoomCard } from '../ui/RoomCard';

export const RoomsSection = () => {
  const { data: rooms = [], isLoading, isError, error } = useDestinations();

  if (isLoading) {
    return (
      <section className="py-[80px] bg-surface-container-low text-center flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-body-lg text-on-surface-variant">Loading our rooms...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-[80px] bg-surface-container-low text-center flex flex-col items-center">
        <p className="font-h3 text-error mb-2">Failed to load rooms</p>
        <p className="font-body-md text-on-surface-variant">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </section>
    );
  }

  if (rooms.length === 0) {
    return (
      <section className="py-[80px] bg-surface-container-low text-center">
        <p className="font-body-lg text-on-surface-variant">No rooms available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-[100px] bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[32px] md:text-[36px] font-bold text-[#1A1A1A]">Available Accommodations</h2>
          <div className="hidden md:flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-[#D1D1D1] flex items-center justify-center text-[#1A1A1A] hover:bg-black hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center hover:bg-black transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-8 md:hidden">
           <Link to="/rooms" className="flex items-center justify-center gap-2 font-label-bold text-surface-tint hover:text-primary transition-colors">
            View All Rooms <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
