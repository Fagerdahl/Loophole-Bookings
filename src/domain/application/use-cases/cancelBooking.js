/* Cancel a booking based on domain rules */

import { DomainError } from '../../errors/DomainError.js';

/**
 * UC2 - Cancel Booking
 *
 * Responsibility:
 * - Locate the booking through rooms provided by the store
 * - Delegate authorization + state transition rules to Room.cancelBooking(...)
 * - Persist the updated Room through the store
 * - Return the cancelled booking
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

  const { room: updatedRoom, booking: cancelledBooking } =
    roomWithBooking.cancelBooking({ bookingId, isAdmin });

  store.saveRoom(updatedRoom);

  return cancelledBooking;
}
