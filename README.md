# Team Availability Tracker

A responsive web application that helps teams track members' availability in real time. Team members can update their status, while the dashboard displays everyone's current availability.

## Features

- View all team members in a dashboard.
- Track availability using three statuses:
  - 🟢 Available
  - 🟠 Busy
  - ⚪ Away
- Update team member status instantly.
- Add new team members.
- Remove team members.
- Search members by name, role, or email.
- Filter members based on availability status.
- Dashboard summary cards showing total, available, busy, and away members.
- Automatic dashboard refresh every 10 seconds.
- Persistent data storage using JSON file.
- Responsive design for desktop and mobile devices.

## Technologies Used

**Frontend:**
- HTML5
- CSS3
- JavaScript

**Backend:**
- Node.js
- Express.js

**Storage:**
- JSON File Storage

## Project Structure

```text
team-availability-tracker/
├── data/
│   └── team.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Installation and Setup

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project folder**

```bash
cd team-availability-tracker
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the server**

```bash
npm start
```

**5. Open in browser**

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/team` | Get all team members |
| POST | `/api/team` | Add a new member |
| PATCH | `/api/team/:id/status` | Update member status |
| DELETE | `/api/team/:id` | Remove a member |
| GET | `/api/health` | Check API health |

## Data Storage

Team member information is stored in `data/team.json`. Changes are saved automatically and remain available after restarting the server.

## Future Improvements

- User authentication and authorization.
- WebSocket-based real-time updates.
- Database integration using MySQL or MongoDB.
- Team activity history.
- Cloud deployment.

## Author

**Durga Devi**

## License

This project is created for learning and demonstration purposes.
