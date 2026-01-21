/* Create a new booking based on domain rules */

import { Booking } from '../../entities/Booking.js';
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
 * The domain layer is responsible for validation and rules:
 * - DateRange validates the date interval
 * - Room.isAvailable determines availability
 * - Room.addBooking enforces capacity constraints
 * - Booking.create sets the initial booking state
 *
 * The application layer (this file) only controls the order of operations.
 */

export function createBooking(
  { from, to, guests },
  store,
  { idGenerator = () => crypto.randomUUID() } = {}
) {
  if (!store || typeof store.listRooms !== 'function' || typeof store.saveRoom !== 'function') {
    throw new DomainError('Invalid RoomSto');
  }
  // Create a DateRange value object & its creation will validate the dates
  const dateRange = new DateRange({ from, to });

  // Get all rooms from the store abstraction, use case does not care where data comes from
  const rooms = store.listRooms();

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
  const booking = Booking.create({
    id: idGenerator(),
    dateRange,
    guests,
  });

  // Add the booking to the selected room, domain enforces the rules
  const updatedRoom = availableRoom.addBooking(booking);

  // Persistanve through the store abstraction
  store.saveRoom(updatedRoom);

  // Return the created booking to the caller
  return booking;
}
