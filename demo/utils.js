/**
 * Utility helpers for demo output
 * Purpose:
 * - Keep CLI output readable and consistent.
 * - Avoid printing raw domain objects directly.
 *
 * Why this matters in the exam:
 * - Separates domain logic from presentation concerns, even in small CLI demos.
 */

const formatDate = (date) =>
  date ? date.toISOString().slice(0, 10) : undefined;

/**
 * Maps a Booking domain entity to a plain object
 * suitable for CLI output.
 */
export const bookingView = (booking) => ({
  id: booking.id,
  guests: booking.guests,
  status: booking.status,
  from: formatDate(booking.dateRange?.from),
  to: formatDate(booking.dateRange?.to),
});
