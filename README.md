# Meridian Pivot

## Overview

Meridian Pivot is a mini event check-in and badge-printing prototype built with Node.js and Express.

The system demonstrates a workflow where an attendee is scanned, a badge-printing job is created, and a printer completion webhook updates the attendee's status.

The project includes a browser-based dashboard for interacting with and monitoring the prototype.

## Workflow

The main workflow is:

1. Scan an attendee using their attendee ID.
2. The backend validates the attendee.
3. A print job is created.
4. The attendee status changes to `PRINT_PENDING`.
5. A simulated printer webhook is received.
6. The print job is marked as completed.
7. The attendee status changes to `CHECKED_IN`.
8. Attempts to create another print job for an attendee who has already checked in are prevented.

## Features

- Attendee scanning
- Badge print-job creation
- Print queue
- Simulated printer completion webhook
- Attendee status tracking
- Duplicate print protection
- Activity log
- Live dashboard statistics
- Browser-based interface
- Express backend API

## Project Structure

```text
Meridian Pivot/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```
