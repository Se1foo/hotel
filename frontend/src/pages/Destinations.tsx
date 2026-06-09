import { RoomsSection } from '../components/home/RoomsSection';
import { Calendar, User, Search } from 'lucide-react';

export default function DestinationsPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32">
      {/* Hero Header */}
      <div className="text-center px-5 md:px-[60px] pt-12 pb-16">
        <h1 className="text-[52px] md:text-[64px] font-extrabold text-[#1A1A1A] tracking-tight leading-[1.1]">
          Find Your <span className="text-[#8B6B10]">Escape</span>
        </h1>
        <p className="text-[#666666] text-[16px] md:text-[18px] mt-6 max-w-2xl mx-auto leading-relaxed">
          Secure your sanctuary. Select your dates and let us handle the rest with unparalleled luxury.
        </p>
      </div>

      {/* Search Widget */}
      <div className="max-w-[1000px] mx-auto px-5 md:px-[60px] relative z-20 mb-8 -mt-2">
        <div className="bg-white rounded-full shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-[#F0F0F0] flex flex-col md:flex-row items-center p-3 gap-2">
          
          {/* Check In */}
          <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-[#F0F0F0]">
            <Calendar className="w-5 h-5 text-[#4A4A4A]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">Check In</span>
              <span className="text-[#666666] text-[15px]">Add dates</span>
            </div>
          </div>

          {/* Check Out */}
          <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-[#F0F0F0]">
            <Calendar className="w-5 h-5 text-[#4A4A4A]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">Check Out</span>
              <span className="text-[#666666] text-[15px]">Add dates</span>
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full">
            <User className="w-5 h-5 text-[#4A4A4A]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">Guests</span>
              <span className="text-[#1A1A1A] font-medium text-[15px]">2 Adults</span>
            </div>
          </div>

          {/* Search Button */}
          <button className="w-full md:w-auto bg-[#8B6B10] text-white rounded-full px-8 py-4 flex items-center justify-center gap-2 font-bold hover:bg-[#70550B] transition-colors ml-2">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Reusing the styled Rooms Section directly below */}
      <div className="-mt-10">
        <RoomsSection />
      </div>
    </div>
  );
}
