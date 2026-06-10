import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDestinations } from '../../lib/api';
import { RoomCard } from '../ui/RoomCard';
import { useMemo } from 'react';

export const RoomsSection = () => {
  const { data: rooms = [], isLoading, isError, error } = useDestinations();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Filter by location
      const locationSearch = searchParams.get('location')?.toLowerCase() || '';
      if (locationSearch && !room.location.toLowerCase().includes(locationSearch) && !room.title.toLowerCase().includes(locationSearch)) {
        return false;
      }
      
      // Filter by guests (capacity)
      const guestsSearch = searchParams.get('guests');
      if (guestsSearch) {
        // Extract the number from strings like "Up to 4"
        const capacityMatch = room.capacity.match(/\d+/);
        const capacityNumber = capacityMatch ? parseInt(capacityMatch[0]) : 0;
        
        if (capacityNumber < parseInt(guestsSearch)) {
          return false;
        }
      }
      
      return true;
    });
  }, [rooms, searchParams]);

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
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Pill outline on the right edge */}
        <div className="absolute top-[20%] right-[-30px] w-24 h-9 border-2 border-gray-200 rounded-full opacity-70"></div>
        
        {/* Pencil squiggle middle left */}
        <div className="absolute top-[60%] left-[2%]">
          <svg className="w-20 h-14 text-gray-200 opacity-60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10,25 Q20,10 35,30 T60,20 T80,40 T95,15" />
          </svg>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[32px] md:text-[36px] font-bold text-[#1A1A1A]">Available Accommodations</h2>
          <div className="hidden md:flex items-center gap-4">
            <span className="font-bold text-[#1A1A1A] tracking-widest uppercase text-sm">Explore More</span>
            <button 
              onClick={() => navigate('/destinations')}
              className="w-10 h-10 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="inline-block p-6 bg-white rounded-2xl shadow-sm border border-[#F0F0F0]">
                <p className="text-xl font-bold text-[#1A1A1A] mb-2">No matches found</p>
                <p className="text-[#666666]">Try adjusting your search criteria or dates to see more availability.</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Link */}
        <div className="mt-8 md:hidden">
           <Link to="/destinations" className="flex items-center justify-center gap-2 font-label-bold text-surface-tint hover:text-primary transition-colors">
            Explore More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
