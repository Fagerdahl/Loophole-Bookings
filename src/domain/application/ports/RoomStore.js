/** Application layer depends on this agreement/abstraction, not on a particular DB.
 * This contract makes it possible to swap implementations without affecting the application logic.
 *
 * This is an agreement for what methods the use case 1 needs from the persistence layer.
 * Methods:
 * listRooms: () => Room[]
 * saveRoom: (updatedRoom: Room) => void
 *
 * All RoomStore objects has to have a property
 * called 'listRooms' and 'saveRoom' as defined below.
 *
 * @typedef {Object} RoomStore
 * @property {() => import('../../domain/entities/Room.js').Room[]} listRooms
 * @property {(room: import('../../domain/entities/Room.js').Room) => void} saveRoom
 */

// ES-module scope
export {};
