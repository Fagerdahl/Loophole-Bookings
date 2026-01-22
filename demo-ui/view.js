/** Translation layer between domain entities and UI-data (JSON)
 * view.js decide HOW domain entities are presented to the user interface, without
 * leaking domaindetails outside the domain layer.
 */

const formatDate = (date) =>
  date ? date.toISOString().slice(0, 10) : undefined;

export const bookingView = (booking) => ({
  id: booking.id,
  guests: booking.guests,
  status: booking.status,
  from: formatDate(booking.dateRange?.from),
  to: formatDate(booking.dateRange?.to),
});

export const roomView = (room) => ({
  id: room.id,
  capacity: room.capacity,
  bookings: room.bookings.map(bookingView),
});
