/* Create a new booking based on domain rules */

import { DateRange } from '../../value-objects/DateRange.js';
import { DomainError } from '../../errors/DomainError.js';

import crypto from 'node:crypto';

/**
 * UC1 - Create Booking
 *
 * Responsibility:
 * This use case orchestrates the booking creation flow by coordinating
 * domain rules without implementing business logic itself.
 *
 * - Validate input through DateRange VO
 * - Select an available room (application-level selection)
 * - Delegate booking creation to the Room aggregate root
 * - Persist updated room through store
 * - Return created booking
 * - The application layer (this file) only controls the order of operations.
 */

export function createBooking(
  { from, to, guests },
  store,
  { idGenerator = () => crypto.randomUUID() } = {}
) {
  if (
    !store ||
    typeof store.listRooms !== 'function' ||
    typeof store.saveRoom !== 'function'
  ) {
    throw new DomainError(
      'Invalid RoomStore: expected listRooms() and saveRoom().'
    );
  }
  // Create a DateRange value object & its creation will validate the dates
  const dateRange = new DateRange({ from, to });
  // Get all rooms from the store abstraction, use case does not care where data comes from
  const rooms = store.listRooms();

  const nonRoom = rooms.find((r) => r && typeof r.isAvailable !== 'function');
  if (nonRoom) {
    throw new DomainError(
      `Store returned a non-Room instance: ${nonRoom?.constructor?.name ?? typeof nonRoom}`
    );
  }

  // Find an available room that fits the guest count & capacity
  const availableRoom = rooms.find(
    (room) => room.capacity >= guests && room.isAvailable(dateRange)
  );

  // Fail if no suitable room is found
  if (!availableRoom) {
    throw new DomainError(
      'No available rooms for the selected dates and guest count.'
    );
  }

  // Create the Booking entity, this guarantees valid DateRange, initial status and valid number of guests
  const { room: updatedRoom, booking } = availableRoom.createBooking(
    { from, to, guests },
    { idGenerator }
  );

  store.saveRoom(updatedRoom);

  return booking;
}
