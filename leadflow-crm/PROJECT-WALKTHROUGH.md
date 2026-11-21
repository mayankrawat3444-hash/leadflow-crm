# LeadFlow CRM: your project walkthrough

Use this guide to understand the app and explain it naturally in an interview. Do not memorize it word-for-word.

## The problem
A sales person may receive enquiries through a website, referrals, events or calls. When contact details live in scattered notes, follow-ups can be missed. LeadFlow stores the contact and its current progress in one place.

## How it works
1. The user opens the dashboard in a browser.
2. `public/app.js` sends HTTP requests to the Express API.
3. `server.js` validates each request and runs a database query.
4. SQLite saves the lead in `data/leadflow.sqlite`.
5. The API returns JSON and the browser refreshes the table and counts.

## Important files
- `server.js`: server, database setup, validation and REST endpoints.
- `public/index.html`: dashboard structure and lead form.
- `public/styles.css`: layout, responsive styling and status colors.
- `public/app.js`: browser logic, API calls, search, form and delete confirmation.
- `tests/validation.test.js`: backend validation tests.
- `README.md`: setup instructions, API documentation and project decisions.

## REST methods
- GET reads information.
- POST creates a new lead.
- PUT updates a lead.
- DELETE removes a lead.

## Why validate twice?
Frontend validation gives quick feedback to the person using the form. Backend validation protects the database because someone can call an API directly without using the website. Both layers matter.

## Database
The `leads` table stores one row per lead. `id` is the primary key. `created_at` and `updated_at` record when the lead was added or edited. Indexes on `name` and `status` support common lookups.

## Honest project scope
This version is a single-workspace application. Authentication, user-specific permissions and cloud deployment are not included. They were optional in the assignment and are listed as future improvements.
