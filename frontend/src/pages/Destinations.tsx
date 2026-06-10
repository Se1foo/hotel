import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RoomsSection } from '../components/home/RoomsSection';
import { Calendar, User, Search, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// MUI Imports
import { Popover } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B6B10', // Match the gold website design
    },
    text: {
      primary: '#1A1A1A',
    }
  },
  typography: {
    fontFamily: '"Geist", "Inter", sans-serif',
  },
});

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for the inputs
  const [location, setLocation] = useState(searchParams.get('location') || '');
  
  const initialCheckIn = searchParams.get('checkIn') ? parseISO(searchParams.get('checkIn')!) : null;
  const initialCheckOut = searchParams.get('checkOut') ? parseISO(searchParams.get('checkOut')!) : null;
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
  
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  // Popover anchors
  const [checkInAnchor, setCheckInAnchor] = useState<HTMLDivElement | null>(null);
  const [checkOutAnchor, setCheckOutAnchor] = useState<HTMLDivElement | null>(null);
  const [guestsAnchor, setGuestsAnchor] = useState<HTMLDivElement | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    if (guests) params.set('guests', guests);
    setSearchParams(params);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <div className="max-w-[1200px] mx-auto px-5 md:px-[60px] relative z-20 mb-8 -mt-2">
            <div className="bg-white rounded-3xl md:rounded-full shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-[#F0F0F0] flex flex-col md:flex-row items-center p-3 gap-2">
              
              {/* Location */}
              <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-[#F0F0F0]">
                <MapPin className="w-5 h-5 text-[#4A4A4A] shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Location</span>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where to?" 
                    className="w-full bg-transparent outline-none text-[#1A1A1A] font-medium text-[15px] placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Check In */}
              <div 
                className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-[#F0F0F0] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={(e) => setCheckInAnchor(e.currentTarget)}
              >
                <Calendar className="w-5 h-5 text-[#4A4A4A] shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Check In</span>
                  <span className={`text-[15px] font-medium ${checkIn ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                    {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Add dates'}
                  </span>
                </div>
              </div>
              <Popover
                open={Boolean(checkInAnchor)}
                anchorEl={checkInAnchor}
                onClose={() => setCheckInAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: { borderRadius: '16px', mt: 1, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }
                }}
              >
                <DateCalendar 
                  value={checkIn} 
                  onChange={(newValue) => {
                    setCheckIn(newValue);
                    if (newValue && checkOut && newValue > checkOut) {
                      setCheckOut(null);
                    }
                    setCheckInAnchor(null);
                  }} 
                  minDate={new Date()}
                />
              </Popover>

              {/* Check Out */}
              <div 
                className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-[#F0F0F0] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={(e) => setCheckOutAnchor(e.currentTarget)}
              >
                <Calendar className="w-5 h-5 text-[#4A4A4A] shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Check Out</span>
                  <span className={`text-[15px] font-medium ${checkOut ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                    {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Add dates'}
                  </span>
                </div>
              </div>
              <Popover
                open={Boolean(checkOutAnchor)}
                anchorEl={checkOutAnchor}
                onClose={() => setCheckOutAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: { borderRadius: '16px', mt: 1, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }
                }}
              >
                <DateCalendar 
                  value={checkOut} 
                  onChange={(newValue) => {
                    setCheckOut(newValue);
                    setCheckOutAnchor(null);
                  }} 
                  minDate={checkIn || new Date()}
                />
              </Popover>

              {/* Guests */}
              <div 
                className="flex-1 flex items-center gap-4 px-6 py-3 w-full cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={(e) => setGuestsAnchor(e.currentTarget)}
              >
                <User className="w-5 h-5 text-[#4A4A4A] shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Guests</span>
                  <span className="text-[15px] font-medium text-[#1A1A1A]">
                    {guests} {guests === '1' ? 'Guest' : 'Guests'}
                  </span>
                </div>
              </div>
              <Popover
                open={Boolean(guestsAnchor)}
                anchorEl={guestsAnchor}
                onClose={() => setGuestsAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: { borderRadius: '16px', mt: 1, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', minWidth: '200px' }
                }}
              >
                <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      onClick={() => { setGuests(num.toString()); setGuestsAnchor(null); }}
                      className={`px-5 py-3 text-left text-[15px] hover:bg-gray-50 transition-colors ${guests === num.toString() ? 'font-bold text-[#8B6B10] bg-[#FAF9F6]' : 'text-[#1A1A1A]'}`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </Popover>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="w-full md:w-auto bg-[#1A1A1A] text-white rounded-full px-8 py-4 flex items-center justify-center gap-2 font-bold hover:bg-[#8B6B10] transition-colors ml-2 mt-2 md:mt-0"
              >
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
      </LocalizationProvider>
    </ThemeProvider>
  );
}
