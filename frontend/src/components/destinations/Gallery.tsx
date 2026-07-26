import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SmartImage } from '../ui/SmartImage';
import { cn } from '../../lib/utils';

interface GalleryProps {
  images: string[];
  title: string;
}

/**
 * Hero image with thumbnail strip and a lightbox.
 *
 * The data model only carried one image per property, so detail pages showed a
 * single photo. Each property now ships a small gallery.
 */
export function Gallery({ images, title }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = images.length;
  const step = (delta: number) => setActive((current) => (current + delta + count) % count);

  // Arrow-key navigation and Escape-to-close while the lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, count]);

  if (count === 0) return null;

  return (
    <>
      <div className="relative h-[46vh] md:h-[58vh] w-full bg-surface-muted">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <SmartImage
              src={images[active]}
              alt={`${title} — photo ${active + 1} of ${count}`}
              priority={active === 0}
              wrapperClassName="absolute inset-0"
            />
          </motion.div>
        </AnimatePresence>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 pointer-events-none"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-5 right-5 z-10 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-ink text-sm font-bold shadow-float transition-colors"
        >
          View all {count} photos
        </button>

        {count > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === active ? 'w-7 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo gallery`}
            className="fixed inset-0 z-[90] bg-ink/95 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 md:p-6 text-ink-inverse shrink-0">
              <p className="text-sm font-bold">
                {active + 1} / {count}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close gallery"
                autoFocus
                className="grid place-items-center w-11 h-11 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-4">
              <SmartImage
                src={images[active]}
                alt={`${title} — photo ${active + 1} of ${count}`}
                wrapperClassName="max-w-5xl w-full h-full rounded-panel bg-transparent"
                className="object-contain"
              />
            </div>

            <div className="flex justify-center gap-2 p-4 md:p-6 shrink-0 overflow-x-auto">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === active}
                  className={cn(
                    'shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all',
                    index === active ? 'ring-2 ring-amber' : 'opacity-60 hover:opacity-100',
                  )}
                >
                  <SmartImage src={src} alt="" wrapperClassName="w-full h-full" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
