# Team Availability Tracker

A responsive team dashboard built with HTML, CSS, vanilla JavaScript, Node.js and Express. Team data is persisted in a local JSON file.

## Features

- View team members and their current availability.
- Update each member's status: Available, Busy, or Away.
- Add and remove team members.
- Search members by name, role, or email.
- Filter the dashboard by availability status.
- Summary cards update automatically.
- Dashboard refreshes from the backend every 10 seconds.
- REST API with JSON-file persistence.
- Responsive layout for desktop and mobile.

## Requirements

- Node.js 18 or later
- npm

## Run locally

1. Extract the project ZIP.
2. Open the extracted `team-availability-tracker` folder in VS Code.
3. Open the VS Code terminal in the project folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open http://localhost:3000 in your browser.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/team` | Get all team members |
| POST | `/api/team` | Add a team member |
| PATCH | `/api/team/:id/status` | Update a member's status |
| DELETE | `/api/team/:id` | Remove a team member |
| GET | `/api/health` | Check API health |

### Example status update

```json
{
  "status": "Busy"
}
```

Allowed statuses: `Available`, `Busy`, `Away`.

## Storage

Team records are stored in `data/team.json`. Changes remain saved after the server restarts.

## Note

This is a lightweight demonstration project. For production deployment with multiple server instances or concurrent users, use a database such as PostgreSQL or MongoDB instead of a local JSON file.
