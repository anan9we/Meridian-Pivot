const attendeeList = document.getElementById("attendeeList");
const printQueue = document.getElementById("printQueue");
const activityLog = document.getElementById("activityLog");
const attendeeCount = document.getElementById("attendeeCount");

const totalAttendees = document.getElementById("totalAttendees");
const pendingPrints = document.getElementById("pendingPrints");
const checkedIn = document.getElementById("checkedIn");

const attendeeIdInput = document.getElementById("attendeeId");
const scanButton = document.getElementById("scanButton");
const message = document.getElementById("message");

const attendees = [
  { id: "A001", name: "Alice", status: "NOT_CHECKED_IN" },
  { id: "A002", name: "Brian", status: "NOT_CHECKED_IN" },
  { id: "A003", name: "Carol", status: "NOT_CHECKED_IN" },
  { id: "A004", name: "David", status: "NOT_CHECKED_IN" },
  { id: "A005", name: "Emma", status: "NOT_CHECKED_IN" },
  { id: "A006", name: "Frank", status: "NOT_CHECKED_IN" },
  { id: "A007", name: "Grace", status: "NOT_CHECKED_IN" },
  { id: "A008", name: "Henry", status: "NOT_CHECKED_IN" },
];

const jobs = [];
const logs = [];

function updateStats() {
  totalAttendees.textContent = attendees.length;

  pendingPrints.textContent = attendees.filter(
    (attendee) => attendee.status === "PRINT_PENDING",
  ).length;

  checkedIn.textContent = attendees.filter(
    (attendee) => attendee.status === "CHECKED_IN",
  ).length;
}

function renderAttendees() {
  attendeeList.innerHTML = "";

  attendeeCount.textContent = `${attendees.length} attendees`;

  attendees.forEach((attendee) => {
    const element = document.createElement("div");

    element.className = "attendee";

    element.innerHTML = `
      <div>
        <strong>${attendee.name}</strong>
        <div>${attendee.id}</div>
      </div>

      <span class="status ${attendee.status}">
        ${attendee.status}
      </span>
    `;

    attendeeList.appendChild(element);
  });
}

function renderPrintQueue() {
  printQueue.innerHTML = "";

  if (jobs.length === 0) {
    printQueue.innerHTML = "<p>No print jobs yet.</p>";
    return;
  }

  jobs.forEach((job) => {
    const attendee = attendees.find(
      (attendee) => attendee.id === job.attendeeId,
    );

    const element = document.createElement("div");

    element.className = "print-job";

    element.innerHTML = `
  <div>
    <strong>${job.jobId}</strong>
    <div>${attendee ? attendee.name : job.attendeeId}</div>
  </div>

  <div>
    <span class="status">
      ${job.status}
    </span>

    ${
      job.status === "PENDING"
        ? `<button onclick="completePrint('${job.jobId}')">
             Complete Print
           </button>`
        : ""
    }
  </div>
`;

    printQueue.appendChild(element);
  });
}

function renderLogs() {
  activityLog.innerHTML = "";

  if (logs.length === 0) {
    activityLog.innerHTML = "<p>No activity yet.</p>";
    return;
  }

  logs.forEach((log) => {
    const element = document.createElement("div");

    element.className = "log-entry";
    element.textContent = log;

    activityLog.appendChild(element);
  });
}

function addLog(text) {
  const time = new Date().toLocaleTimeString();

  logs.unshift(`${time} — ${text}`);

  renderLogs();
}

async function scanAttendee() {
  const attendeeId = attendeeIdInput.value.trim().toUpperCase();

  if (!attendeeId) {
    message.textContent = "Please enter an attendee ID.";
    message.className = "error";
    return;
  }

  try {
    const response = await fetch("/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attendeeId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.error;
      message.className = "error";
      return;
    }

    message.textContent = data.message;

    if (data.jobId) {
      message.className = "success";
    } else {
      message.className = "notice";
    }

    const attendee = attendees.find((attendee) => attendee.id === attendeeId);

    if (attendee) {
      attendee.status = data.status;
    }

    if (data.jobId) {
      jobs.push({
        jobId: data.jobId,
        attendeeId,
        status: "PENDING",
      });

      addLog(`${attendeeId} scanned — ${data.jobId} created.`);
      addLog(`${attendeeId} → ${data.status}`);
    } else {
      addLog(`${attendeeId} scanned — no new print job created.`);
    }

    renderAttendees();
    renderPrintQueue();
    updateStats();

    attendeeIdInput.value = "";
  } catch (error) {
    message.textContent = "Unable to connect to the server.";
    console.error(error);
  }
}

async function completePrint(jobId) {
  try {
    const response = await fetch("/webhook/print-complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.error;
      message.className = "error";
      return;
    }

    const job = jobs.find((job) => job.jobId === jobId);

    if (job) {
      job.status = "COMPLETED";
    }

    const attendee = attendees.find(
      (attendee) => attendee.name === data.attendee,
    );

    if (attendee) {
      attendee.status = data.status;
    }

    message.textContent = data.message;
    message.className = "success";

    addLog(`${jobId} completed — ${data.attendee} → ${data.status}`);

    renderAttendees();
    renderPrintQueue();
    updateStats();
  } catch (error) {
    message.textContent = "Unable to connect to the server.";
    console.error(error);
  }
}

scanButton.addEventListener("click", scanAttendee);

attendeeIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    scanAttendee();
  }
});

renderAttendees();
renderPrintQueue();
renderLogs();
updateStats();
