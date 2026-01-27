/**
 * Behaviour of the demo application server. This is the JS that runs inte the webb-browser.
 * Demo UI will use these endpoints to interact with the demo store:
 * GET /api/rooms
 * POST /api/bookings body: { from, to, guests }
 * POST /api/bookings/:id/cancel body: { isAdmin }
 * POST /api/reset
 * POST /api/demo/seed-no-availability
 */

// Simple query selector helper
const $ = (sel) => document.querySelector(sel);

const state = {
  rooms: [],
  lastCreatedBookingId: null,
  lastCreatePayload: null,
};

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? `HTTP ${res.status}`;
    const type = data?.type ?? 'UNKNOWN';
    const err = new Error(message);
    err.type = type;
    err.status = res.status;
    throw err;
  }

  return data;
}

// kind: 'info' | 'ok' | 'error' | 'rule'
function setMessage(kind, text) {
  const el = $('#message');
  el.dataset.kind = kind;
  el.textContent = text;
}

function setLastId(id) {
  state.lastCreatedBookingId = id;
  $('#lastId').textContent = id ?? '—';

  if (id) {
    // Convenience: prefill cancel form with the last created id
    $('#bookingId').value = id;
  }
}

function renderRooms() {
  const container = $('#rooms');

  if (!state.rooms.length) {
    container.innerHTML = `<p class="subtle">No rooms found.</p>`;
    return;
  }

  container.innerHTML = state.rooms
    .map((r) => {
      const bookings = (r.bookings ?? [])
        .map(
          (b) => `
            <li class="booking">
              <code class="id">${b.id}</code>
              <span class="pill" data-status="${b.status}">${b.status}</span>
              <span>${b.from} → ${b.to}</span>
              <span class="subtle">guests: ${b.guests}</span>
            </li>
          `
        )
        .join('');

      return `
        <section class="room">
          <h3>${r.id} <span class="subtle">(capacity: ${r.capacity})</span></h3>
          <ul class="bookings">
            ${bookings || '<li class="subtle">No bookings</li>'}
          </ul>
        </section>
      `;
    })
    .join('');
}

// Synkhronize local state with server state
async function refresh() {
  state.rooms = await api('/api/rooms');
  renderRooms();
}

function readCreatePayloadFromForm() {
  return {
    from: $('#from').value,
    to: $('#to').value,
    guests: Number($('#guests').value),
  };
}

async function onCreateBooking(e) {
  e.preventDefault();
  setMessage('info', 'Creating booking...');

  const payload = readCreatePayloadFromForm();
  state.lastCreatePayload = payload;

  try {
    const booking = await api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setLastId(booking.id);
    setMessage('ok', `Created booking: ${booking.id}`);
    await refresh();
  } catch (err) {
    setMessage(err.type === 'DOMAIN_ERROR' ? 'rule' : 'error', err.message);
  }
}

async function onCreateOverlapping() {
  setMessage('info', 'Creating overlapping booking (expect domain deny)...');

  // Intentionally no extra business logic: we repeat the last create request.
  // If lastCreatePayload does not exist, fall back to current form values.
  const payload = state.lastCreatePayload ?? readCreatePayloadFromForm();

  try {
    const booking = await api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // If it unexpectedly succeeds, we still show it and refresh.
    setLastId(booking.id);
    setMessage('ok', `Unexpectedly created booking: ${booking.id}`);
    await refresh();
  } catch (err) {
    setMessage(err.type === 'DOMAIN_ERROR' ? 'rule' : 'error', err.message);
  }
}

async function onCancelBooking(e) {
  e.preventDefault();
  setMessage('info', 'Cancelling booking...');

  const bookingId = $('#bookingId').value.trim();
  const isAdmin = $('#isAdmin').checked;

  try {
    const booking = await api(
      `/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify({ isAdmin }),
      }
    );

    setMessage('ok', `Cancelled booking: ${booking.id}`);
    await refresh();
  } catch (err) {
    setMessage(err.type === 'DOMAIN_ERROR' ? 'rule' : 'error', err.message);
  }
}

async function onDenyCancel() {
  setMessage('info', 'Attempting cancel as non-admin (expect domain deny)...');

  const bookingId = $('#bookingId').value.trim() || state.lastCreatedBookingId;

  if (!bookingId) {
    setMessage('error', 'No booking id available. Create a booking first.');
    return;
  }

  try {
    const booking = await api(
      `/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify({ isAdmin: false }),
      }
    );

    setMessage('ok', `Unexpectedly cancelled booking: ${booking.id}`);
    await refresh();
  } catch (err) {
    setMessage(err.type === 'DOMAIN_ERROR' ? 'rule' : 'error', err.message);
  }
}

async function onReset() {
  setMessage('info', 'Resetting demo state...');

  try {
    await api('/api/reset', { method: 'POST' });
    state.lastCreatePayload = null;
    setLastId(null);
    $('#isAdmin').checked = false;

    setMessage('ok', 'Demo state reset');
    await refresh();
  } catch (err) {
    setMessage('error', err.message);
  }
}

async function onRefreshClick() {
  setMessage('info', 'Refreshing state...');
  try {
    await refresh();
    setMessage('ok', 'State refreshed');
  } catch (err) {
    setMessage('error', err.message);
  }
}

async function onSeedNoAvailability() {
  setMessage('info', 'Seeding no-availability scenario...');

  try {
    await api('/api/demo/seed-no-availability', {
      method: 'POST',
    });

    setLastId(null);

    setMessage(
      'ok',
      'Demo seeded. Next create booking will be denied by domain rules.'
    );

    await refresh();
  } catch (err) {
    setMessage('error', err.message);
  }
}

$('#createForm').addEventListener('submit', onCreateBooking);
$('#cancelForm').addEventListener('submit', onCancelBooking);
$('#overlapBtn').addEventListener('click', onCreateOverlapping);
$('#denyBtn').addEventListener('click', onDenyCancel);
$('#resetBtn').addEventListener('click', onReset);
$('#refreshBtn').addEventListener('click', onRefreshClick);
$('#seedNoAvailBtn').addEventListener('click', onSeedNoAvailability);

refresh()
  .then(() => setMessage('ok', 'Ready.'))
  .catch((err) => setMessage('error', err.message));
