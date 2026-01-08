# SCOPE Definition

## Purpose

Here I clarify the scope of the thesis implementation to ensure that the work remains focused only on domain logic and OOAD principles rather than technical layers and complex system infrastructure.

## OOAD Context

### Related Requirements:

### Functional:

- FR1 - (UC1)
- FR2 - (UC1)
- FR3 - (UC1)
- FR4 - (UC1)
- FR5 - (UC2)
- FR6 - (UC2)

### Non-Functional:

- NFR1 (Isolation)
- NFR4 (Maintainability)

### Related Use Cases:

- UC1 – Create Booking
- UC2 – Cancel Booking

Related Epic: EPIC A – Project Setup & Scope

### Description

This section defines what functionality is included in the thesis implementation and what is intentionally excluded.
The defined scope must be consistent with the UML diagrams, project board epic and the implemented code.

The purpose of this scope definition is to limit the technical complexity and allow the work to focus on modeling, implementing and verifying core booking domain rules.

# In Scope

_The following functionality is included in the thesis implementation:_

- Availability rules based on date intervals

- Creation of bookings

- Cancellation of bookings (admin-only)

- Booking status handling and state transitions

- Unit tests verifying domain rules

## Out of Scope

_The following parts are explicitly excluded from the thesis implementation:_

- WordPress integration

- Database persistence

- Pricing rules and seasonal logic

- Admin user interface

- Email notifications

- Authentication, authorization and HTTPS configuration

!These aspects are considered surrounding infrastructure and are therefore outside the scope of thesis implementation!

## Verification

The scope is verified by reviewing that:

- UML diagrams only model in-scope functionality

- Implemented modules correspond to the defined scope

- Project board epics and issues do not include excluded functionality
