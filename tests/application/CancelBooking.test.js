/* Test for CancelBooking use case (application layer) */

import { describe, it, expect } from 'vitest';

import { cancelBooking } from '../../src/domain/application/use-cases/cancelBooking.js';
import { Room } from '../../src/domain/entities/Room.js';
import { Booking } from '../../src/domain/entities/Booking.js';
import { DateRange } from '../../src/domain/value-objects/DateRange.js';
import { DomainError } from '../../src/domain/errors/DomainError.js';

/* In memory RoomStore implementation for isolation and testing purposes - verifies persistance behaviour without an actual DB*/
class InMemoryRoomStore {
  // Private field to hold rooms
  #rooms;

  constructor(rooms = []) {
    // Startdata for test are injected through constructor
    this.#rooms = rooms;
  }

  // Returns all rooms - useful for finding bookings
  listRooms() {
    return this.#rooms;
  }

  // Saves updated room - by calling save with updatedRoom
  saveRoom(updatedRoom) {
    this.#rooms = this.#rooms.map((room) =>
      room.id === updatedRoom.id ? updatedRoom : room
    );
  }

  // Test helper to get a persisted room by its id and verify its changes
  getRoomById(id) {
    return this.#rooms.find((r) => r.id === id);
  }
}

/* ----------------TEST----------------- */

// Testcase 1 - CancelBooking when user is admin
describe('CancelBooking Use Case', () => {
  it('cancels a booking when user is admin', () => {
    const booking = Booking.create({
      id: 'booking-1',
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
    });

    const room = Room.create({
      id: 'room-1',
      capacity: 2,
      bookings: [booking],
    });

    const store = new InMemoryRoomStore([room]);

    const cancelled = cancelBooking(
      { bookingId: 'booking-1', isAdmin: true },
      store
    );

    // Booking is returned as cancelled
    expect(cancelled.status).toBe('CANCELLED');

    // Room is persited with the updated booking status (cancelled)
    const persistedRoom = store.getRoomById('room-1');
    expect(persistedRoom.bookings[0].status).toBe('CANCELLED');
  });

  // Testcase 2 - Verifies that a non-admin is not allowed.
  it('throws DomainError when user is not admin', () => {
    const booking = Booking.create({
      id: 'booking-1',
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
    });

    const room = Room.create({
      id: 'room-1',
      capacity: 2,
      bookings: [booking],
    });

    const store = new InMemoryRoomStore([room]);

    expect(() =>
      cancelBooking({ bookingId: 'booking-1', isAdmin: false }, store)
    ).toThrow(DomainError);
  });

  // Testcase 3 - Booking not found, cancellation failed
  it('throws DomainError when booking is not found', () => {
    const store = new InMemoryRoomStore([]);

    expect(() =>
      cancelBooking({ bookingId: 'missing', isAdmin: true }, store)
    ).toThrow(DomainError);
  });

  // Testcase 4 - Booking already cancelled, no double cancellations allowed
  it('throws DomainError when trying to cancel twice', () => {
    const cancelledAlready = Booking.create({
      id: 'booking-1',
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
    }).cancel({ isAdmin: true });

    const room = Room.create({
      id: 'room-1',
      capacity: 2,
      bookings: [cancelledAlready],
    });

    const store = new InMemoryRoomStore([room]);

    expect(() =>
      cancelBooking({ bookingId: 'booking-1', isAdmin: true }, store)
    ).toThrow(DomainError);
  });
});
