/**
 * In-memory implementation of a RoomStore.
 *
 * Acts as a fake persistence layer for demos and tests.
 * Replaces a real database while keeping the domain logic unchanged.
 *
 * Key purposes:
 * - Stores Room aggregates in memory.
 * - Does not contain any domain rules.
 * - Does not know anything about demo lifecycle or reset.
 *
 * This design allows the application and domain layers
 * to depend on abstractions rather than concrete infrastructure.
 */

export class InMemoryRoomStore {
  #rooms;

  constructor(rooms = []) {
    // Copy the array to avoid external mutation of internal state
    this.#rooms = [...rooms];
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
