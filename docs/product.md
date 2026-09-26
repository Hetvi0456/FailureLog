# Product Specification: FailureLog

## Problem Statement
Developers frequently encounter runtime errors, configuration issues, and bugs. During the debugging process, they try multiple approaches, encounter various secondary failures, and eventually find a resolution. However, over time, developers forget the precise root cause and solution. When the same or a similar error occurs again, they waste valuable time debugging from scratch.

## Target User
Individual software developers who want a personal knowledge base to document, track, and recall debugging attempts, root causes, and verified solutions across their projects.

## Core Use Case
When encountering a bug, a developer opens FailureLog to:
1. Search if a similar error has been logged previously and review what worked.
2. If new, log the error details (project, tech stack, environment, error message).
3. Log individual debugging attempts (what was tried, what failed, what happened).
4. Upon resolving the bug, record the root cause and final working solution, marking the status as resolved.

## User Flow
1. **Login/Register**: User authenticates into FailureLog.
2. **Dashboard Overview**: User views recent failures, quick filters, and basic summary stats.
3. **Log a New Failure**: User enters title, error message, project, technology, category, and environment.
4. **Track Attempts**: User appends step-by-step debugging attempts (action, result, notes).
5. **Resolve Failure**: User enters the root cause and final solution, updating status to resolved.
6. **Search & Recall**: User searches across past failures using keywords, technologies, or tags.

## Failure Data Structure

### Failure Entity
* `title`: Short descriptive summary of the error.
* `errorMessage`: Raw or formatted error string / stack snippet.
* `project`: Project name or identifier.
* `technology`: Language, framework, or tools involved (e.g., React, PostgreSQL, Docker).
* `category`: Error classification (e.g., Runtime, Build, DB, Config, Network).
* `environment`: Environment context (e.g., Local Dev, Staging, Production, OS details).
* `rootCause`: Explanation of why the failure occurred.
* `solution`: The definitive working resolution.
* `status`: Status indicator (e.g., `open`, `in_progress`, `resolved`).
* `attempts[]`: Array of `Attempt` entries.
* `createdAt`: Timestamp when failure was logged.
* `updatedAt`: Timestamp when failure record was last modified.
* `resolvedAt`: Timestamp when marked resolved.

### Attempt Entity
* `action`: Action taken or experiment performed.
* `result`: Outcome of the attempt (e.g., error persisted, new error, partial success).
* `notes`: Additional observations or context.
* `timestamp`: Timestamp when the attempt was logged.

## MVP Scope
1. **Authentication**: Login and Registration.
2. **Dashboard**: Central summary view of failures.
3. **Create Failure**: Form to log a new failure entry.
4. **View Failure**: Detailed page showing failure parameters and timeline of attempts.
5. **Edit Failure**: Update failure information.
6. **Delete Failure**: Remove unwanted failure records.
7. **Record Debugging Attempts**: Append step-by-step attempts to an existing failure.
8. **Mark Failure as Resolved**: Set status to resolved along with root cause and final solution.
9. **Search Failures**: Text search across title, error message, project, and tech.
10. **Filter Failures**: Filter by status, project, category, technology.
11. **Basic Statistics**: Total failures, resolution rate, top technologies/categories.

## Future Ideas (Out of MVP Scope)
* AI-assisted diagnosis & auto-suggested solutions
* Vector database & semantic vector search
* Code embeddings for stack trace context matching
* Advanced analytics & debugging trends
* Team collaboration, sharing, and social features
* Push & email notifications
* Microservice architecture
