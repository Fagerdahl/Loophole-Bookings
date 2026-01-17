/* Test for CreateBooking use case (application layer) */

import { describe, it, expect } from 'vitest';

import { createBooking } from '../../src/domain/application/use-cases/createBooking.js';
import { Room } from '../../src/domain/entities/Room.js';
import { DomainError } from '../../src/domain/errors/DomainError.js';

// In-memory implementation of RoomStore for testing purposes, test UC1 without DB
class InMemoryRoomStore {
  #rooms;

  constructor(rooms = []) {
    // Inject testdata so that every test can have its own setup
    this.#rooms = rooms;
  }

  // Contract method, createBooking needs this to list rooms
  listRooms() {
    return this.#rooms;
  }

  // Contract method, saveRoom(updatedRoom), Room is immutable so this is the replacement logic
  saveRoom(updatedRoom) {
    this.#rooms = this.#rooms.map((room) =>
      room.id === updatedRoom.id ? updatedRoom : room
    );
  }

  // Test helper (not part of the contract) to verify that the room was updated in the store
  getRoomById(id) {
    return this.#rooms.find((room) => room.id === id);
  }
}

// Testcase 1 - CreateBooking when all conditions are met
describe('CreateBooking Use Case', () => {
  it('creates a booking when a suitable room is available', () => {
    const room = Room.create({
      id: 'room-1',
      capacity: 2,
      bookings: [],
    });

    // persist the room in the in-memory store
    const store = new InMemoryRoomStore([room]);

    const booking = createBooking(
      { from: '2026-01-10', to: '2026-01-12', guests: 2 },
      store,
      { idGenerator: () => 'booking-1' }
    );

    // Verify that use case returns the created booking
    expect(booking.id).toBe('booking-1');
    expect(booking.status).toBe('CREATED');

    // Verify that room was updated and saved in the store
    const persistedRoom = store.getRoomById('room-1');
    expect(persistedRoom.bookings).toHaveLength(1);
    expect(persistedRoom.bookings[0].id).toBe('booking-1');
  });

  // Testcase 2 - Invalid date interval, DateRange is responsible for validation and error throwing
  it('throws DomainError when date interval is invalid (DateRange validation)', () => {
    const room = Room.create({ id: 'room-1', capacity: 2, bookings: [] });
    const store = new InMemoryRoomStore([room]);

    expect(() =>
      createBooking({ from: '2026-01-10', to: '2026-01-10', guests: 1 }, store)
    ).toThrow(DomainError);
  });

  // Testcase 3 - No available room found
  it('throws DomainError when no available room can be identified', () => {
    // No rooms in the store => no available room
    const store = new InMemoryRoomStore([]);

    expect(() =>
      createBooking({ from: '2026-01-10', to: '2026-01-12', guests: 1 }, store)
    ).toThrow(DomainError);
  });

  // Testcase 4 - Guests exceed room capacity
  it('throws DomainError when guests exceed capacity of all rooms', () => {
    const room = Room.create({ id: 'room-1', capacity: 2, bookings: [] });
    const store = new InMemoryRoomStore([room]);

    expect(() =>
      createBooking({ from: '2026-01-10', to: '2026-01-12', guests: 3 }, store)
    ).toThrow(DomainError);
  });
});
