Best Practices - Loophole Bookings

## Purpose
Keep the booking domain clean, testable and independent from infrastructure (UI/API/DB)

## Non-negotiables (Project Rules)

Domain code must NOT import anything from Express, UI, DB or Node-only APIs. 

All business rules live in the domain/application layer - never in routes/controllers.

Every rule must be verifiable with unit tests(Vitest).

Keep scope limited to UC1 (Create booking) + UC2 (Cancel booking).

## Architecture (Simple Layers)

Domain: entities/value objects + domain rules (pure logic)

Application: use cases/orchestration (calls domain, coordinates)

Adapters: API / UI / persistence (thin, no business logic)

## Folder structure

src/
  domain/
  application/
  adapters/
  tests/

## Coding Conventions

ES Modules only (import/export), no require.

Prefer const, use let only when necessary.

No “magic strings” for status values -> use BookingStatus.

Prefer small modules: one concept per file.

Keep functions pure where possible.

## Domain Modeling Rules

Use Value Objects for: 
DateRange, BookingStatus

Use Entities for: Booking, Room 
_Entities have an identity and a lifecycle. Booking = status changes over time. 
Room = has identity and capacity._ 

Validate at boundaries:
Value objects validate their own invariants (e.g., DateRange must be valid. 'From' must be before 'To') 

_Value object = Invalid states are prevented in the creation of an object- which simplifies the domain logic. The object protects itself_

Use cases validate request input (e.g., missing fields) before calling domain

## Error Handling (Domain Errors)

Use explicit errors (no generic Error for domain rules long-term).

Rule violations should throw a domain error type with a clear message.

Tests must assert on error type/message.

(Start simple with Error, introduce domain errors when C.5 is picked up.)

## Testing Rules (Vitest)

Tests describe rules, not implementation details.

Naming: should <behavior> when <condition>

Each rule gets at least one test:

valid case

invalid case (throws)

Example:

should reject booking when date range overlaps existing booking

## Definition of Done (for a domain issue)

An issue is DONE when:

Code matches the domain model (names/structure)

Tests are green

No infrastructure dependency leaked into domain

The change is small and readable (no “mega commit”)

## Anti-patterns to avoid

Putting business rules in Express routes/controllers

Coupling domain to database models/ORM

Passing raw objects everywhere instead of value objects

Adding scope (“pricing”, “admin UI”, “auth”) before core rules are verified

## Scope Reminder

In scope:

- Create booking

- Cancel booking (admin-only rule as a business rule, auth itself is out of scope)

- Status transitions

- Availability / overlap checks

_Out of scope:_

- _Full WordPress integration_

- _Authentication system_

- _Pricing engine_

- _Admin UI_

- _Next Steps_

### Start with:

- BookingStatus

- DateRange

- Tests

- Then build Room and Booking

