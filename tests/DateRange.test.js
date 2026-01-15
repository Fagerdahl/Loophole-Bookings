/* Test for DateRange entity */

import { describe, it, expect } from 'vitest';
import { DateRange } from '../src/domain/value-objects/DateRange.js';
import { DomainError } from '../src/domain/errors/DomainError.js';

describe('DateRange', () => {
  it('requires from and to', () => {
    expect(() => new DateRange({ to: new Date() })).toThrow(DomainError);
    expect(() => new DateRange({ from: new Date() })).toThrow(DomainError);
  });

  it('throws DomainError on invalid dates', () => {
    expect(
      () => new DateRange({ from: 'not-a-date', to: '2026-01-02' })
    ).toThrow(DomainError);
    expect(
      () => new DateRange({ from: '2026-01-01', to: 'still-not-a-date' })
    ).toThrow(DomainError);
  });

  it('is immutable with defensive copies', () => {
    const range = new DateRange({ from: '2026-01-01', to: '2026-01-10' });
    const from = range.from;
    from.setFullYear(1999);
    expect(range.from.getFullYear()).toBe(2026);
  });

  it('overlapsWith returns true when ranges overlap', () => {
    const range1 = new DateRange({ from: '2026-01-01', to: '2026-01-10' });
    const range2 = new DateRange({ from: '2026-01-05', to: '2026-01-15' });
    expect(range1.overlapsWith(range2)).toBe(true);
    expect(range2.overlapsWith(range1)).toBe(true);
  });

  it('overlapsWith returns false when ranges do not overlap', () => {
    const range1 = new DateRange({ from: '2026-01-01', to: '2026-01-10' });
    const range2 = new DateRange({ from: '2026-01-10', to: '2026-01-20' });
    expect(range1.overlapsWith(range2)).toBe(false);
    expect(range2.overlapsWith(range1)).toBe(false);
  });
});
