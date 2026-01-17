/* Test for DateRange entity */

import { describe, it, expect } from 'vitest';
import { DateRange } from '../../src/domain/value-objects/DateRange.js';
import { DomainError } from '../../src/domain/errors/DomainError.js';

// Testcase 1: Ensure that from and to dates are required, DateRange must always represent a complete interval
describe('DateRange', () => {
  it('requires from and to', () => {
    expect(() => new DateRange({ to: new Date() })).toThrow(DomainError);
    expect(() => new DateRange({ from: new Date() })).toThrow(DomainError);
  });

  // Testcase 2: Ensure that invalid dates throw DomainError
  it('throws DomainError on invalid dates', () => {
    expect(
      () => new DateRange({ from: 'not-a-date', to: '2026-01-02' })
    ).toThrow(DomainError);

    expect(
      () => new DateRange({ from: '2026-01-01', to: 'still-not-a-date' })
    ).toThrow(DomainError);
  });

  // Testcase 3: Ensure that DateRange is immutable
  it('is immutable with defensive copies', () => {
    const range = new DateRange({ from: '2026-01-01', to: '2026-01-10' });
    const from = range.from;
    from.setFullYear(1999);

    expect(range.from.getFullYear()).toBe(2026);
  });

  // Testcase 4: overlapsWith returns true when two date ranges overlap. This is a core rule used to prevent double bookings
  it('overlapsWith returns true when ranges overlap', () => {
    const range1 = new DateRange({ from: '2026-01-01', to: '2026-01-10' });
    const range2 = new DateRange({ from: '2026-01-05', to: '2026-01-15' });

    expect(range1.overlapsWith(range2)).toBe(true);
    expect(range2.overlapsWith(range1)).toBe(true);
  });

  // Testcase 5: overlapsWith returns false when two date ranges do not overlap
  it('overlapsWith returns false when ranges do not overlap', () => {
    const range1 = new DateRange({ from: '2026-01-01', to: '2026-01-10' });
    const range2 = new DateRange({ from: '2026-01-10', to: '2026-01-20' });

    expect(range1.overlapsWith(range2)).toBe(false);
    expect(range2.overlapsWith(range1)).toBe(false);
  });
});
