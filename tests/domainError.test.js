/* Vitest is the framwork used for testing */

import { describe, it, expect } from 'vitest';
import { DomainError } from '../src/domain/errors/DomainError.js';

// Testcase: Ensure that DomainError works as expected
describe('DomainError', () => {
  it('should create an instance of DomainError with the correct message and name', () => {
    const errorMessage = 'This is a domain error';
    const domainError = new DomainError(errorMessage);

    expect(domainError).toBeInstanceOf(DomainError);
    expect(domainError.message).toBe(errorMessage);
    expect(domainError.name).toBe('DomainError');
  });
});
