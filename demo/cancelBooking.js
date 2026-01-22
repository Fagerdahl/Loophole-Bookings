import { Room } from '../src/domain/entities/Room.js';
import { createBooking } from '../src/domain/application/use-cases/createBooking.js';
import { cancelBooking } from '../src/domain/application/use-cases/cancelBooking.js';
import { InMemoryRoomStore } from './store.js';
import { bookingView } from './utils.js';

/** Demo 5.2 UC2 - Cancel Booking (admin)
 * Goal: Show a clear state transition: CREATED -> CANCELLED.
 * Prove domain rules are enforced correctly
 */

const main = () => {
  // In-memory store keeps demo deterministic and isolated, it is seeded with one Room aggregate root instance
  const store = new InMemoryRoomStore([
    Room.create({ id: 'room-1', capacity: 2 }),
  ]);

  // Create a booking (UC1)
  const bookingInput = {
    from: '2026-02-01',
    to: '2026-02-03',
    guests: 2,
  };

  const booking = createBooking(bookingInput, store, {
    idGenerator: () => 'demo-booking-uc2-001',
  });

  console.log('✅ Booking created');
  console.log(bookingView(booking));

  // Cancel the booking as admin (UC2). Authorization is enforced in the domain (Room.cancelBooking).
  const cancelled = cancelBooking(
    { bookingId: booking.id, isAdmin: true },
    store
  );

  console.log('📌 Booking cancelled');
  console.log(bookingView(cancelled));
};

try {
  main();
} catch (error) {
  console.error('❌ Demo failed (UC2)');
  console.error(`${error?.name ?? 'Error'}: ${error?.message ?? error}`);
  process.exitCode = 1;
}
