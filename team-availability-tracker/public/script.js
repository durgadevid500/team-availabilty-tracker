const teamList = document.getElementById("team-list");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const dialog = document.getElementById("member-dialog");
const memberForm = document.getElementById("member-form");
const toast = document.getElementById("toast");

let team = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function initials(name) {
  return name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
}

function timeAgo(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return new Date(value).toLocaleDateString();
}

function render() {
  const counts = {
    Available: team.filter(person => person.status === "Available").length,
    Busy: team.filter(person => person.status === "Busy").length,
    Away: team.filter(person => person.status === "Away").length
  };

  document.getElementById("total-count").textContent = team.length;
  document.getElementById("available-count").textContent = counts.Available;
  document.getElementById("busy-count").textContent = counts.Busy;
  document.getElementById("away-count").textContent = counts.Away;
  document.getElementById("people-count").textContent = team.length;

  const query = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;
  const visible = team.filter(person => {
    const matchesText = `${person.name} ${person.role} ${person.email}`.toLowerCase().includes(query);
    return matchesText && (filter === "All" || person.status === filter);
  });

  document.getElementById("showing-count").textContent = `Showing ${visible.length} of ${team.length} members`;

  if (!visible.length) {
    teamList.innerHTML = `<tr><td colspan="5" class="empty">No team members found. Try another search or add a member.</td></tr>`;
    return;
  }

  teamList.innerHTML = visible.map(person => `
    <tr>
      <td><div class="person-cell"><div class="person-avatar">${initials(person.name)}</div><div><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.email)}</small></div></div></td>
      <td>${escapeHtml(person.role)}</td>
      <td><select class="status-select status-${person.status}" data-status-id="${person.id}" aria-label="Change ${escapeHtml(person.name)} status">
        <option ${person.status === "Available" ? "selected" : ""}>Available</option>
        <option ${person.status === "Busy" ? "selected" : ""}>Busy</option>
        <option ${person.status === "Away" ? "selected" : ""}>Away</option>
      </select></td>
      <td>${timeAgo(person.updatedAt)}</td>
      <td><button class="delete-btn" data-delete-id="${person.id}" aria-label="Remove ${escapeHtml(person.name)}" title="Remove member">×</button></td>
    </tr>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

async function loadTeam(showError = false) {
  try {
    const response = await fetch("/api/team");
    if (!response.ok) throw new Error("Could not load team data.");
    team = await response.json();
    render();
  } catch (error) {
    if (showError) showToast("Unable to connect. Is the server running?");
  }
}

teamList.addEventListener("change", async event => {
  const select = event.target.closest("[data-status-id]");
  if (!select) return;
  const id = select.dataset.statusId;
  const status = select.value;
  try {
    const response = await fetch(`/api/team/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    await loadTeam();
    showToast(`${result.member.name}'s status updated.`);
  } catch (error) {
    showToast(error.message || "Could not update status.");
    await loadTeam();
  }
});

teamList.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-id]");
  if (!button) return;
  const id = button.dataset.deleteId;
  const member = team.find(person => String(person.id) === String(id));
  if (!member || !confirm(`Remove ${member.name} from the team?`)) return;

  try {
    const response = await fetch(`/api/team/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    await loadTeam();
    showToast("Team member removed.");
  } catch (error) {
    showToast(error.message || "Could not remove member.");
  }
});

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);

document.getElementById("add-member-btn").addEventListener("click", () => dialog.showModal());
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
document.getElementById("cancel-dialog").addEventListener("click", () => dialog.close());

memberForm.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(memberForm);
  const member = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    memberForm.reset();
    dialog.close();
    await loadTeam();
    showToast("New team member added.");
  } catch (error) {
    showToast(error.message || "Could not add member.");
  }
});

loadTeam(true);
setInterval(() => loadTeam(), 10000);
