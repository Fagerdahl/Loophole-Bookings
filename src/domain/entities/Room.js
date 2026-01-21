/* Room entity - Aggregate Root */

import { DomainError } from '../errors/DomainError.js';
import { Booking } from './Booking.js';
import { DateRange } from '../value-objects/DateRange.js';

import crypto from 'node:crypto';
export class Room {
  #id;
  #capacity;
  #bookings;

  constructor({ id, capacity, bookings }) {
    Room.#assertId(id);
    Room.#assertCapacity(capacity);
    Room.#assertBookings(bookings);
    Room.#assertNoOverlaps(bookings);

    this.#id = id;
    this.#capacity = capacity;
    this.#bookings = bookings;

    Object.freeze(this);
  }

  static create({ id, capacity, bookings = [] }) {
    // Freeze bookings array to prevent outside manipulation
    const safeBookings = Object.freeze([...bookings]);

    return new Room({
      id,
      capacity,
      bookings: safeBookings,
    });
  }

  get id() {
    return this.#id;
  }

  get capacity() {
    return this.#capacity;
  }

  get bookings() {
    // Return a new frozen bookings array- read only
    return Object.freeze([...this.#bookings]);
  }

  /** Aggregate root API (UC1 - Create Booking)
   *
   * - Creates a booking under Room rules
   * - Returns both updated room and booking (Immutable friendly)
   *
   */

  createBooking(
    { from, to, guests },
    { idGenerator = () => crypto.randomUUID() } = {}
  ) {
    const dateRange = new DateRange({ from, to });

    if (!Number.isInteger(guests) || guests < 1) {
      throw new DomainError('Guests must be a positive integer.');
    }

    if (guests > this.#capacity) {
      throw new DomainError('Booking guests exceed room capacity.');
    }

    if (!this.isAvailable(dateRange)) {
      throw new DomainError(
        'Room is not available for the requested date range.'
      );
    }

    const booking = Booking.create({
      id: idGenerator(),
      dateRange,
      guests,
    });

    const updatedRoom = this.addBooking(booking);
    return { room: updatedRoom, booking };
  }

  /**
   * Aggregate root API (UC2 - Cancel Booking)
   * Authorization lives here (not in Booking)
   */
  cancelBooking({ bookingId, isAdmin }) {
    if (!bookingId || typeof bookingId !== 'string') {
      throw new DomainError('cancelBooking requires a valid bookingId.');
    }

    if (isAdmin !== true) {
      throw new DomainError('Only administrators can cancel bookings.');
    }

    const booking = this.#bookings.find((b) => b.id === bookingId);
    if (!booking) {
      throw new DomainError('Booking not found.');
    }

    const cancelled = booking.cancel();

    const updatedBookings = this.#bookings.map((b) =>
      b.id === bookingId ? cancelled : b
    );

    const updatedRoom = this.withBookings(updatedBookings);
    return { room: updatedRoom, booking: cancelled };
  }

  addBooking(booking) {
    if (!(booking instanceof Booking)) {
      throw new DomainError('Room can only contain Booking instances.');
    }

    // Room owns the capacity constraint
    if (booking.guests > this.#capacity) {
      throw new DomainError('Booking guests exceed room capacity.');
    }

    if (!this.isAvailable(booking.dateRange)) {
      throw new DomainError(
        'Room is not available for the requested date range.'
      );
    }

    return Room.create({
      id: this.#id,
      capacity: this.#capacity,
      bookings: [...this.#bookings, booking],
    });
  }

  // Usually Room is immutable, but we need a way to update bookings, so this is the new version of the booking list
  withBookings(bookings) {
    Room.#assertBookings(bookings);
    Room.#assertNoOverlaps(bookings);

    for (const b of bookings) {
      if (b.guests > this.#capacity) {
        throw new DomainError('Booking guests exceed room capacity.');
      }
    }
    return Room.create({
      id: this.#id,
      capacity: this.#capacity,
      bookings,
    });
  }

  isAvailable(requestedDateRange) {
    if (!(requestedDateRange instanceof DateRange)) {
      throw new DomainError('isAvailable requires a DateRange instance.');
    }

    return this.#bookings.every((booking) => {
      if (booking.status === 'CANCELLED') {
        return true;
      }
      return !booking.dateRange.overlapsWith(requestedDateRange);
    });
  }

  static #assertId(id) {
    if (!id || typeof id !== 'string') {
      throw new DomainError('Room requires a valid id.');
    }
  }

  static #assertCapacity(capacity) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new DomainError('Room requires a valid capacity (integer >= 1).');
    }
  }

  static #assertBookings(bookings) {
    if (!Array.isArray(bookings)) {
      throw new DomainError('Room bookings must be an array.');
    }

    for (const booking of bookings) {
      if (!(booking instanceof Booking)) {
        throw new DomainError(
          'Room bookings must contain only Booking instances.'
        );
      }
    }
  }

  static #assertNoOverlaps(bookings) {
    const active = bookings.filter((b) => b.status !== 'CANCELLED');

    for (let i = 0; i < active.length; i += 1) {
      for (let j = i + 1; j < active.length; j += 1) {
        if (active[i].dateRange.overlapsWith(active[j].dateRange)) {
          throw new DomainError(
            'Room cannot contain overlapping active bookings.'
          );
        }
      }
    }
  }
}
