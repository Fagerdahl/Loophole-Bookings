# Definition of Done (DoD)

_is used in this project to ensure that all implemented functionality is verified, tested and documented before being considered complete and merged to main branch. This supports traceability between requirements, UML models, implementation and tests - and aligns the development process with OOAD methodology_

<strong>Purpose</strong>
The Definition of Done defines the criteria that must be fulfilled before an issue is considered complete.
It ensures that all work in this thesis project is implemented, verified and documented in a consistent and traceable fashion.

The DoD is used to maintain quality, enforce scope boundaries and support the Object-Oriented Analysis and Design (OOAD) process.

## General Definition of Done (applies to all issues)

An issue may only be moved to Done when all of the following conditions are met:

## 1. Scope and Traceability

The issue follows the defined issue template.

Related Requirements (FR/NFR), Use Cases (UC) and Epic are clearly specified.

The work performed is within the defined thesis scope.

<string>No out-of-scope functionality (UI, API, database, authentication, etc.) has been introduced.</strong>

## 2. Acceptance Criteria

All Acceptance Criteria defined in the issue are fulfilled.

If scope or behavior changes during implementation, the Acceptance Criteria are updated accordingly.

## 3. Implementation Quality (Code-related issues)

Code is placed in the correct layer (src/core/ for domain logic).

Domain logic is free from UI, API, or persistence concerns.

Naming is consistent with the domain model and UML diagrams.

No unresolved TODOs affect the functionality.

## 4. Verification and Testing

All domain logic is verified by appropriate tests.

Tests are deterministic and do not rely on external systems or current dates.

All tests pass successfully (npm test).

Tests clearly verify the behavior described in the issue.

## 5. Documentation and Diagrams

Relevant documentation or diagrams are updated and consistent with the implementation.

Files are stored in the appropriate location (docs/).

Diagrams accurately reflect the current domain logic and use cases.

## 6. Version Control Hygiene

Changes are committed with a clear and descriptive commit message.

No unintended or temporary files are included in the commit.

Additional DoD per Issue Type

### Diagram Issues (EPIC B)

The diagram matches the related use case and requirements.

The diagram uses the same domain terminology as the code.

No out-of-scope components appear in the diagram.

### Test Issues (EPIC F)

Test names clearly describe the rule or behavior being verified.

Both valid and invalid scenarios are tested where applicable.

Tests run without additional configuration or manual steps.

### Demo Issues (EPIC G - Optional)

The demo is executable using a simple Node.js command.

The demo illustrates a domain use case without UI or API layers.

Output clearly demonstrates the result of the use case.

### Final Rule

"Done" means verified and documented - not just implemented!

This Definition of Done is applied consistently throughout the project to ensure quality, traceability and alignment with the thesis requirements.
