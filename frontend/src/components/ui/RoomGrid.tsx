import type { ReactNode } from 'react';
import type { Destination } from '../../types';
import { RoomCard } from './RoomCard';
import { EmptyState, ErrorState } from './States';
import { RoomGridSkeleton } from './Skeleton';
import { getErrorMessage } from '../../lib/api';

interface RoomGridProps {
  rooms: Destination[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  /** How many skeleton cards to show while loading. */
  skeletonCount?: number;
}

/**
 * Owns the loading / error / empty / populated states for a list of rooms so no
 * page has to reimplement them. Each page previously wrote its own four
 * branches with different spinners, copy and colours — and several skipped the
 * empty branch entirely, rendering a blank grid.
 */
export function RoomGrid({
  rooms,
  isLoading,
  isError,
  error,
  onRetry,
  emptyTitle = 'No matches found',
  emptyMessage = 'Try widening your price range, lowering the guest count, or searching a different location.',
  emptyAction,
  skeletonCount = 6,
}: RoomGridProps) {
  // Skeletons rather than a spinner: the grid's shape is known ahead of time, so
  // the layout doesn't shift when the data lands.
  if (isLoading) return <RoomGridSkeleton count={skeletonCount} />;

  if (isError) {
    return (
      <ErrorState
        title="We couldn't load these stays"
        message={getErrorMessage(error, 'Please check your connection and try again.')}
        onRetry={onRetry}
      />
    );
  }

  if (rooms.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {rooms.map((room, index) => (
        <li key={room.id} className="flex">
          <RoomCard room={room} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
