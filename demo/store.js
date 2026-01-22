/**
 * Implementation of in-memory RoomStore
 *
 * Purpose:
 * - Used exclusively for demos and tests.
 * - Mimics a persistence layer without involving a database or API.
 *
 * Why this matters in the exam:
 * - Demonstrates that the application layer depends on abstractions,
 *   not concrete infrastructure.
 * - Makes the domain logic fully testable and demoable in isolation.
 */

export class InMemoryRoomStore {
  #rooms;

  constructor(rooms = []) {
    // Copy the array to avoid external mutation of internal state
    this.#rooms = rooms;
  }

  /**
   * Returns all rooms in the store.
   * Note:
   * - Returns a shallow copy to protect internal state.
   * - Rooms themselves are immutable aggregate roots.
   */
  listRooms() {
    return [...this.#rooms];
  }

  /**
   * Fetch a single room by id.
   * Used in demos to verify state after a use case has run.
   */
  getRoomById(id) {
    return this.#rooms.find((r) => r.id === id);
  }

  /**
   * Persist an updated Room aggregate.
   * In a real system this would be a database update.
   * Here we simply replace the room in memory.
   */
  saveRoom(updatedRoom) {
    const exists = this.#rooms.some((r) => r.id === updatedRoom.id);
    if (!exists) {
      throw new Error(`Room not found: ${updatedRoom.id}`);
    }
    this.#rooms = this.#rooms.map((r) =>
      r.id === updatedRoom.id ? updatedRoom : r
    );
  }
}
