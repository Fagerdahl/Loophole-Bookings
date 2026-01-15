/* Room entity */

import { DomainError } from '../errors/DomainError.js';
import { Booking } from './Booking.js';

export class Room {
  #id;
  #capacity;
  #bookings;

  constructor({ id, capacity, bookings }) {
    Room.#assertId(id);
    Room.#assertCapacity(capacity);
    Room.#assertBookings(bookings);

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
    // Return the frozen bookings array
    return this.#bookings;
  }

  addBooking(booking) {
    if (!(booking instanceof Booking)) {
      throw new DomainError('Room can only contain Booking instances.');
    }

    // immutability: create new Room with new booking list
    return Room.create({
      id: this.#id,
      capacity: this.#capacity,
      bookings: [...this.#bookings, booking],
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
}
