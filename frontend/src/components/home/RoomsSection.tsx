import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../lib/useMousePosition';

import { useEffect, useState } from 'react';

interface Destination {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
}

export const RoomsSection = () => {
  const mouse = useMousePosition();
  const [rooms, setRooms] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explore')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching destinations:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-[80px] bg-surface-container-low text-center">
        <p className="font-body-lg text-on-surface-variant">Loading our rooms...</p>
      </section>
    );
  }

  return (
    <section className="py-[80px] bg-surface-container-low relative overflow-hidden">
      {/* Background Brush Stroke behind header */}
      <div 
        className="absolute top-[5%] left-[50%] -translate-x-1/2 w-[350px] h-[100px] pointer-events-none opacity-30 blur-[1px] transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate3d(${mouse.x * -8}px, ${mouse.y * -8}px, 0) rotate(${mouse.x * 1.5}deg)`,
        }}
      >
        <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/30 w-full h-full">
          <path d="M10,60 C120,20 280,100 390,40" stroke="currentColor" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30,75 C140,40 270,110 370,55" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-h2 text-headline-md text-on-surface mb-2">Our Rooms</h2>
            <p className="font-body-md text-on-surface-variant">Discover comfort and luxury.</p>
          </div>
          <a href="/rooms" className="hidden md:flex items-center gap-2 font-label-bold text-surface-tint hover:text-primary transition-colors">
            View All Rooms <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <motion.div 
              key={room.id} 
              className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-ambient-elevated transition-shadow group flex flex-col cursor-pointer"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="relative h-[240px] overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {room.rating >= 4.9 && (
                  <div className="absolute top-4 left-4 bg-primary text-on-primary font-label-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    POPULAR
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-h3 text-headline-sm text-on-surface mb-2">{room.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-6 min-h-[48px]">
                    Located in {room.location}. Featuring {room.tags.join(', ')}.
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-surface-variant">
                  <div className="font-label-bold text-on-surface text-lg">
                    ${room.price} <span className="font-body-md text-on-surface-variant text-sm font-normal">/ night</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-on-primary group-hover:scale-115 transition-all duration-300 cursor-pointer">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-8 md:hidden">
           <a href="/rooms" className="flex items-center justify-center gap-2 font-label-bold text-surface-tint hover:text-primary transition-colors">
            View All Rooms <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
