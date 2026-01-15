/* Test for Room Entity */

import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';

import { Room } from '../src/domain/entities/Room.js';
import { Booking } from '../src/domain/entities/Booking.js';
import { DateRange } from '../src/domain/value-objects/DateRange.js';
import { DomainError } from '../src/domain/errors/DomainError.js';

// Testcase 1: Basic properties and creation with valid data
describe('Room', () => {
  it('has a unique id and a capacity property', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 4,
    });

    expect(typeof room.id).toBe('string');
    expect(room.capacity).toBe(4);
  });

  // Testcase 2: Room can contain several bookings entities, also verifying immutability since addBooking returns a new Room instance
  it('can contain several bookings', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 4,
    });

    const booking1 = Booking.create({
      id: crypto.randomUUID(),
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
      guests: 2,
    });

    const booking2 = Booking.create({
      id: crypto.randomUUID(),
      dateRange: new DateRange({ from: '2026-01-05', to: '2026-01-07' }),
      guests: 1,
    });

    const updatedRoom = room.addBooking(booking1).addBooking(booking2);

    expect(updatedRoom.bookings).toHaveLength(2);
    expect(updatedRoom.bookings[0]).toBeInstanceOf(Booking);
    expect(updatedRoom.bookings[1]).toBeInstanceOf(Booking);
  });

  // Testcase 3: Invalid or missing id or capacity should throw DomainError
  it('throws DomainError when id is missing/invalid', () => {
    expect(() => Room.create({ capacity: 2 })).toThrow(DomainError);
    expect(() => Room.create({ id: 123, capacity: 2 })).toThrow(DomainError);
  });

  // Testcase 4: Invalid capacity values should throw DomainError
  it('throws DomainError when capacity is invalid', () => {
    expect(() => Room.create({ id: crypto.randomUUID(), capacity: 0 })).toThrow(
      DomainError
    );

    expect(() =>
      Room.create({ id: crypto.randomUUID(), capacity: -1 })
    ).toThrow(DomainError);

    expect(() =>
      Room.create({ id: crypto.randomUUID(), capacity: 1.5 })
    ).toThrow(DomainError);

    expect(() =>
      Room.create({ id: crypto.randomUUID(), capacity: '4' })
    ).toThrow(DomainError);
  });

  // Testcase 5: Test that only Booking instances can be added to the Room, protection against corruption
  it('throws DomainError when adding a non-Booking', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 4,
    });

    expect(() => room.addBooking({})).toThrow(DomainError);
  });

  // Testcase 6: Ensure immutability of bookings array, the original Room state must remain unchanged
  it('is immutable (does not expose internal bookings array for mutation)', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 4,
    });

    const bookings = room.bookings;

    expect(() => bookings.push('hack')).toThrow(); // push should fail because bookings is frozen
    expect(room.bookings).toHaveLength(0);
  });

  // Testcase 7: Allows booking when guests are equal to or less than capacity
  it('allows booking when guests are equal to or less than capacity', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
    });

    const booking = Booking.create({
      id: crypto.randomUUID(),
      dateRange: new DateRange({ from: '2026-02-01', to: '2026-02-03' }),
      guests: 2,
    });

    const updatedRoom = room.addBooking(booking);

    expect(updatedRoom.bookings).toHaveLength(1);
  });

  // Testcase 8: Reject booking when guests exceed room capacity
  it('throws DomainError when booking guests exceed room capacity', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
    });

    const booking = Booking.create({
      id: crypto.randomUUID(),
      dateRange: new DateRange({ from: '2026-02-01', to: '2026-02-03' }),
      guests: 3,
    });

    expect(() => room.addBooking(booking)).toThrow(DomainError);
  });
});
