# Scope Delta Analysis – Solstice Events Check-In Service

## 1. Original Specification

The original check-in service was designed around a synchronous printing process. When a staff member scanned an attendee's QR code, the system would send a request to the badge printer through its REST API and wait for the printer to respond.

The attendee would only be marked as checked in after the printing operation had completed successfully.

The original flow was:

**QR scan → printer request → wait for response → badge printed → attendee checked in**

---

## 2. The Mid-Sprint Pivot

During development, the client announced that the synchronous printing API was being deprecated and would no longer be available within the project timeline.

The new requirement was to use an asynchronous printing model. Instead of waiting for the printer response, the system now creates a print request and places it in a queue. The printer can process the request separately and send a webhook to the check-in service when printing is complete.

The updated flow became:

**QR scan → print request queued → PRINT_PENDING → webhook received → CHECKED_IN**

This change also meant that the system could no longer assume that print confirmations would arrive in the same order as the original scans.

---

## 3. Dropped Requirements and Approach

The following parts of the original synchronous design were removed:

- Waiting synchronously for the printer's response.
- Treating the QR scan request as complete only after the printer responded.
- Depending on an immediate REST response from the badge-printer vendor.

The synchronous approach was no longer suitable because the client was removing the API.

---

## 4. Modified Components

The attendee check-in process was changed to support an intermediate `PRINT_PENDING` state.

Previously, a successful printing operation could lead directly to `CHECKED_IN`. With the new design, an attendee remains `PRINT_PENDING` until the system receives confirmation that their specific print job has completed.

Print-job handling was also changed so that each request receives a unique job ID. This allows a webhook to identify which attendee's printing operation has completed, even when confirmations arrive in a different order from the original scans.

---

## 5. Added Components

The pivot required several new components:

- An in-memory print queue for pending print requests.
- Unique print job IDs such as `JOB-1`, `JOB-2`, and `JOB-3`.
- A `PRINT_PENDING` attendee status.
- A `/webhook/print-complete` endpoint for printer callbacks.
- Webhook processing that updates the relevant attendee after successful printing.
- Protection against duplicate webhook confirmations.
- Handling for invalid print-job IDs.

These additions allowed the service to operate without waiting for a synchronous printer response.

---

## 6. Backlog Changes

- **Synchronous printer API — Dropped:** Vendor is deprecating the API.
- **Immediate check-in after print request — Modified:** Check-in must wait for webhook confirmation.
- **Print queue — Added:** Required for asynchronous processing.
- **Webhook endpoint — Added:** Required to receive print completion.
- **Duplicate scan protection — Retained:** Still required by the client.
- **Duplicate webhook handling — Added:** Prevents repeated completion processing.

---

## 7. Requirements That Were Preserved

The pivot did not change the basic attendee identification or duplicate-scan requirements.

The system still:

- Identifies attendees using their QR-code/attendee ID.
- Prevents a second badge from being created when an attendee is already checked in.
- Prevents another print request while an attendee is still `PRINT_PENDING`.
- Marks the attendee as `CHECKED_IN` only after print completion is confirmed.
- Supports multiple attendees being processed at the same time.

---

## 8. Testing and Regression Checks

Several tests were carried out after implementing the pivot.

Multiple attendees were scanned and placed into the pending state. Their webhook confirmations were then deliberately processed out of order. For example, jobs were completed in the order:

**JOB-4 → JOB-2 → JOB-3**

The system correctly matched each job to the appropriate attendee and moved each attendee to `CHECKED_IN`.

Duplicate scanning was also tested. After an attendee had already been checked in, scanning the same attendee again returned:

**No new print job created**

A duplicate webhook was tested after a print job had already been completed. The system correctly rejected the repeated confirmation with:

**Print job already completed**

An invalid job ID was also tested, and the system returned:

**Print job not found**

These tests showed that the asynchronous pivot did not break the duplicate-scan protection or the relationship between print jobs and attendees.

### Troubleshooting During Testing

During testing, a duplicate webhook was initially being accepted even though duplicate protection had been added.

I checked the saved server code and confirmed that the condition was present. I then restarted the Node.js process to ensure that it was running the updated version of the code.

After restarting, the same webhook was correctly rejected as an already completed print job.

### Regression Check

Existing attendee identification and duplicate-scan protection continued to work after the asynchronous refactor.

Multiple pending print jobs were also tested with webhook confirmations arriving out of order, and each confirmation was matched to the correct attendee.

---

## 9. Trade-offs

The asynchronous approach adds more state and logic to the system. The service now has to keep track of pending print jobs, wait for webhook confirmations, and handle cases such as duplicate or invalid callbacks.

The main benefit is that the check-in service no longer depends on the printer providing an immediate response. The design also allows several print requests to be pending at the same time, with confirmations being processed independently.

The pivot therefore increased implementation complexity, but it was necessary to continue supporting the client's printing workflow after the synchronous API was deprecated.

---

## 10. Time Impact

Approximately six hours were allocated to implementing, troubleshooting, testing, and documenting the pivot.

The main additional work came from changing the original printing flow to an asynchronous queue and webhook model, followed by testing duplicate scans, invalid jobs, duplicate callbacks, and out-of-order webhook confirmations.

- **Set up project and initial implementation:** 1 hr
- **Add asynchronous queue/webhook flow:** 1 hr 30 min
- **Troubleshooting and fixes:** 2 hrs
- **Testing and regression checks:** 1 hr
- **Documentation:** 30 min

## **Total: 6 hrs**

## 11. Final Status

The refactored check-in service now follows the new asynchronous requirement.

Print requests are queued, attendees remain pending until confirmation is received, webhook confirmations can be processed out of order, and duplicate scans or duplicate print confirmations are rejected.

The original synchronous printing approach has therefore been replaced rather than left running alongside the new implementation.

**Status: Complete**
