import { Room } from '../src/domain/entities/Room.js';
import { createBooking } from '../src/domain/application/use-cases/createBooking.js';
import { InMemoryRoomStore } from './inMemoryRoomStore.js';
import { bookingView } from './utils.js';

/**
 * Demo 5.1 UC1 - Create Booking
 * Goal:
 * - Show that a booking can be created.
 * - Make the outcome crystal clear in CLI: CREATED.
 */

const main = () => {
  // In-memory store keeps demo deterministic and isolated, it is seeded with some Room aggregate root instances
  const store = new InMemoryRoomStore([
    Room.create({ id: 'room-1', capacity: 2 }),
    Room.create({ id: 'room-2', capacity: 4 }),
  ]);

  const bookingInput = {
    from: '2026-02-01',
    to: '2026-02-03',
    guests: 2,
  };

  const booking = createBooking(bookingInput, store, {
    idGenerator: () => 'demo-booking-uc1-001',
  });

  console.log('✅ Booking created (UC1)');
  console.log(bookingView(booking));
};

try {
  main();
} catch (error) {
  console.error('❌ Demo failed (UC1)');
  console.error(error?.message ?? error);
  process.exitCode = 1;
}
