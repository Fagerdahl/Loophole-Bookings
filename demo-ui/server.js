/**
 * Demo UI API adapter
 * Responsibility:
 * - Expose UC1/UC2 through a minimal HTTP API for the demo UI.
 * - Keep domain rules in the domain layer (DomainError -> 400).
 * - Keep demo state in-memory (resettable).
 */

import express from 'express';

/**
 * Application layer use cases.
 * These orchestrate domain logic but do not contain business rules.
 */
import { createBooking } from '../src/domain/application/use-cases/createBooking.js';
import { cancelBooking } from '../src/domain/application/use-cases/cancelBooking.js';

/**
 * Needed to be able to map domain errors to HTTP responses
 */
import { DomainError } from '../src/domain/errors/DomainError.js';

/**
 * Demo infrastructure.
 * Initializes a controlled in-memory state for the UI demo.
 */
import { createDemoStore } from './store.js';

/**
 * View mappers.
 * Used to expose UI-safe representations of domain objects.
 */
import { bookingView, roomView } from './view.js';

const app = express();

/**
 * The demo runs on a fixed port by default.
 * This can be overridden through an environment variable.
 */
const port = Number(process.env.DEMO_UI_PORT ?? 5081);

/**
 * In-memory demo state.
 * This store is intentionally ephemeral:
 * - Restarting the server resets all data
 * - This keeps the demo predictable and easy to reason about
 */
let store = createDemoStore();

/**
 * Enable JSON request bodies.
 * Required for POST requests to UC1 and UC2.
 */
app.use(express.json());

/**
 * Health endpoint.
 * Used to verify that the demo server is running.
 * Does not depend on domain logic.
 */
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

/**
 * Returns the current demo state in a UI-friendly format.
 * Domain entities are mapped to view models before being exposed.
 */
app.get('/api/state', (req, res) => {
  res.json({ rooms: store.listRooms().map(roomView) });
});

/**
 * Resets the demo state by re-initializing the in-memory store.
 * This avoids mutating existing aggregates and keeps the demo simple.
 */
app.post('/api/reset', (req, res) => {
  store = createDemoStore();
  res.json({ ok: true, rooms: store.listRooms().map(roomView) });
});

/**
 * UC1 - Create booking
 * Expected body:
 * {
 *   from: string (YYYY-MM-DD),
 *   to: string (YYYY-MM-DD),
 *   guests: number
 * }
 * All validation and business rules are enforced by the domain layer.
 */
app.post('/api/bookings', (req, res) => {
  try {
    const { from, to, guests } = req.body ?? {};
    const booking = createBooking({ from, to, guests }, store);

    res.status(201).json({ booking: bookingView(booking) });
  } catch (error) {
    /**
     * Domain rule violations are mapped to HTTP 400.
     * Unexpected errors result in HTTP 500.
     */
    const status = error instanceof DomainError ? 400 : 500;
    res.status(status).json({
      error: {
        name: error?.name ?? 'Error',
        message: error?.message ?? String(error),
      },
    });
  }
});

/**
 * UC2 - Cancel booking
 * Expected body:
 * {
 *   isAdmin: boolean
 * }
 * Authorization rules are enforced inside the domain.
 */
app.post('/api/bookings/:bookingId/cancel', (req, res) => {
  try {
    const { bookingId } = req.params;
    const { isAdmin } = req.body ?? {};

    const booking = cancelBooking({ bookingId, isAdmin }, store);

    res.json({ booking: bookingView(booking) });
  } catch (error) {
    const status = error instanceof DomainError ? 400 : 500;
    res.status(status).json({
      error: {
        name: error?.name ?? 'Error',
        message: error?.message ?? String(error),
      },
    });
  }
});

/**
 * Catch-all for unknown API endpoints under /api.
 * Returns HTTP 404 with a helpful message.
 */
app.use('/api', (req, res) => {
  res.status(404).json({
    error: {
      name: 'NotFound',
      message: `No such endpoint: ${req.method} ${req.originalUrl}`,
    },
  });
});

/**
 * Start the demo server.
 * Logging the available endpoints makes the demo easier to explore.
 */
app.listen(port, () => {
  console.log(`Demo UI API running on http://localhost:${port}`);
  console.log(`- GET  /health`);
  console.log(`- GET  /api/state`);
  console.log(`- POST /api/bookings`);
  console.log(`- POST /api/bookings/:bookingId/cancel`);
  console.log(`- POST /api/reset`);
});
