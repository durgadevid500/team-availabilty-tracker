const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "team.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readTeam() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    console.error("Could not read team data:", error.message);
    return [];
  }
}

function saveTeam(team) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(team, null, 2));
}

app.get("/api/team", (req, res) => {
  res.json(readTeam());
});

app.patch("/api/team/:id/status", (req, res) => {
  const allowedStatuses = ["Available", "Busy", "Away"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Status must be Available, Busy, or Away." });
  }

  const team = readTeam();
  const member = team.find(person => String(person.id) === String(req.params.id));

  if (!member) {
    return res.status(404).json({ message: "Team member not found." });
  }

  member.status = status;
  member.updatedAt = new Date().toISOString();
  saveTeam(team);

  res.json({ message: "Status updated successfully.", member });
});

app.post("/api/team", (req, res) => {
  const { name, role, email } = req.body;
  if (!name || !role || !email) {
    return res.status(400).json({ message: "Name, role and email are required." });
  }

  const team = readTeam();
  const member = {
    id: Date.now(),
    name: String(name).trim(),
    role: String(role).trim(),
    email: String(email).trim(),
    status: "Available",
    updatedAt: new Date().toISOString()
  };

  team.push(member);
  saveTeam(team);
  res.status(201).json({ message: "Team member added.", member });
});

app.delete("/api/team/:id", (req, res) => {
  const team = readTeam();
  const updatedTeam = team.filter(person => String(person.id) !== String(req.params.id));

  if (updatedTeam.length === team.length) {
    return res.status(404).json({ message: "Team member not found." });
  }

  saveTeam(updatedTeam);
  res.json({ message: "Team member removed." });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Team Availability Tracker API is running." });
});

app.listen(PORT, () => {
  console.log(`Team Availability Tracker running at http://localhost:${PORT}`);
});
