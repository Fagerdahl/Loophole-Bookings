/* Create a new booking based on domain rules */

import { Booking } from '../../entities/Booking.js';
import { DateRange } from '../../value-objects/DateRange.js';
import { DomainError } from '../../errors/DomainError.js';

import crypto from 'crypto';

/** UC1 - Create Booking
 * Domain contains the rules (DateRange, Room.isAvailable, Room.addBooking, Booking.create
 * Use-case layer orchestrates the process)**/

export function createBooking(
  { from, to, guests },
  store,
  { idGenerator = () => crypto.randomUUID() } = {}
) {
  // DateRange creation will validate the dates
  const dateRange = new DateRange({ from, to });
  // Get all rooms from the store
  const rooms = store.listRooms();
  // Find an available room that fits the guest count
  const availableRoom = rooms.find(
    (room) => room.capacity >= guests && room.isAvailable(dateRange)
  );

  if (!availableRoom) {
    throw new DomainError(
      'No available rooms for the selected dates and guest count.'
    );
  }

  const booking = Booking.create({
    id: idGenerator(),
    dateRange,
    guests,
  });

  const updatedRoom = availableRoom.addBooking(booking);
  store.saveRoom(updatedRoom);
  return booking;
}
