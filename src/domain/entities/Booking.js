/* Booking entity */

import { DomainError } from '../errors/DomainError.js';
import { DateRange } from '../value-objects/DateRange.js';

const BOOKING_STATUS = Object.freeze({
  CREATED: 'CREATED',
  CANCELLED: 'CANCELLED',
});

export class Booking {
  #id;
  #dateRange;
  #guests;
  #status;

  constructor({ id, dateRange, guests, status }) {
    // constructor is held private intentionally, use Booking.create() instead
    Booking.#assertId(id);
    Booking.#assertDateRange(dateRange);
    Booking.#assertGuests(guests);
    Booking.#assertStatus(status);

    this.#id = id;
    this.#dateRange = dateRange;
    this.#guests = guests;
    this.#status = status;

    Object.freeze(this);
  }

  static create({ id, dateRange, guests }) {
    return new Booking({
      id,
      dateRange,
      guests,
      status: BOOKING_STATUS.CREATED,
    });
  }

  cancel({ isAdmin }) {
    if (isAdmin != true) {
      throw new DomainError('Only administrators can cancel bookings.');
    }

    if (this.#status === BOOKING_STATUS.CANCELLED) {
      throw new DomainError('Booking is already cancelled.');
    }

    return new Booking({
      id: this.#id,
      dateRange: this.#dateRange,
      guests: this.#guests,
      status: BOOKING_STATUS.CANCELLED,
    });
  }

  get id() {
    return this.#id;
  }

  get dateRange() {
    return this.#dateRange;
  }

  get guests() {
    return this.#guests;
  }

  get status() {
    return this.#status;
  }

  static #assertId(id) {
    if (!id || typeof id !== 'string') {
      throw new DomainError('Booking requires a valid id.');
    }
  }

  static #assertDateRange(dateRange) {
    if (!(dateRange instanceof DateRange)) {
      throw new DomainError('Booking requires a valid DateRange.');
    }
  }

  static #assertGuests(guests) {
    const isInteger = Number.isInteger(guests);
    if (!isInteger || guests < 1) {
      throw new DomainError(
        'Booking requires a valid number of guests (integer >= 1).'
      );
    }
  }
  static #assertStatus(status) {
    if (!Object.values(BOOKING_STATUS).includes(status)) {
      throw new DomainError('Booking requires a valid status.');
    }
  }
}
