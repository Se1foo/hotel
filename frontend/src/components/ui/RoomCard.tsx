import { ArrowRight, BedDouble, MapPin, MessageSquare, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Destination } from '../../types';
import { formatPrice } from '../../lib/format';
import { AmenityIcon } from './AmenityIcon';
import { Badge } from './Badge';
import { SmartImage } from './SmartImage';
import { FavoriteButton } from './FavoriteButton';

interface RoomCardProps {
  room: Destination;
  /** Set on the first row of cards so they aren't lazy-loaded below the fold. */
  priority?: boolean;
}

/** Percentage off, shared with the deals page so the two can't disagree. */
function discountPercent(room: Destination): number | null {
  if (!room.originalPrice || room.originalPrice <= room.price) return null;
  return Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100);
}

export function RoomCard({ room, priority = false }: RoomCardProps) {
  const discount = discountPercent(room);

  return (
    <article className="relative bg-surface border border-line rounded-panel overflow-hidden shadow-card flex flex-col h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 focus-within:shadow-card-hover group">
      <div className="relative">
        <SmartImage
          src={room.image}
          alt={`${room.title} in ${room.location}`}
          priority={priority}
          width={800}
          height={600}
          wrapperClassName="h-[240px]"
          className="transition-transform duration-700 group-hover:scale-105"
        />

        {/* The old rules were arbitrary — a rating badge only appeared when
            `rating >= 4.9 && price < 1000`, so a 5.0-rated premium suite showed
            no rating at all. Rating is now always shown. */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          <Badge tone="light" size="sm">
            <Star className="w-3 h-3 fill-star text-star" aria-hidden="true" />
            {room.rating > 0 ? room.rating.toFixed(1) : 'New'}
          </Badge>
          {discount && (
            <Badge tone="gold" size="sm">
              −{discount}%
            </Badge>
          )}
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          {room.isDeal && room.dealTag ? (
            <Badge tone="ink" size="sm">
              {room.dealTag}
            </Badge>
          ) : room.price >= 1000 ? (
            <Badge tone="ink" size="sm">
              Premium
            </Badge>
          ) : null}
          <FavoriteButton destinationId={room.id} title={room.title} />
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <p className="flex items-center gap-1.5 text-eyebrow uppercase text-gold mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {room.location}
        </p>

        <h3 className="text-xl text-ink mb-2">
          <Link to={`/destination/${room.id}`} className="hover:text-gold transition-colors">
            {room.title}
            {/* Stretches the link over the card, so the whole surface is
                clickable without an onClick handler on a non-interactive
                element. The favourite button sits above it via z-index. */}
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </h3>

        <p className="text-ink-muted text-[15px] leading-relaxed line-clamp-2 mb-5">
          {room.description}
        </p>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-muted text-[13px] font-medium mb-6">
          <li className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-ink-subtle shrink-0" aria-hidden="true" />
            {room.beds}
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-ink-subtle shrink-0" aria-hidden="true" />
            {room.capacity}
          </li>
          {room.reviews.length > 0 && (
            <li className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-ink-subtle shrink-0" aria-hidden="true" />
              {room.reviews.length}
            </li>
          )}
          {room.amenities.slice(0, 1).map((amenity) => (
            <li key={amenity} className="flex items-center gap-1.5">
              <AmenityIcon amenity={amenity} className="w-4 h-4 text-ink-subtle shrink-0" />
              {amenity}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 border-t border-line flex items-end justify-between gap-4">
          <p className="flex flex-col">
            {room.originalPrice && room.originalPrice > room.price && (
              <span className="text-[13px] font-medium text-ink-faint line-through">
                {formatPrice(room.originalPrice)}
              </span>
            )}
            <span className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-ink">{formatPrice(room.price)}</span>
              <span className="text-ink-muted text-[13px] font-medium">/night</span>
            </span>
          </p>

          <span className="flex items-center gap-1.5 font-bold text-gold group-hover:text-gold-dark transition-colors text-sm shrink-0">
            View stay
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
