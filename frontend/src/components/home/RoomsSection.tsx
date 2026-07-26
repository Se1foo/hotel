import { ArrowRight } from 'lucide-react';
import { useDestinations } from '../../lib/api';
import { Section, SectionHeading, Shell } from '../ui/Section';
import { RoomGrid } from '../ui/RoomGrid';
import { Button } from '../ui/Button';
import { PillOutline, Squiggle } from '../ui/Decor';

/** How many stays to showcase on the home page before sending people onward. */
const SHOWCASE_LIMIT = 6;

export function RoomsSection() {
  const { data: rooms = [], isLoading, isError, error, refetch } = useDestinations();

  return (
    <Section tone="canvas" spacing="lg">
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" aria-hidden="true">
        <PillOutline className="top-[20%] right-[-30px] opacity-70" />
        <Squiggle className="top-[60%] left-[2%] opacity-60" />
      </div>

      <Shell className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Handpicked stays"
            title="Available"
            accent="Accommodations"
            subtitle="A rotating selection from our collection, updated as new properties join."
          />

          <Button variant="outline" to="/destinations" className="shrink-0 self-start md:self-end">
            Explore all
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <RoomGrid
          rooms={rooms.slice(0, SHOWCASE_LIMIT)}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          emptyTitle="No stays available yet"
          emptyMessage="Our collection is being curated. Check back shortly."
        />

        {rooms.length > SHOWCASE_LIMIT && (
          <div className="mt-12 flex justify-center">
            <Button size="lg" to="/destinations">
              View all {rooms.length} stays
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </Shell>
    </Section>
  );
}
