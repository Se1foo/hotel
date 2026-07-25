import { Compass } from 'lucide-react';
import { Shell } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../lib/useDocumentTitle';

/**
 * Unknown routes previously matched nothing, rendering the navbar and footer
 * around a completely empty `<main>`.
 */
export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <Shell className="py-24 md:py-32 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-gold-soft flex items-center justify-center text-gold mb-8">
        <Compass className="w-9 h-9" aria-hidden="true" />
      </div>

      <p className="text-eyebrow uppercase text-gold mb-4">Error 404</p>
      <h1 className="text-display-sm md:text-display-md text-ink mb-5">
        This page checked out
      </h1>
      <p className="text-ink-muted text-lg max-w-md text-pretty mb-10">
        We couldn't find the page you were looking for. It may have moved, or the link might be out
        of date.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" to="/destinations">
          Browse destinations
        </Button>
        <Button variant="outline" size="lg" to="/">
          Back to home
        </Button>
      </div>
    </Shell>
  );
}
