import { useEffect } from 'react';
import { site } from '../config/site';

/**
 * Sets the document title and meta description per route.
 *
 * Every route previously shared the single static `<title>` from index.html, so
 * browser tabs, bookmarks and history entries were indistinguishable, and any
 * shared link previewed with the same generic text.
 *
 * Pass `null` while data is still loading to hold the previous title rather than
 * flashing "undefined".
 */
export function useDocumentTitle(title: string | null, description?: string): void {
  useEffect(() => {
    if (title === null) return;

    const previous = document.title;
    document.title = title ? `${title} · ${site.name}` : site.name;

    let metaPrevious: string | null = null;
    let meta: HTMLMetaElement | null = null;

    if (description) {
      meta = document.querySelector('meta[name="description"]');
      if (meta) {
        metaPrevious = meta.content;
        meta.content = description;
      }
    }

    return () => {
      document.title = previous;
      if (meta && metaPrevious !== null) meta.content = metaPrevious;
    };
  }, [title, description]);
}
