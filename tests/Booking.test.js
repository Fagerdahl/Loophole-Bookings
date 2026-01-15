/* Test for Booking entity */

import { describe, it, expect } from 'vitest';
import { Booking } from '../src/domain/entities/Booking.js';
import { DateRange } from '../src/domain/value-objects/DateRange.js';
import { DomainError } from '../src/domain/errors/DomainError.js';
import crypto from 'node:crypto';

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

  it('has initial status CREATED', () => {
    const dateRange = new DateRange({ from: '2026-01-01', to: '2026-01-05' });

    const booking = Booking.create({
      id: crypto.randomUUID(),
      dateRange,
      guests: 1,
    });

    expect(booking.status).toBe('CREATED');
  });

  it('throws DomainError when dateRange is missing or invalid', () => {
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), guests: 2 })
    ).toThrow(DomainError);

    // Invalid dateRange (not a DateRange instance)
    expect(() =>
      Booking.create({ id: crypto.randomUUID(), dateRange: {}, guests: 2 })
    ).toThrow(DomainError);
  });

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

    // Prove that it remains CREATED
    expect(booking.status).toBe('CREATED');
  });
});
