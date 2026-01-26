import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createBooking } from '../src/domain/application/use-cases/createBooking.js';
import { cancelBooking } from '../src/domain/application/use-cases/cancelBooking.js';
import { DomainError } from '../src/domain/errors/DomainError.js';

import { createDemoStore } from './store.js';
import { roomView, bookingView } from './view.js';

/**
 * Demo UI adapter
 * - Exposes a minimal REST API for the booking domain
 * - Serves a static HTML/JS frontend for interaction
 * - Separates domain logic and presentation
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Controlled in-memory state for demo purposes, can be resetted between requests
const store = createDemoStore();

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')));

// Health [Debugging]
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/rooms', (req, res) => {
  const rooms = store.listRooms();
  res.json(rooms.map(roomView));
});

app.post('/api/bookings', (req, res) => {
  try {
    const booking = createBooking(req.body, store);
    res.status(201).json(bookingView(booking));
  } catch (err) {
    if (err instanceof DomainError) {
      res.status(400).json({ type: 'DOMAIN_ERROR', message: err.message });
      return;
    }
    res
      .status(500)
      .json({ type: 'INTERNAL_ERROR', message: 'Unexpected error' });
  }
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  try {
    const booking = cancelBooking(
      { bookingId: req.params.id, isAdmin: Boolean(req.body?.isAdmin) },
      store
    );
    res.json(bookingView(booking));
  } catch (err) {
    if (err instanceof DomainError) {
      res.status(400).json({ type: 'DOMAIN_ERROR', message: err.message });
      return;
    }
    res
      .status(500)
      .json({ type: 'INTERNAL_ERROR', message: 'Unexpected error' });
  }
});

/**
 * Resetter endpoint for demo purposes
 * - Resets the in-memory store to initial state
 */
app.post('/api/reset', (req, res) => {
  console.log('RESET DEMO');
  store.reset();
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 5050);
app.listen(port, () => {
  console.log(`Demo UI running on http://localhost:${port}`);
});
