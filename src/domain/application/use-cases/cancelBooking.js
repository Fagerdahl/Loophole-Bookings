/* Cancel a booking based on domain rules */

import { DomainError } from '../../errors/DomainError.js';

/**
 * UC2 - Cancel Booking
 *
 * Responsibility:
 * - Locate the booking through rooms provided by the store
 * - Delegate authorization + state transition rules to Booking.cancel(...)
 * - Persist the updated Room through the store
 * - Return the updated booking to the calling layer
 */

export function cancelBooking({ bookingId, isAdmin }, store) {
  //Validate input early, use case should not proceed with invalid data
  if (!bookingId || typeof bookingId !== 'string') {
    throw new DomainError(
      'A valid booking ID must be provided when cancelling.'
    );
  }

  // Get all rooms from the store abstraction
  const rooms = store.listRooms();

  // Identify the room that contains the booking, bookings are owned by rooms
  const roomWithBooking = rooms.find((room) =>
    room.bookings.some((b) => b.id === bookingId)
  );

  // If no room contains the booking, the booking does not exist in the system
  if (!roomWithBooking) {
    throw new DomainError('Booking not found.');
  }

  // Extract the booking from the room
  const booking = roomWithBooking.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    throw new DomainError('Booking not found in the specified room.');
  }

  // Domain handles rules: admin-only + prevent double cancellation
  const cancelledBooking = booking.cancel({ isAdmin });

  // Immutability: replace the booking in the list without mutating original room
  const updatedBookings = roomWithBooking.bookings.map((b) =>
    b.id === bookingId ? cancelledBooking : b
  );

  // Requires Room.withBookings(bookings) to create updated Room instance
  const updatedRoom = roomWithBooking.withBookings(updatedBookings);

  // Persist the updated room through the store abstraction
  store.saveRoom(updatedRoom);

  // Return the cancelled booking to the caller
  return cancelledBooking;
}
