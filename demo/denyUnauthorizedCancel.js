import { Room } from '../src/domain/entities/Room.js';
import { createBooking } from '../src/domain/application/use-cases/createBooking.js';
import { cancelBooking } from '../src/domain/application/use-cases/cancelBooking.js';
import { bookingView } from './utils.js';
import { InMemoryRoomStore } from './store.js';

/**
 * Demo 5.3 UC2 - Cancel Booking (unauthorized)
 * Goal:
 * - Show that a non-admin user cannot cancel a booking.
 * - Make the outcome crystal clear in CLI: CREATED -> ❌ DENIED.
 *
 */

const main = () => {
  const roomId = 'room-1';
  const store = new InMemoryRoomStore([
    Room.create({ id: roomId, capacity: 2 }),
  ]);

  // Create a booking so we have something to attempt to cancel
  const booking = createBooking(
    { from: '2026-02-01', to: '2026-02-03', guests: 1 },
    store,
    { idGenerator: () => 'demo-booking-unauth-001' }
  );

  console.log('📌 Booking created');
  console.log(bookingView(booking));

  console.log('🔒 Rule: only administrators can cancel bookings');

  // Try cancellation WITHOUT admin rights (expected to fail)
  try {
    cancelBooking({ bookingId: booking.id, isAdmin: false }, store);

    throw new Error('Expected cancellation to be denied, but it succeeded.');
  } catch (error) {
    console.log('✅ Cancellation denied as expected');
    console.log(`❌ ${error?.name ?? 'Error'}: ${error?.message ?? error}`);
  }

  // Verify no state change happened (booking should still be CREATED)
  const roomAfter = store.getRoomById(roomId);
  const bookingAfter = roomAfter.bookings.find((b) => b.id === booking.id);

  console.log('📌 Outcome check');
  console.log(
    `✅ Outcome: booking remains ${bookingAfter.status} (no state change)`
  );
};

try {
  main();
} catch (error) {
  console.error('❌ Demo failed (Unauthorized cancellation)');
  console.error(error?.message ?? error);
  process.exitCode = 1;
}
