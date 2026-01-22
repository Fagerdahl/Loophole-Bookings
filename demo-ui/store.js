import { Room } from '../src/domain/entities/Room.js'; // From domain layer
import { InMemoryRoomStore } from '../demo/store.js'; // From demo layer

/**
 * Starting point for demo-UI:
 * - Uses the same in-memory store concept as the CLI demos.
 * - Server restart resets state (intentional for demo).
 */

export const createDemoStore = () =>
  new InMemoryRoomStore([
    Room.create({ id: 'room-1', capacity: 2 }),
    Room.create({ id: 'room-2', capacity: 4 }),
  ]);
