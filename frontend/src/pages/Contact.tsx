import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { getErrorMessage, useSendContactMessage } from '../lib/api';
import { site } from '../config/site';
import { Shell } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/Section';
import { Input, Textarea } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  message: z
    .string()
    .trim()
    .min(10, 'Please give us a little more detail (at least 10 characters)')
    .max(2000, 'Please keep your message under 2000 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const DETAILS = [
  { icon: MapPin, label: 'Visit', value: site.contact.address, href: null },
  { icon: Phone, label: 'Call', value: site.contact.phone, href: `tel:${site.contact.phoneHref}` },
  { icon: Mail, label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
];

export default function ContactPage() {
  useDocumentTitle('Contact us', 'Questions about a suite, a booking, or a bespoke request? Our reservations team replies within one business day.');

  const sendMessage = useSendContactMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    // The old handler was a `setTimeout(1200)` that flipped a flag and threw the
    // message away — the form reported success without sending anything.
    try {
      await sendMessage.mutateAsync(values);
      // Reset inside the success path: `sendMessage.isSuccess` is still stale
      // immediately after the await, since React hasn't re-rendered yet.
      reset();
    } catch {
      // Surfaced via `sendMessage.isError` in the form below.
    }
  };

  return (
    <Shell className="py-14 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="We're here to help"
            title="Get in"
            accent="touch"
            subtitle="Questions about a suite, a spa treatment, or a booking already made? Our reservations team replies within one business day."
          />

          <ul className="space-y-5 mt-10">
            {DETAILS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="w-12 h-12 shrink-0 rounded-full bg-surface border border-line flex items-center justify-center text-gold shadow-subtle"
                >
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-eyebrow uppercase text-ink">{label}</h2>
                  {href ? (
                    <a
                      href={href}
                      className="text-ink-muted font-medium hover:text-gold transition-colors break-words"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-ink-muted font-medium">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Was a fixed `h-[480px]` box, which clipped content once validation
            messages appeared. Now it sizes to its contents. */}
        <div className="bg-surface p-7 md:p-9 rounded-panel shadow-panel border border-line">
          {/*
            Enter-only animations, no `AnimatePresence mode="wait"`. This panel
            sits inside the page-level `AnimatePresence mode="wait"` in `App.tsx`,
            and nesting the two deadlocked: the form never finished exiting, so
            the success state never mounted — the message was sent (201) but the
            user saw no confirmation at all.
          */}
          {sendMessage.isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center py-14"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-20 h-20 bg-success-soft rounded-full flex items-center justify-center mb-6 text-success"
                >
                  <CheckCircle className="w-10 h-10" aria-hidden="true" />
                </motion.span>

                <h2 className="text-2xl text-ink mb-2">Message sent</h2>
                <p role="status" className="text-ink-muted text-pretty mb-8">
                  Thanks for reaching out — we'll be in touch within one business day.
                </p>

                <Button variant="outline" onClick={() => sendMessage.reset()}>
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-5"
              >
                {sendMessage.isError && (
                  <Alert tone="error">
                    {getErrorMessage(sendMessage.error, 'We could not send your message.')}
                  </Alert>
                )}

                <Input
                  {...register('name')}
                  label="Name"
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  error={errors.name?.message}
                  disabled={sendMessage.isPending}
                />

                <Input
                  {...register('email')}
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  disabled={sendMessage.isPending}
                />

                <Textarea
                  {...register('message')}
                  label="Message"
                  rows={5}
                  placeholder="How can we help?"
                  error={errors.message?.message}
                  disabled={sendMessage.isPending}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  shape="rounded"
                  isLoading={sendMessage.isPending}
                >
                  Send message
                  <Send className="w-4 h-4" aria-hidden="true" />
                </Button>
              </motion.form>
            )}
        </div>
      </div>
    </Shell>
  );
}
