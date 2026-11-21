# LeadFlow CRM

A simple Lead Management System built using Node.js, Express.js, SQLite, HTML, CSS and JavaScript.

## Features

- Add new leads
- View all leads
- Edit lead details
- Update lead status
- Delete leads with confirmation
- Search leads by name, email or company
- Filter leads by status
- Dashboard with lead statistics
- Frontend and backend validation

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- SQLite

## Installation and Setup

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Create the environment file:

```powershell
Copy-Item .env.example .env
```

5. Start the application:

```bash
npm start
```

6. Open your browser and visit:

http://localhost:3000

## Run Tests

```bash
npm test
```

## Project Structure

- `server.js` - Backend server and API
- `public/` - Frontend files
- `tests/` - Application tests
- `package.json` - Project dependencies and scripts
- `.env.example` - Example environment configuration

## Future Improvements

- User authentication
- Pagination
- Cloud deployment
- More dashboard analytics

## Author

Developed as a Full Stack Developer Assignment.