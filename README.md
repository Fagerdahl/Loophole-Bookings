# Loophole-Bookings

This repository contains my thesis project, “Loophole” which focuses on isolating, implementing and testing the core domain logic for a booking system.

## Demo UI

The project includes a small demo UI exposed through an Express server.
The purpose of the demo is to visualize how the domain use cases behavewhen accessed through an HTTP-based presentation layer.

The demo UI:

- Uses the same application-layer use cases as the CLI demos
- Runs entirely in memory
- Can be reset to a known state between demonstrations

npm run demo:ui
http://localhost:5050/api/health => Proves that express routing works
http://localhost:5050/api/rooms => Rooms endpoint proves that seed, listRooms and roomView mapper works correctly
