## High-Level architecture - Core vs Adapters to clarify my scope

```mermaid
flowchart LR
  UI["Demo UI\n(presentation only)"] --> API["API Adapter (thin layer)"]
  API --> Core["Domain Core (book-rules)"]
  Core --> Store["In-memory Store (testable)"]

  subgraph OutOfScope["Out of scope"]
    CMS["CMS / WordPress"]
    DB[(Database)]
    Pricing["Pricing / Seasons"]
    Auth["Authentication"]
    Email["Email notifications"]
    AdminUI["Admin panel"]
  end

