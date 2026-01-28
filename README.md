# Development of an independent Booking System

_Designing a Booking Domain Resilient to Technology Changes_

This repository contains my thesis project, “Loophole” which focuses on isolating, implementing and testing the core domain logic for a booking system.
**The name Loophole comes from my attempt to find a way around the limitations I encountered when trying to build a flexible booking solution within the constraints of a CMS**

The project does **not** aim to deliver a full production system.  
Instead, it demonstrates how a booking domain can be designed to remain robust and reusable even when user interfaces, frameworks or infrastructure around it changes.

**Technology is a tool. Design is the goal.**

## 🎯 Project Purpose

The purpose of this project is to explore and demonstrate:

- How business rules can be modeled as a standalone domain
- How to prevent invalid states through domain modeling
- How to separate domain logic from UI, API, and persistence
- How automated tests can verify domain rules independently
- How the same booking core can be reused by different clients

The booking logic is intentionally **framework-agnostic** and **infrastructure-independent**.

---

## 🧠 Core Design Principles

- Domain-first design
- Clear separation of concerns
- Explicit business rules
- Replaceable UI and infrastructure
- Test-driven verification of domain behavior

The domain is treated as the **single source of truth**.

---

## 🏗️ Architecture Overview

The system follows a layered architecture with strict dependency rules:
Demo UI (HTML / CSS / JS)
↓
API Adapter (Express)
↓
Application Layer (Use Cases)
↓
Domain Layer (Entities, Value Objects, Rules)

### Dependency Rule

- Outer layers may depend on inner layers
- The domain layer depends on **nothing**

This ensures long-term maintainability and adaptability.

---

## 📂 Project Structure

LOOPHOLE-BOOKINGS/
├─ .husky/ # Git hooks (quality gate: format/test pre commit)
├─ .vscode/ # VS Code workspace settings (for teams)
│
├─ demo/ # Demo UI + demo-scenarion (Runs in memory)
│ ├─ public/ # Static frontend (UI)
│ │ ├─ index.html # UI entry
│ │ ├─ app.js # UI orchestration only (fetch -> render)
│ │ └─ styles.css # UI styling
│ ├─ ui-server.js # Express adapter: exposes use cases via HTTP
│ ├─ store.js # Demo state: seed/reset in memory
│ ├─ inMemoryRoomStore.js # In-memory persistence for RoomStore (adapter-like)
│ ├─ view.js # Domain -> UI mapping (roomView/bookingView)
│ ├─ utils.js # Small helpers (parse/format etc)
│ ├─ createBooking.js # Demo-scenario: UC1 Create booking
│ ├─ cancelBooking.js # Demo-scenario: UC2 Cancel booking
│ ├─ noAvailableRoom.js # Demo: shows “ingen tillgänglighet”
│ └─ denyUnauthorizedCancel.js # Demo: shows domain rule -> DomainError
│
├─ src/
│ └─ domain/ # “Core” (clean, testable, technically independent logic)
│ ├─ application/ # Orchestration (use cases), no business rules.
│ │ ├─ ports/
│ │ │ └─ RoomStore.js # Port/abstraction (dependency-inversion)
│ │ └─ use-cases/
│ │ ├─ createBooking.js # UC1
│ │ └─ cancelBooking.js # UC2
│ │
│ ├─ entities/ # Entities/Aggregates (identity + behaviour)
│ │ ├─ Room.js # Aggregate root (owns booking rules + availability)
│ │ └─ Booking.js # Entity (status, guests, dateRange)
│ │
│ ├─ value-objects/ # Immutable, validates invariants during creation
│ │ ├─ DateRange.js # from/to + validation
│ │ └─ BookingStatus.js # Enum-like status (CREATED/CANCELLED)
│ │
│ └─ errors/
│ └─ DomainError.js # Domainspecific error (mapped to 400 in adapters)
│
├─ tests/ # Unit tests (Vitest) - verifies the domain rules
│ ├─ application/
│ │ ├─ CreateBooking.test.js
│ │ └─ CancelBooking.test.js
│ └─ domain/
│ ├─ Booking.test.js
│ ├─ Room.test.js
│ ├─ RoomAvailability.test.js
│ ├─ DateRange.test.js
│ └─ DomainError.test.js
│
├─ package.json
└─ README.md
└─ demo-instruktioner-svenska.md # DEMO INSTRUCTIONS FOR MY SWEDISH OPPONENTS

## 📌Important future issue: The codebase is structured into layers (Domain and Application)

but both are located under src/domain/ in this repository to keep the thesis project compact.
The use cases are located in src/domain/application/use-cases/and are responsible for orchestration only,- not for implementing business rules.

!!This should definitely be refactored in the future to better align with clean architecture- and DDD principles!!

---

# 👹DEMONSTRATION

▶️ Running the Demo UI
_Start the demo server:_ npm run demo:ui
= The server runs on: http://localhost:5050

_Health check:_ GET /api/health
=> Proves that:

1. Express routing works
2. The demo server is running correctly

_Rooms endpoint:_ GET /api/rooms
=> Proves that:

1. Room seeding works
2. listRooms from the domain is used
3. roomView mapping produces UI-safe output

🔁 Implemented Use Cases
UC1 - Create Booking:

- Validates date range
- Checks room availability
- Creates a booking with status CREATED
- Returns a domain error if rules are violated

UC2 - Cancel Booking:

- Admin-only rule (authentication is out of scope)
- Prevents double cancellation
- Updates booking status to CANCELLED

🧪 Testing Strategy
All business rules are verified using automated tests (Vitest).
Tests describe domain behavior, not implementation details

Each rule is tested with:

- At least one valid scenario
- At least one invalid scenario

This enables:

1. Safe refactoring
2. Fast feedback
   High assurance in domain behavioural correctness

🚧 Scope & Limitations
In scope:

- Create booking
- Cancel booking
- Availability checks
- Booking status transitions
- Domain error handling

Out of scope:

- Authentication & authorization
- Persistent database
- Pricing rules
- Admin dashboards
- Full WordPress integration
  _These features are documented conceptually but not implemented_

🔮 Future Extensions
Without changing the domain logic, the system could be extended to support:

- PostgreSQL persistence
- WordPress or CMS integration
- REST or GraphQL APIs
- Mobile or SPA frontends
- Java / Spring Boot implementations

🎓 Academic Context
This project was developed as part of a thesis in System Development, with focus on:

- Object-Oriented Analysis & Design (OOAD)
- Domain-Driven Design (DDD)
- Clean Architecture principles
- Test-driven development

✨ Final Note
This project is not about building a UI.
It is about proving that good domain design survives along way into the future.

---

⏯️ Demo UI
The project includes a small demo UI exposed through an Express server.
The purpose of the demo is to visualize how the domain use cases behavewhen accessed through an HTTP-based presentation layer.

The demo UI:

- Uses the same application-layer use cases as the CLI demos
- Runs entirely in memory
- Can be reset to a known state between demonstrations

🎬 How to Demo the Project (5 minutes)
This demo is designed to prove the architecture and domain design, not UI polish.
The goal is to show that:

1. the domain works
2. the UI is passive
3. Business rules live outside the presentation layer

1️⃣ Start the Demo (30 seconds)
npm install
npm run demo:ui
_The demo server starts on: http://localhost:5050_

"-The demo runs entirely in memory. No database, no external services.
This allows demonstration of domain behavior in a controlled and repeatable way!"

2️⃣ Verify Infrastructure Is Alive (30 seconds)
Open in browser or Postman:
GET http://localhost:5050/api/health

Expected result:
HTTP 200
Simple health response

"-This endpoint only proves that Express routing works and that the demo adapter is running.
No business logic is involved here!"

3️⃣ Show Seeded Rooms (30 seconds)
GET http://localhost:5050/api/rooms

Rooms are seeded in-memory
Returned via application → domain → view mapper
UI never accesses domain objects directly

“-This is proof that the UI consumes mapped views, not the actual domain entities!”

4️⃣ Create a Booking - Happy Path (1 minute)
Open the Demo UI in the browser: http://localhost:5050

Steps:

1. Enter a valid date range
2. Enter number of guests
3. Click Create Booking

Expected result:

1. Booking is created
2. Status = CREATED
3. Booking data is rendered in the UI

“-This UI only collects input and displays the result.
Validation, availability checks and state transitions are all inside the domain!”

5️⃣ Create a Booking - Invalid Case (1 minute)

1. Try one of the following:
2. Overlapping date range
3. Too many guests
4. Invalid date range

Expected result:

1. Booking is rejected
2. Domain error message is returned and displayed

“The UI is NOT responsible for what is valid.
It simply renders the error returned by the domain!”

“If this UI would be replaced with WordPress, a mobile app or a CLI, the behavior would be identical!”

6️⃣ Cancel a Booking (1 minute)

1. Use an existing booking ID
2. Trigger Cancel Booking

Expected result:

1. Booking status changes to CANCELLED
2. Room becomes available again

“Cancellation of a booking is implemented as a domain rule.
Authentication is assumed, but authorization logic itself is out of scope!”

7️⃣ Prove Rule Enforcement (1 minute)
Attempt to:

1. Cancel the same booking again
2. Cancel without admin context (if demo endpoint exists)

Expected result:

1. Domain error
2. No state corruption

“Invalid state transitions are prevented inside the domain.
The system cannot enter an illegal state!”

🎯 Final Summary (30 seconds)

“This demo proves that the booking domain is isolated, testable and reusable.
The UI is only a consumer.
The design survives technology changes because the rules live in one place = the domain!”

🧠 What This Demo Is Not

- _Not a production UI_
- _Not a full booking system_
- _Not feature-complete_

## It is: A controlled proof of correct domain design!
