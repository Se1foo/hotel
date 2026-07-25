import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Search, Users } from 'lucide-react';
import { Calendar } from '../ui/Calendar';
import { Popover } from '../ui/Popover';
import { Button } from '../ui/Button';
import { formatDate, fromDateInputValue, pluralize, toDateInputValue } from '../../lib/format';
import type { SearchCriteria } from '../../lib/filters';
import { cn } from '../../lib/utils';

type PanelId = 'checkIn' | 'checkOut' | 'guests';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

interface SearchBarProps {
  /**
   * Seeds the internal draft. The parent remounts this component (via `key`)
   * when the applied criteria change, which resets the draft without an effect —
   * syncing props into state inside `useEffect` causes a cascading render.
   */
  initial: SearchCriteria;
  onSubmit: (criteria: SearchCriteria) => void;
}

/** A focusable trigger cell. The originals were `<div onClick>` — unreachable by keyboard. */
function TriggerCell({
  label,
  display,
  placeholder,
  icon,
  open,
  onToggle,
}: {
  label: string;
  display: string | null;
  placeholder: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-haspopup="dialog"
      className="flex-1 flex items-center gap-4 px-6 py-3 w-full text-left rounded-full hover:bg-surface-muted transition-colors"
    >
      <span aria-hidden="true" className="text-ink-subtle shrink-0">
        {icon}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-eyebrow uppercase text-ink mb-1">{label}</span>
        <span
          className={cn('text-[15px] font-medium truncate', display ? 'text-ink' : 'text-ink-faint')}
        >
          {display ?? placeholder}
        </span>
      </span>
    </button>
  );
}

export function SearchBar({ initial, onSubmit }: SearchBarProps) {
  // Local draft so typing a location doesn't re-filter on every keystroke.
  const [draft, setDraft] = useState<SearchCriteria>(initial);
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);

  const toggle = (panel: PanelId) => setOpenPanel((current) => (current === panel ? null : panel));
  const close = () => setOpenPanel(null);

  const checkIn = fromDateInputValue(draft.checkIn);
  const checkOut = fromDateInputValue(draft.checkOut);
  const today = new Date();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    close();
    onSubmit(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      // `role="search"` so assistive tech can jump straight to it.
      role="search"
      aria-label="Search destinations"
      className="bg-surface rounded-panel lg:rounded-full shadow-panel border border-line flex flex-col lg:flex-row items-stretch lg:items-center p-3 gap-1"
    >
      <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-b lg:border-b-0 lg:border-r border-line">
        <MapPin className="w-5 h-5 text-ink-subtle shrink-0" aria-hidden="true" />
        <div className="flex flex-col w-full min-w-0">
          <label htmlFor="search-location" className="text-eyebrow uppercase text-ink mb-1">
            Location
          </label>
          <input
            id="search-location"
            type="search"
            value={draft.location}
            onChange={(event) => setDraft({ ...draft, location: event.target.value })}
            placeholder="Anywhere"
            className="w-full bg-transparent text-ink font-medium text-[15px] placeholder:text-ink-faint"
          />
        </div>
      </div>

      <div className="relative flex-1 border-b lg:border-b-0 lg:border-r border-line">
        <TriggerCell
          label="Check in"
          display={checkIn ? formatDate(checkIn) : null}
          placeholder="Add date"
          icon={<CalendarIcon className="w-5 h-5" />}
          open={openPanel === 'checkIn'}
          onToggle={() => toggle('checkIn')}
        />
        <Popover open={openPanel === 'checkIn'} onClose={close}>
          <Calendar
            value={checkIn}
            minDate={today}
            rangeStart={checkIn}
            rangeEnd={checkOut}
            onSelect={(date) => {
              // Selecting a check-in after the current check-out clears the
              // check-out rather than leaving an inverted range.
              const next = { ...draft, checkIn: toDateInputValue(date) };
              if (checkOut && date >= checkOut) next.checkOut = '';
              setDraft(next);
              setOpenPanel('checkOut');
            }}
          />
        </Popover>
      </div>

      <div className="relative flex-1 border-b lg:border-b-0 lg:border-r border-line">
        <TriggerCell
          label="Check out"
          display={checkOut ? formatDate(checkOut) : null}
          placeholder="Add date"
          icon={<CalendarIcon className="w-5 h-5" />}
          open={openPanel === 'checkOut'}
          onToggle={() => toggle('checkOut')}
        />
        <Popover open={openPanel === 'checkOut'} onClose={close}>
          <Calendar
            value={checkOut}
            // Check-out can never precede check-in.
            minDate={checkIn ?? today}
            rangeStart={checkIn}
            rangeEnd={checkOut}
            onSelect={(date) => {
              setDraft({ ...draft, checkOut: toDateInputValue(date) });
              close();
            }}
          />
        </Popover>
      </div>

      <div className="relative flex-1">
        <TriggerCell
          label="Guests"
          display={pluralize(draft.guests, 'Guest')}
          placeholder="Add guests"
          icon={<Users className="w-5 h-5" />}
          open={openPanel === 'guests'}
          onToggle={() => toggle('guests')}
        />
        <Popover open={openPanel === 'guests'} onClose={close} className="p-2 min-w-[200px]">
          <ul role="listbox" aria-label="Number of guests" className="flex flex-col">
            {GUEST_OPTIONS.map((count) => (
              <li key={count}>
                <button
                  type="button"
                  role="option"
                  aria-selected={draft.guests === count}
                  onClick={() => {
                    setDraft({ ...draft, guests: count });
                    close();
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-[15px] rounded-lg transition-colors',
                    draft.guests === count
                      ? 'font-bold text-gold-dark bg-gold-soft'
                      : 'text-ink hover:bg-surface-muted',
                  )}
                >
                  {pluralize(count, 'Guest')}
                </button>
              </li>
            ))}
          </ul>
        </Popover>
      </div>

      <Button type="submit" size="lg" className="lg:ml-2 shrink-0">
        <Search className="w-5 h-5" aria-hidden="true" />
        Search
      </Button>
    </form>
  );
}
