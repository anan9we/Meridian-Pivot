const attendees = [
  {
    id: "A001",
    name: "Alice",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A002",
    name: "Brian",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A003",
    name: "Carol",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A004",
    name: "David",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A005",
    name: "Emma",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A006",
    name: "Frank",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A007",
    name: "Grace",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "A008",
    name: "Henry",
    status: "NOT_CHECKED_IN",
  },
];

const printQueue = [];

console.log("Solstice Events Check-In System");
console.log(attendees);

function scanAttendee(attendeeId) {
  const attendee = attendees.find((attendee) => attendee.id === attendeeId);

  if (!attendee) {
    console.log("Attendee not found.");
    return;
  }

  console.log(`\nQR code scanned for ${attendee.name}.`);

  // Prevent duplicate badge printing
  if (attendee.status === "PRINT_PENDING" || attendee.status === "CHECKED_IN") {
    console.log(
      `No new badge will be printed. ${attendee.name} is already ${attendee.status}.`,
    );
    return;
  }

  // Create a print request
  const printJob = {
    jobId: `JOB-${printQueue.length + 1}`,
    attendeeId: attendee.id,
    status: "PENDING",
  };

  printQueue.push(printJob);

  // Update attendee status
  attendee.status = "PRINT_PENDING";

  console.log(`Print request ${printJob.jobId} added to the queue.`);
  console.log(`${attendee.name} is now PRINT_PENDING.`);
}

function printerWebhook(jobId) {
  const job = printQueue.find((job) => job.jobId === jobId);

  if (!job) {
    console.log("Print job not found.");
    return;
  }

  const attendee = attendees.find((attendee) => attendee.id === job.attendeeId);

  if (!attendee) {
    console.log("Attendee not found.");
    return;
  }

  job.status = "COMPLETED";
  attendee.status = "CHECKED_IN";

  console.log(`\nWebhook received for ${job.jobId}.`);
  console.log(`Badge printing completed for ${attendee.name}.`);
  console.log(`${attendee.name} is now CHECKED_IN.`);
}

scanAttendee("A001");
scanAttendee("A002");
scanAttendee("A003");

printerWebhook("JOB-3");
printerWebhook("JOB-1");
printerWebhook("JOB-2");
