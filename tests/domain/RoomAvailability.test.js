/* Test for RoomAvailability */

import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';

import { Room } from '../../src/domain/entities/Room.js';
import { Booking } from '../../src/domain/entities/Booking.js';
import { DateRange } from '../../src/domain/value-objects/DateRange.js';

// Testcase 1: A room should be available when there are no bookings
describe('Room availability', () => {
  it('is available when there are no bookings', () => {
    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
    });

    // Testcase 2: Create a date range to check availability against
    const requested = new DateRange({
      from: '2026-01-10',
      to: '2026-01-15',
    });

    expect(room.isAvailable(requested)).toBe(true);
  });

  // Testcase 3: Room is not available when there is an active booking that overlaps
  it('is not available when an active booking overlaps', () => {
    const booking = Booking.create({
      id: crypto.randomUUID(),
      guests: 2,
      dateRange: new DateRange({
        from: '2026-01-05',
        to: '2026-01-12',
      }),
    });

    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
      bookings: [booking],
    });

    const requested = new DateRange({
      from: '2026-01-10',
      to: '2026-01-15',
    });

    expect(room.isAvailable(requested)).toBe(false);
  });

  // Testcase 4: CANCELLED bookings do not block availability
  it('is available when overlapping booking is CANCELLED', () => {
    const booking = Booking.create({
      id: crypto.randomUUID(),
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-05', to: '2026-01-12' }),
    });

    const cancelledBooking = booking.cancel({ isAdmin: true });

    const room = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
      bookings: [cancelledBooking],
    });

    const requested = new DateRange({
      from: '2026-01-10',
      to: '2026-01-15',
    });

    expect(room.isAvailable(requested)).toBe(true);
  });

  // Testcase 5: Room becomes available again when a booking is cancelled
  it('becomes available when an active booking is cancelled', () => {
    const booking = Booking.create({
      id: crypto.randomUUID(),
      guests: 2,
      dateRange: new DateRange({
        from: '2026-01-05',
        to: '2026-01-12',
      }),
    });

    const roomWithActiveBooking = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
      bookings: [booking],
    });

    const requested = new DateRange({
      from: '2026-01-10',
      to: '2026-01-15',
    });

    // Active booking blocks availability
    expect(roomWithActiveBooking.isAvailable(requested)).toBe(false);

    // Cancel booking
    const cancelledBooking = booking.cancel({ isAdmin: true });

    const roomWithCancelledBooking = Room.create({
      id: crypto.randomUUID(),
      capacity: 2,
      bookings: [cancelledBooking],
    });

    // Cancelled booking no longer blocks availability
    expect(roomWithCancelledBooking.isAvailable(requested)).toBe(true);
  });
});
