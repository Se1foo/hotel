import { Heart } from 'lucide-react';
import { useFavorites } from '../lib/api';
import { useAuth } from '../components/auth/useAuth';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Shell, SectionHeading } from '../components/ui/Section';
import { RoomGrid } from '../components/ui/RoomGrid';
import { Button } from '../components/ui/Button';
import { pluralize } from '../lib/format';

/**
 * Saved stays. Backed by `User.savedDeals`, a field that existed on the schema
 * from the start but was never read or written by anything.
 */
export default function SavedPage() {
  useDocumentTitle('Saved stays');

  const { isAuthenticated } = useAuth();
  const { data: saved = [], isLoading, isError, error, refetch } = useFavorites(isAuthenticated);

  return (
    <Shell className="py-14 md:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Your shortlist"
        title="Saved"
        accent="stays"
        subtitle={
          isLoading || saved.length === 0
            ? 'Tap the heart on any stay to keep it here for later.'
            : `${pluralize(saved.length, 'stay')} saved for later.`
        }
        className="mb-12"
      />

      <RoomGrid
        rooms={saved}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        skeletonCount={3}
        emptyTitle="Nothing saved yet"
        emptyMessage="Browse the collection and tap the heart on anything you'd like to come back to."
        emptyAction={
          <Button size="lg" to="/destinations">
            <Heart className="w-4 h-4" aria-hidden="true" />
            Browse destinations
          </Button>
        }
      />
    </Shell>
  );
}
