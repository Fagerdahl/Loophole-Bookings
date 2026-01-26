import { InMemoryRoomStore } from './inMemoryRoomStore.js';
import { Room } from '../src/domain/entities/Room.js';

/**
 * DEMO STORE for demo purposes
 * This file owns the demo lifecycle (seed + reset)
 * Can be resettable between demo runs or requests (for UI server)
 *
 * Important:
 * - The InMemoryRoomStore itself contains no demo logic.
 * - Reset functionality is intentionally placed here to avoid polluting the infrastructure layer.
 *
 * Why this matters in the exam:
 * - Demonstrates separation of concerns.
 * - Shows how the same infrastructure can be reused
 *   in tests, demos and other adapters.
 */

export function createDemoStore() {
  const buildRoomStore = () =>
    new InMemoryRoomStore([
      // Bookings: [] is ALWAYS required to avoid undefined, This is correct initialization of aggregaete root
      new Room({ id: 'room-1', capacity: 2, bookings: [] }),
      new Room({ id: 'room-2', capacity: 4, bookings: [] }),
    ]);

  let roomStore = buildRoomStore();

  return {
    listRooms: () => roomStore.listRooms(),
    getRoomById: (id) => roomStore.getRoomById(id),
    saveRoom: (room) => roomStore.saveRoom(room),
    reset: () => {
      roomStore = buildRoomStore();
    },
  };
}
