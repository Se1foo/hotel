import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useFavoriteIds, useToggleFavorite } from '../../lib/api';
import { useToast } from './toast/useToast';
import { cn } from '../../lib/utils';

interface FavoriteButtonProps {
  destinationId: number;
  /** Named in the toast and the accessible label. */
  title: string;
  /** `overlay` sits on top of a photo; `inline` sits on a surface. */
  variant?: 'overlay' | 'inline';
  className?: string;
}

/**
 * Saved-stay toggle.
 *
 * `User.savedDeals` sat unused on the schema from the beginning. This is the UI
 * for it, with an optimistic cache update so the heart responds instantly.
 */
export function FavoriteButton({
  destinationId,
  title,
  variant = 'overlay',
  className,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: favoriteIds = [] } = useFavoriteIds(isAuthenticated);
  const toggleFavorite = useToggleFavorite();

  const isSaved = favoriteIds.includes(destinationId);

  const handleClick = (event: React.MouseEvent) => {
    // These buttons sit inside cards whose title is a stretched link, so the
    // click must not also navigate.
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      notify('Sign in to save stays to your list.', 'info');
      navigate('/login');
      return;
    }

    toggleFavorite.mutate(
      { id: destinationId, saved: !isSaved },
      {
        onSuccess: () =>
          notify(isSaved ? `Removed ${title} from saved.` : `Saved ${title}.`, 'success'),
        onError: () => notify('Could not update your saved stays.', 'error'),
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      // `aria-pressed` conveys toggle state; the label says what the press does.
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${title} from saved stays` : `Save ${title}`}
      className={cn(
        'relative z-10 grid place-items-center rounded-full transition-all duration-200 active:scale-90',
        variant === 'overlay'
          ? 'w-9 h-9 bg-surface/90 backdrop-blur-sm shadow-subtle hover:bg-surface'
          : 'w-11 h-11 border border-line bg-surface hover:border-gold',
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          'w-[18px] h-[18px] transition-colors',
          isSaved ? 'fill-danger text-danger' : 'text-ink-muted',
        )}
      />
    </button>
  );
}
