import { cn } from '../../lib/utils';

/**
 * Skeletons rather than a centred spinner for content that has a known shape.
 * A spinner tells the user "something is happening"; a skeleton tells them what
 * is about to appear and stops the layout jumping when it does.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('block bg-surface-muted rounded-lg animate-pulse', className)}
    />
  );
}

/** Mirrors `RoomCard`'s dimensions so the swap is visually seamless. */
export function RoomCardSkeleton() {
  return (
    <div className="bg-surface border border-line rounded-panel overflow-hidden shadow-card flex flex-col">
      <Skeleton className="h-[240px] rounded-none" />
      <div className="p-6 flex flex-col gap-3 flex-grow">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-4 mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-auto pt-5 border-t border-line flex items-end justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function RoomGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      // The list is still loading, so it is not yet meaningful content.
      role="status"
      aria-label="Loading stays"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {Array.from({ length: count }, (_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
}
