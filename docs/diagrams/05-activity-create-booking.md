## Activity Diagram - UC1 Create Booking

```mermaid
flowchart TD
  A([Start]) --> B[Validate booking input]
  B --> C{Valid date range?}
  C -- No --> X[Return domain error]
  X --> Z([End])

  C -- Yes --> D[Check availability]
  D --> E{Room available?}
  E -- No --> Y[Reject booking - unavailable]
  Y --> Z([End])

  E -- Yes --> F[Create Booking entity]
  F --> G[Set status = CREATED]
  G --> H[Store booking in memory]
  H --> I[Return confirmation + bookingId]
  I --> Z([End])

