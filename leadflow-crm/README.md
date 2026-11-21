# LeadFlow CRM

A small, human-friendly lead manager created for the **Meru Technosoft Pvt. Ltd. Full Stack Developer Screening Assignment**.

LeadFlow is built around a simple idea: sales teams should spend less time hunting through spreadsheets and more time having useful conversations. It keeps contact details, lead sources and follow-up status together in one clear workspace.

## Features
- Add a lead with name, email, phone, company, source and status.
- View leads in a responsive table and edit their details.
- Delete leads only after a confirmation prompt.
- Search by name, company or email; filter by status; sort by date.
- Dashboard totals for New, Contacted, Qualified and Lost leads.
- Frontend and backend validation for required fields, email, phone, source and status.
- SQLite persistence, so records remain after restarting the server.

## Tech stack and why
| Layer | Technology | Reason |
|---|---|---|
| Frontend | HTML, CSS, vanilla JavaScript | Lightweight and straightforward to understand |
| Backend | Node.js + Express | Simple REST API |
| Database | SQLite + better-sqlite3 | Persistent storage without running a separate database server |
| Tests | Node.js test runner | Quick checks for validation rules |

The assignment allows different stacks and does not require React. This version keeps the stack small so the complete workflow is easy to run and explain.

## Run locally
Requirements: Node.js 18+ and npm.

```bash
npm install
```

Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`; macOS/Linux: `cp .env.example .env`), then run:

```bash
npm start
```

Open **http://localhost:3000**. For development with automatic server restart, use `npm run dev`.

The database is created automatically at `data/leadflow.sqlite`. Database files and `.env` are excluded from Git.

## API
Base path: `/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/leads` | List leads; supports `search`, `status`, `sort` |
| GET | `/leads/:id` | Fetch one lead |
| POST | `/leads` | Create a lead |
| PUT | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |
| GET | `/dashboard` | Total and status counts |

Allowed sources: `Website`, `Referral`, `LinkedIn`, `Cold Call`, `Event`, `Other`.
Allowed statuses: `New`, `Contacted`, `Qualified`, `Lost`.

Example JSON body:

```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "company": "Northstar Labs",
  "source": "Website",
  "status": "New"
}
```

## Validation and error handling
The browser checks the form before sending it. The API repeats validation because API requests can be made without using the browser. Invalid input returns HTTP 400 with field-specific messages; missing records return 404. The UI displays useful feedback instead of silently failing.

## Tests
Run `npm test`. Tests cover valid data, required fields, invalid email and unsupported status.

## Assumptions
- This is a single-workspace demonstration. Authentication and per-user lead ownership are not included because they are optional in the assignment.
- Phone numbers are stored as text to preserve country codes and formatting.
- Email addresses are trimmed and stored in lowercase.
- Sources and statuses are limited to the assignment's choices.

## Improvements with more time
1. Add signup/login and ensure users can access only their own leads.
2. Add pagination and a lead activity timeline.
3. Add API integration tests for the complete create/edit/delete flow.
4. Deploy with persistent managed storage and automated backups.
5. Add deeper accessibility and keyboard-navigation testing.

## Short note
I focused on making the everyday workflow feel natural: adding a lead is quick, status is visible at a glance, and deleting a record requires confirmation. The main design consideration was validating data in both the browser and API, so the database is protected even when a request bypasses the UI.

## Suggested Git milestones
Make commits as you actually complete each stage. For example:

```bash
git init
git add . && git commit -m "chore: set up LeadFlow project"
git add . && git commit -m "feat: add lead API and SQLite storage"
git add . && git commit -m "feat: build responsive lead dashboard"
git add . && git commit -m "feat: add search filters and lead editing"
git add . && git commit -m "test: cover validation and document setup"
```

Only use commits that reflect work you really completed.
