import { Shell } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/Section';
import { Alert } from '../components/ui/Alert';
import { site } from '../config/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

interface LegalPageProps {
  kind: 'privacy' | 'terms';
}

const content = {
  privacy: {
    title: 'Privacy',
    accent: 'Policy',
    intro: `How ${site.name} collects, uses and protects your personal information.`,
    sections: [
      {
        heading: 'Information we collect',
        body: 'We collect the name and email address you provide when creating an account, the booking details you submit when reserving a stay, and standard technical data such as your IP address and browser type.',
      },
      {
        heading: 'How we use it',
        body: 'Your information is used to authenticate your account, process and confirm reservations, and send transactional email such as verification links and booking confirmations. We do not sell your personal data.',
      },
      {
        heading: 'Cookies',
        body: 'We set a single HTTP-only cookie to hold your session refresh token. It is required to keep you signed in and is not used for advertising or cross-site tracking.',
      },
      {
        heading: 'Your rights',
        body: `You may request access to, correction of, or deletion of your personal data at any time by emailing ${site.contact.email}.`,
      },
    ],
  },
  terms: {
    title: 'Terms of',
    accent: 'Service',
    intro: `The terms that govern your use of ${site.name}.`,
    sections: [
      {
        heading: 'Using your account',
        body: 'You are responsible for keeping your credentials secure and for all activity that takes place under your account. Accounts must be registered with a valid email address that you control.',
      },
      {
        heading: 'Reservations',
        body: 'A reservation is a request until it is confirmed. Rates are shown per night excluding taxes and local fees unless stated otherwise, and are subject to availability at the time of confirmation.',
      },
      {
        heading: 'Cancellations',
        body: 'Cancellation terms are set by each individual property and are shown before you complete a reservation. Where a booking is cancellable, no charge is taken until the cancellation window closes.',
      },
      {
        heading: 'Acceptable use',
        body: 'You agree not to scrape, disrupt or attempt to gain unauthorised access to the service, and not to use it for any unlawful purpose.',
      },
    ],
  },
} as const;

/**
 * The footer previously rendered "Privacy Policy" and "Terms of Service" as
 * `<span>`s with link hover styling and no destination.
 */
export default function LegalPage({ kind }: LegalPageProps) {
  const { title, accent, intro, sections } = content[kind];
  useDocumentTitle(`${title} ${accent}`, intro);

  return (
    <Shell className="py-16 md:py-24 max-w-3xl">
      <SectionHeading as="h1" title={title} accent={accent} subtitle={intro} />

      <Alert tone="info" className="mt-10">
        This is sample copy for a portfolio project. It is not legal advice and does not constitute
        a binding agreement.
      </Alert>

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl text-ink mb-3">{section.heading}</h2>
            <p className="text-ink-muted leading-relaxed text-pretty">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-14 pt-8 border-t border-line text-sm text-ink-subtle">
        Questions? Email{' '}
        <a href={`mailto:${site.contact.email}`} className="text-gold hover:text-gold-dark font-semibold">
          {site.contact.email}
        </a>
        .
      </p>
    </Shell>
  );
}
