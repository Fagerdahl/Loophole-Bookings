/**
 * View mappers, one of the most important parts of the demo! This is the translator between Domain and UI.
 * UI will never know how the domain looks like internally.
 *
 * Purpose:
 * - Convert domain objects into UI-safe JSON (primitives only).
 * - Prevent leaking domain internals (value objects, Dates etc) into the presentation layer.
 * - Keep demo UI stable even if domain internals evolve.
 */

const toIsoDate = (value) => {
  if (!value) return null;

  // If value is a Date object
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  // If value is already a string like "2026-02-01"
  if (typeof value === 'string') {
    // Keep as it is, but normalize if it includes time
    return value.length >= 10 ? value.slice(0, 10) : value;
  }

  return String(value);
};

// UI does not care about how bookings store date ranges internally - so we use only primitives
export const bookingView = (b) => {
  const from = b.from ?? b.dateRange?.from;
  const to = b.to ?? b.dateRange?.to;

  return {
    id: b.id,
    guests: b.guests,
    status: b.status,
    from: toIsoDate(from),
    to: toIsoDate(to),
  };
};

// Aggregated view of Room for UI purposes, protects UI from null or undefined bookings
export const roomView = (r) => ({
  id: r.id,
  capacity: r.capacity,
  bookings: (r.bookings ?? []).map(bookingView),
});
