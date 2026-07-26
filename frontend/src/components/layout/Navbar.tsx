import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { navLinks } from '../../config/site';
import { Shell } from '../ui/Section';
import { Button } from '../ui/Button';
import { Logo } from './Logo';
import { cn } from '../../lib/utils';

/**
 * `/destination/:id` should light up the "Destinations" tab. The old check was
 * a strict `pathname === path`, so detail pages highlighted nothing.
 */
function isRouteActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  if (path === '/destinations') return pathname.startsWith('/destination');
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Signed-out visitors don't see links that would only bounce them to /login.
  const links = navLinks.filter((link) => !link.requiresAuth || isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Read synchronously on first render so a page loaded mid-scroll (a refresh,
  // or a back-navigation with restored scroll) paints the correct header state
  // instead of flashing the un-scrolled one.
  const [scrolled, setScrolled] = useState(() =>
    typeof window === 'undefined' ? false : window.scrollY > 8,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll and close on Escape while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      className={cn(
        // Was `absolute`, which forced every page to compensate with a magic
        // pt-24/pt-32/pt-40 and meant the nav scrolled away entirely.
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-canvas/85 backdrop-blur-md border-b border-line shadow-subtle'
          : 'bg-canvas border-b border-transparent',
      )}
    >
      <Shell className="flex items-center justify-between h-20 md:h-24 gap-4">
        <Logo />

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const active = isRouteActive(pathname, link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative py-2 text-[15px] font-semibold transition-colors',
                  active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                {link.name}
                {active && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-amber rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 text-sm font-semibold text-ink-muted max-w-[180px]">
                <User className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{user?.name}</span>
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login">
                Log in
              </Button>
              <Button size="sm" to="/signup">
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* The old hamburger was a labelled "placeholder" with no handler, so
            mobile users had no navigation and no way to log in at all. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="lg:hidden p-2 -mr-2 text-ink rounded-lg hover:bg-surface-muted transition-colors"
        >
          {menuOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </Shell>

      {/*
        Rendered conditionally with an enter-only animation rather than through
        `AnimatePresence`. Animating `height: auto -> 0` on exit reliably stalled
        just short of zero, leaving the drawer in the DOM at 0.8px with
        `opacity: 0` — visually gone, but its seven links and the log-out button
        stayed in the keyboard tab order. Unmounting outright is both simpler and
        the only version that is actually accessible when closed.
      */}
      {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={closeMenu}
              className="lg:hidden fixed inset-0 top-20 bg-ink/20 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            <motion.nav
              id="mobile-menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden relative z-50 overflow-hidden bg-canvas border-b border-line shadow-panel"
            >
              <Shell className="py-5 flex flex-col gap-1">
                {links.map((link) => {
                  const active = isRouteActive(pathname, link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      aria-current={active ? 'page' : undefined}
                      // Closed on click rather than in an effect keyed on
                      // `pathname` — a `setState` in an effect body triggers a
                      // cascading render, and this is the actual user intent.
                      onClick={closeMenu}
                      className={cn(
                        'py-3 px-4 rounded-xl text-base font-semibold transition-colors',
                        active
                          ? 'bg-gold-soft text-gold-dark'
                          : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <div className="mt-4 pt-5 border-t border-line flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <span className="flex items-center gap-2 px-4 text-sm font-semibold text-ink-muted">
                        <User className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{user?.name}</span>
                      </span>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          closeMenu();
                          void logout();
                        }}
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" fullWidth to="/login">
                        Log in
                      </Button>
                      <Button fullWidth to="/signup">
                        Sign up
                      </Button>
                    </>
                  )}
                </div>
              </Shell>
            </motion.nav>
          </>
        )}
    </header>
  );
}
