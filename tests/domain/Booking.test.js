/* Test for Booking entity */

import { describe, it, expect } from 'vitest';
import { Booking } from '../../src/domain/entities/Booking.js';
import { DateRange } from '../../src/domain/value-objects/DateRange.js';
import { DomainError } from '../../src/domain/errors/DomainError.js';
import crypto from 'node:crypto';

// Testcase 1: Booking contains a valid DateRange and a number of guests
describe('Booking', () => {
  it('contains a DateRange and number of guests', () => {
    const dateRange = new DateRange({ from: '2026-01-01', to: '2026-01-05' });

    const booking = Booking.create({
      id: crypto.randomUUID(),
      dateRange,
      guests: 2,
    });

    expect(booking.dateRange).toBeInstanceOf(DateRange);
    expect(booking.guests).toBe(2);
  });

  // Testcase 2: Booking has initial status 'CREATED' and should not be reachable from the outside
  it('has initial status CREATED', () => {
    const dateRange = new DateRange({ from: '2026-01-01', to: '2026-01-05' });

    const booking = Booking.create({
      id: crypto.randomUUID(),
      dateRange,
      guests: 1,
    });

    expect(booking.status).toBe('CREATED');
  });

  // Testcase 3: Booking creation fails with invalid DateRange
  it('throws DomainError when dateRange is missing or invalid', () => {
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), guests: 2 })
    ).toThrow(DomainError);

    // Invalid dateRange (not a DateRange instance)
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), dateRange: {}, guests: 2 })
    ).toThrow(DomainError);
  });

  // Testcase 4: Booking creation fails with invalid number of guests, must be + integer
  it('throws DomainError when guests is invalid', () => {
    const dateRange = new DateRange({ from: '2026-01-01', to: '2026-01-05' });

    expect(() =>
      Booking.create({ id: crypto.randomUUID(), dateRange, guests: 0 })
    ).toThrow(DomainError);
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), dateRange, guests: -1 })
    ).toThrow(DomainError);
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), dateRange, guests: 1.5 })
    ).toThrow(DomainError);
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), dateRange, guests: '2' })
    ).toThrow(DomainError);
  });

  // Testcase 5: Booking status cannot be set from the outside
  it('does not allow status to be set from the outside', () => {
    const dateRange = new DateRange({ from: '2026-01-01', to: '2026-01-05' });
    const booking = Booking.create({
      id: crypto.randomUUID(),
      dateRange,
      guests: 2,
    });

    expect(() => {
      booking.status = 'CANCELLED';
    }).toThrow(TypeError);

    // Prove that it remains CREATED, status is unchanged and read-only
    expect(booking.status).toBe('CREATED');
  });

  // Testcase 6: allows admin to cancel a booking
  it('allows only admin to cancel a booking', () => {
    const booking = Booking.create({
      id: crypto.randomUUID(),
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
    });

    const cancelledBooking = booking.cancel({ isAdmin: true });

    expect(cancelledBooking.status).toBe('CANCELLED');
    expect(booking.status).toBe('CREATED'); // Original booking remains unchanged
  });

  // Testcase 7: Cancellation attempted from the outside by non-admin throws DomainError
  it('throws DomainError when non-admin tries to cancel a booking', () => {
    const booking = Booking.create({
      id: crypto.randomUUID(),
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
    });

    expect(() => {
      booking.cancel({ isAdmin: false });
    }).toThrow(DomainError);
    expect(() => {
      booking.cancel({ isAdmin: undefined });
    }).toThrow(DomainError);
  });

  // Testcase 8: Cancellation of an already cancelled booking throws DomainError
  it('throws DomainError when trying to cancel an already cancelled booking', () => {
    const booking = Booking.create({
      id: crypto.randomUUID(),
      guests: 2,
      dateRange: new DateRange({ from: '2026-01-01', to: '2026-01-03' }),
    });

    const cancelledBooking = booking.cancel({ isAdmin: true });

    expect(() => cancelledBooking.cancel({ isAdmin: true })).toThrow(
      DomainError
    );
  });
});
