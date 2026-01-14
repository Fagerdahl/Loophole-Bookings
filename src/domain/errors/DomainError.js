/* DomainError is based on JS Error class that makes try-catch blocks more specific to domain-related issues. */
export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DomainError';
  }
}
