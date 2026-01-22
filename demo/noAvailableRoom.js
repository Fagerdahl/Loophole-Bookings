import { Room } from '../src/domain/entities/Room.js';
import { createBooking } from '../src/domain/application/use-cases/createBooking.js';
import { InMemoryRoomStore } from './store.js';
import { bookingView } from './utils.js';

/**
 * Demo 5.4 UC1 - Create Booking (no available room)
 * Goal:
 * - Demonstrate that a booking is denied when no room is available
 *   due to overlapping dates.
 */

const main = () => {
  const roomId = 'room-1';

  const store = new InMemoryRoomStore([
    Room.create({ id: roomId, capacity: 2 }),
  ]);

  // Create a booking that occupies the room
  const firstBooking = createBooking(
    { from: '2026-02-01', to: '2026-02-03', guests: 2 },
    store,
    { idGenerator: () => 'demo-booking-uc1-occupied-001' }
  );

  console.log('📌 First booking created');
  console.log(bookingView(firstBooking));

  // Try overlapping booking (expected to fail)
  console.log('🔒 Rule: room must be available (no overlapping bookings)');

  try {
    createBooking({ from: '2026-02-02', to: '2026-02-04', guests: 1 }, store, {
      idGenerator: () => 'demo-booking-uc1-overlap-002',
    });

    throw new Error('Expected booking to be denied, but it succeeded.');
  } catch (error) {
    console.log('✅ Booking denied as expected');
    console.log(`❌ ${error.name}: ${error.message}`);
  }

  // Outcome check
  const roomAfter = store.getRoomById(roomId);
  console.log('📌 Outcome check');
  console.log(
    `✅ Active bookings in room: ${roomAfter.bookings.length} (expected: 1)`
  );
};

try {
  main();
} catch (error) {
  console.error('❌ Demo failed (UC1 no availability)');
  console.error(`${error.name}: ${error.message}`);
  process.exitCode = 1;
}
