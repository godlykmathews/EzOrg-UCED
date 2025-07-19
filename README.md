# 🏫 Unified College Event Dashboard

A role-based event management platform for college communities with real-time multi-stage proposal approvals, Telegram bot notifications, and Supabase integration.

## 🔧 Tech Stack

- **Frontend**: React (Vite + TailwindCSS)
- **Backend**: Node.js + Express
- **Database / Auth / Realtime**: Supabase
- **Notifications**: Telegram Bot API
- **Hosting**: (Optional) Vercel / Railway / Supabase Edge Functions

---

## 🚦 Core Features

| Role            | Key Functionalities                                                                 |
|------------------|-------------------------------------------------------------------------------------|
| Student          | View approved events, announcements, digital notice board                          |
| Community Lead   | Submit new event proposals, track approval status, get notifications                |
| Staff Advisor    | Review & approve proposals, comment, forward to HoD                                 |
| HoD              | Approve proposals, post announcements, forward to Principal                         |
| Principal        | Final approval, publish event, manage college-wide notices and blog                 |

---

## 🔄 Event Approval Workflow

1. **Community Lead** submits proposal → status: `pending_staff_advisor`
2. **Staff Advisor** reviews → approves → status: `pending_hod`
3. **HoD** reviews → approves → status: `pending_principal`
4. **Principal** approves → status: `approved`
5. On approval, event is **published to students**  
6. Telegram alerts sent at each stage

---

## 🗃️ Supabase Setup

### Step 1: Create Project
- Go to [https://supabase.com/](https://supabase.com/)
- Create a new project and note:
  - **API URL**
  - **Anon/public key**

### Step 2: Tables

#### `users`
| Column       | Type     | Notes                  |
|--------------|----------|------------------------|
| name         | Text     |                        |
| email        | Text     |                        |
| password     | Text     |                        |
| role         | Text     | student / lead / advisor / hod / principal |

#### `events`
| Column        | Type     | Notes                         |
|---------------|----------|-------------------------------|
| id            | UUID     | Primary key                   |
| title         | Text     | Event name                    |
| description   | Text     |                              |
| date          | Date     |                              |
| venue         | Text     |                              |
| status        | Text     | pending_x / approved / rejected |
| submitted_by  | UUID     | FK → `users.id`               |

#### `approvals`
| Column         | Type     | Notes                         |
|----------------|----------|-------------------------------|
| id             | UUID     |                               |
| event_id       | UUID     | FK → `events.id`              |
| reviewed_by    | UUID     | FK → `users.id`               |
| role           | Text     | advisor / hod / principal     |
| comment        | Text     | Optional                      |
| status         | Text     | approved / rejected / revision_requested |

---

### Step 3: Enable Auth

- Go to **Authentication → Settings**
- Enable **Email/Password login**
- Create manual test users for different roles

---

### Step 4: Realtime Updates

- Enable Realtime for `events` table:
  - Go to **Database → Replication**
  - Enable realtime for `events`

---

### Step 5: Storage (Optional)

- Create a bucket `certificates`
- Allow authenticated upload/download

---

## 🧠 AI Editor Prompts (Helpful for GitHub Copilot or ChatGPT)

```plaintext
"Create a React component called Dashboard that renders different views based on user role using Supabase Auth user metadata."

"Write an Express route to approve an event proposal and update its status in Supabase."

"Connect a Telegram bot using `node-telegram-bot-api` to send alerts when event status changes."
