import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import type { Destination } from '../../types';
import { getErrorMessage, useDeleteReview, useSubmitReview } from '../../lib/api';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../ui/toast/useToast';
import { formatDate, pluralize } from '../../lib/format';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Field';
import { Alert } from '../ui/Alert';
import { EmptyState } from '../ui/States';

interface ReviewSectionProps {
  destination: Destination;
  /** Reviews are gated to guests with a booking — the API enforces this too. */
  canReview: boolean;
}

/** Initials avatar; there are no profile photos in the data model. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <span
      aria-hidden="true"
      className="w-10 h-10 shrink-0 rounded-full bg-gold-soft text-gold-dark grid place-items-center text-sm font-bold"
    >
      {initials || '?'}
    </span>
  );
}

export function ReviewSection({ destination, canReview }: ReviewSectionProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const submitReview = useSubmitReview();
  const deleteReview = useDeleteReview();

  const id = String(destination.id);
  const myReview = user ? destination.reviews.find((r) => r.userId === user.id) : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [comment, setComment] = useState(myReview?.comment ?? '');
  const [formError, setFormError] = useState<string | null>(null);

  // Newest first, and the viewer's own review pinned to the top.
  const ordered = [...destination.reviews].sort((a, b) => {
    if (user) {
      if (a.userId === user.id) return -1;
      if (b.userId === user.id) return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const openEditor = () => {
    setRating(myReview?.rating ?? 0);
    setComment(myReview?.comment ?? '');
    setFormError(null);
    setIsEditing(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (rating < 1) {
      setFormError('Please choose a star rating.');
      return;
    }

    try {
      await submitReview.mutateAsync({ id, rating, comment: comment.trim() || undefined });
      setIsEditing(false);
      notify(myReview ? 'Your review was updated.' : 'Thanks for your review.', 'success');
    } catch (error) {
      setFormError(getErrorMessage(error, 'We could not save your review.'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview.mutateAsync(id);
      setIsEditing(false);
      setRating(0);
      setComment('');
      notify('Your review was removed.', 'success');
    } catch (error) {
      notify(getErrorMessage(error, 'We could not remove your review.'), 'error');
    }
  };

  return (
    <section aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="reviews-heading" className="text-2xl text-ink">
            Guest reviews
          </h2>
          {destination.reviews.length > 0 && (
            <div className="flex items-center gap-2.5 mt-2">
              <StarRating value={destination.rating} size="sm" />
              <span className="text-sm text-ink-muted">
                {destination.rating.toFixed(1)} · {pluralize(destination.reviews.length, 'review')}
              </span>
            </div>
          )}
        </div>

        {canReview && !isEditing && (
          <Button variant="outline" size="sm" onClick={openEditor}>
            <MessageSquarePlus className="w-4 h-4" aria-hidden="true" />
            {myReview ? 'Edit your review' : 'Write a review'}
          </Button>
        )}
      </div>

      {/* Only guests with a booking can review — stated plainly rather than
          showing a control that fails with a 403 when used. */}
      {!canReview && (
        <p className="text-sm text-ink-muted mb-6">
          Reviews come from verified guests. Book this stay to share your own.
        </p>
      )}

      {isEditing && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="overflow-hidden bg-canvas border border-line rounded-panel p-6 mb-8"
        >
          <fieldset className="mb-5">
            <legend className="text-eyebrow uppercase text-ink mb-3">Your rating</legend>
            <StarRating
              value={rating}
              onRate={setRating}
              size="lg"
              label={destination.title}
              disabled={submitReview.isPending}
            />
          </fieldset>

          <Textarea
            label="Your review"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What stood out? What should the next guest know?"
            rows={4}
            maxLength={1500}
            hint={`${comment.length}/1500 characters — optional`}
            disabled={submitReview.isPending}
          />

          {formError && (
            <Alert tone="error" className="mt-4">
              {formError}
            </Alert>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button type="submit" isLoading={submitReview.isPending}>
              {myReview ? 'Update review' : 'Publish review'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            {myReview && (
              <Button
                type="button"
                variant="ghost"
                isLoading={deleteReview.isPending}
                onClick={handleDelete}
                className="ml-auto text-danger hover:text-danger hover:bg-danger-soft"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Delete
              </Button>
            )}
          </div>
        </motion.form>
      )}

      {ordered.length === 0 ? (
        <EmptyState
          icon={<MessageSquarePlus className="w-7 h-7" aria-hidden="true" />}
          title="No reviews yet"
          message="Be the first to tell other travellers about this place."
          className="py-12"
        />
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {ordered.map((review) => {
            const isMine = user?.id === review.userId;
            return (
              <li key={review.userId} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <Avatar name={review.authorName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-bold text-ink">{review.authorName}</p>
                      {isMine && (
                        <span className="text-eyebrow uppercase text-gold">Your review</span>
                      )}
                      <span className="text-sm text-ink-subtle">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <StarRating value={review.rating} size="sm" className="mt-1.5" />
                    {review.comment && (
                      <p className="text-ink-muted leading-relaxed mt-2.5 text-pretty">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
