import { DomainError } from '../errors/DomainError.js';

export class DateRange {
  #from;
  #to;

  constructor({ from, to }) {
    const fromDate = DateRange.#toDate(from, 'from');
    const toDate = DateRange.#toDate(to, 'to');
    if (fromDate.getTime() >= toDate.getTime()) {
      throw new DomainError("'from' date must be earlier than 'to' date.");
    }

    this.#from = new Date(fromDate.getTime());
    this.#to = new Date(toDate.getTime());

    // Immutability, prevent modifications to the instance
    Object.freeze(this);
  }
  get from() {
    return new Date(this.#from.getTime());
  }
  get to() {
    // Returns a copy to maintain immutability
    return new Date(this.#to.getTime());
  }
  overlapsWith(other) {
    if (!(other instanceof DateRange)) {
      throw new DomainError(
        'overlapsWith method expects a DateRange instance as argument.'
      );
    }
    //toDate is considered "checkout" and a new booking can start that day
    return this.#from < other.#to && other.#from < this.#to;
  }

  // Private static method to validate and convert input to Date, DateRange will ALWAYS provide us a guilty-proof Date object post construction
  static #toDate(value, fieldName) {
    if (value == null) {
      throw new DomainError(`DateRange requires '${fieldName}'.`);
    }
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new DomainError(`Invalid date for '${fieldName}'.`);
    }
    // Return a guaranteed correct Date object
    return date;
  }
}
