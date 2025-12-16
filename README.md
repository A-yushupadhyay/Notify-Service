🔔 Notify System
A Production-Grade, Event-Driven Notification Platform

“I built a production-grade notification system using an event-driven architecture.
Notifications are processed asynchronously via Redis Streams, with retries, DLQ, scheduling, and bulk fan-out.
I also built a real-time UI to visualize system behavior.”

<img width="1920" height="1080" alt="Screenshot (156)" src="https://github.com/user-attachments/assets/0df73574-f5d5-4024-956c-c5a5bfdab73c" />

<img width="1920" height="1080" alt="Screenshot (157)" src="https://github.com/user-attachments/assets/942ee668-8e21-4734-9911-7c5a3acf7d83" />


## 📌 Overview

**Notify System** is a scalable, fault-tolerant notification service inspired by architectures used at companies like **Amazon, Uber, Flipkart, and Meta**.

It supports:

- ✅ Real-time notifications  
- ✅ Asynchronous processing  
- ✅ Scheduling & delays  
- ✅ Bulk fan-out  
- ✅ Retries & Dead Letter Queue (DLQ)  
- ✅ Live UI to visualize system behavior  

This project focuses on **how systems behave under real conditions**, not just APIs.

---

## 🎯 Why This Project Exists

Most notification demos only show:

- `POST /notify`
- Save to DB
- Return success

❌ **That is not how production systems work.**

In real systems:

- Notifications must not block users  
- Failures must be retried  
- Messages must never be lost  
- Traffic must be smoothed  
- Events must be observable  

👉 **This project solves those problems.**

---

## 🧠 High-Level Architecture

flowchart LR
    FE[Frontend<br/>React + WebSocket]
    API[API Server<br/>Express + Rate Limit]
    RS[Redis Streams<br/>notify / bulk / dlq]
    W[Worker Service<br/>Retry Logic]
    BW[Bulk Worker<br/>Fan-out]
    SCH[Scheduler<br/>ZSET]
    DB[(PostgreSQL<br/>Prisma ORM)]
    WS[WebSocket Gateway<br/>Live Updates]

    FE -->|REST / WS| API
    API -->|Publish Event| RS

    RS --> W
    RS --> BW
    SCH --> RS

    W --> DB
    W --> WS
    BW --> RS
    DB --> API
    WS --> FE


Core Flow: Notification Lifecycle (Visual)

sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Redis
    participant Worker
    participant DB
    participant WebSocket

    User->>Frontend: Send Notification
    Frontend->>API: POST /api/notify
    API->>Redis: Publish event
    API-->>Frontend: 200 OK (fast)

    Redis->>Worker: Consume event
    Worker->>DB: Save notification
    Worker->>WebSocket: Emit real-time event
    WebSocket-->>Frontend: Live update

DLQ Flow

flowchart TD
    RS[Redis Stream]
    W[Worker]
    DLQ[Dead Letter Queue]

    RS --> W
    W -->|Success| DB[(PostgreSQL)]
    W -->|Failure| W
    W -->|Max retries exceeded| DLQ

yaml
Copy code

---

## 🔄 Core Flow: Notification Lifecycle

### 1️⃣ User Sends a Notification

Frontend → POST /api/notify

yaml
Copy code

- Request is **rate-limited**
- API does **NOT** write to DB directly
- Event is published to **Redis Stream**

✔ Fast response  
✔ No blocking  
✔ Scalable  

---

### 2️⃣ Worker Consumes Event (Async)

Redis Stream → Worker Service

yaml
Copy code

Worker responsibilities:

- Validate payload
- Save notification to PostgreSQL
- Update unread count in Redis
- Emit WebSocket event

✔ Decoupled  
✔ Retry-safe  
✔ Horizontally scalable  

---

### 3️⃣ Retry Logic (Failure Handling)

If worker fails:

Retry → Retry → Retry (max attempts)

yaml
Copy code

- Exponential backoff
- Prevents infinite loops

---

### 4️⃣ Dead Letter Queue (DLQ)

If retries fail:

Event → DLQ Stream

yaml
Copy code

DLQ guarantees:

- ✅ No message loss  
- ✅ Manual retry  
- ✅ Debuggability  

**🎤 Recruiter explanation:**  
> “DLQ ensures reliability in distributed systems.”

---

## ⏰ Scheduled Notifications (Time-Based Events)

### Problem

> “Send after 10 minutes”  
> “Send at 9 AM”

### Solution

- Jobs stored in **Redis Sorted Sets (ZSET)**
- Score = execution timestamp

Scheduler Worker
↓
Checks ZSET
↓
Publishes event to Redis Stream

yaml
Copy code

✔ Efficient  
✔ Accurate  
✔ No cron dependency  

---

## 📣 Bulk Notifications (Fan-Out)

Used for:

- Promotions  
- Announcements  
- Feature updates  

### Flow

Bulk API → Bulk Stream → Bulk Worker

yaml
Copy code

Bulk worker:

- Fans out events per user
- Avoids DB blocking
- Runs independently

✔ High throughput  
✔ Isolation  
✔ Production pattern  

---

## 🔴 Live System Observability (UI)

The frontend UI is **not cosmetic** — it is **diagnostic**.

### What the UI Shows

- Real-time WebSocket events  
- Unread count via Redis  
- Pagination from database  
- Scheduler triggers  
- Bulk fan-out behavior  
- DLQ simulation  

This allows recruiters to **see the system working**, not just hear about it.

---

## 🛠 Tech Stack

### Backend
- Node.js + Express
- Redis  
  - Streams (event queue)  
  - ZSET (scheduler)  
- PostgreSQL
- Prisma ORM
- Socket.io

### Frontend
- React + Vite
- Tailwind CSS
- WebSocket client

### Infrastructure
- Docker
- Docker Compose

---

## 📦 Services / Components

| Component            | Responsibility                                   |
|---------------------|--------------------------------------------------|
| API Service         | Accept requests, validate, publish events        |
| Worker Service      | Consume events, persist data                     |
| Scheduler Service   | Time-based execution                             |
| Bulk Worker         | Fan-out large notifications                     |
| DLQ Worker          | Handle failed events                             |
| WebSocket Gateway   | Real-time delivery to UI                         |

---

## 🧪 Running Locally

```bash
docker-compose up --build
Frontend: http://localhost:5173

Backend: http://localhost:8000
```

 ## 🚀 Future Improvements

Kafka instead of Redis Streams

Sharding for large user bases

Read replicas

Push notifications (FCM / APNS)

Metrics & tracing (Prometheus)

👤 Author
Ayush Upadhyay
Aspiring Software Development Engineer
Focused on system design & scalable backend engineering





