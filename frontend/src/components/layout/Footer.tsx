import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { site, publicNavLinks } from '../../config/site';
import { Shell } from '../ui/Section';
import { Logo } from './Logo';

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
];

export function Footer() {
  return (
    <footer className="bg-surface-inverse text-ink-inverse mt-auto">
      <Shell className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Logo tone="inverse" showTagline={false} />
            <p className="text-ink-inverse/70 text-sm leading-relaxed mt-5 max-w-sm text-pretty">
              {site.description}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-eyebrow uppercase text-amber mb-5">Explore</h2>
            <ul className="flex flex-col gap-3">
              {publicNavLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-ink-inverse/70 hover:text-amber transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow uppercase text-amber mb-5">Get in touch</h2>
            <ul className="flex flex-col gap-4 text-sm text-ink-inverse/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-amber" aria-hidden="true" />
                <span>{site.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-amber" aria-hidden="true" />
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="hover:text-amber transition-colors"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-amber" aria-hidden="true" />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="hover:text-amber transition-colors break-all"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-ink-inverse/15 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Was a hardcoded "© 2024". */}
          <p className="text-sm text-ink-inverse/60">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          {/* These were `<span>`s styled with link hover states — they looked
              clickable and did nothing. Now real routes. */}
          <ul className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm font-medium text-ink-inverse/60 hover:text-amber transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </footer>
  );
}
