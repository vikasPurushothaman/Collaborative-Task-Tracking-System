# TaskFlow - Task Tracking & Team Collaboration Platform

TaskFlow is a production-grade, modular frontend for a modern task tracking and team collaboration system built with **React 18**, **Vite**, **Tailwind CSS**, **Redux Toolkit**, **TanStack Query (React Query)**, **Framer Motion**, and **Recharts**. 

It draws visual and functional inspiration from leading enterprise applications like Linear, Jira, Notion, ClickUp, and Trello.

---

## 🚀 Key Features Overview

### 🔐 Authentication Flow
- **Login / Register** with Zod schema validation and password strength indicators.
- **Forgot Password / Reset Password** multi-step verification flows.
- **OTP Verification & Email Verification** screens with live countdowns and resend options.
- **Two-Factor Authentication (2FA)** toggle UI and security session management.

### 📊 Modern Executive Dashboard
- **Welcome & Quick Stats** (Completion rate, tasks today, active projects, team online count).
- **Task Overviews** (Today's, Upcoming, Overdue, Completed, Pending, My Assigned).
- **Analytics & Visualizations**:
  - Weekly Productivity Bar Chart
  - Monthly Completion Trend Area Chart
  - Task Distribution Pie Chart
  - Burndown & Workload Charts
- **Interactive Widgets**: Online team members, activity feed, recent comments & attachments.
- **Quick Action Triggers**: Global search, floating action button (FAB), command palette (`Ctrl+K`).

### 📋 Advanced Task Management
- **Multi-View System**:
  - 📝 **Table / List View**: Searchable, filterable, sortable, with multi-select bulk operations (delete, status, priority, assign).
  - 🎴 **Kanban Board**: Drag-and-drop task workflow across status columns.
  - 🗓️ **Calendar View**: Monthly deadline matrix with priority indicators and daily task inspector.
- **Comprehensive Task Details**:
  - Full metadata editor (Status, Priority, Assignee, Project, Team, Dates, Estimate/Actual Hours).
  - Subtask / Checklist progress tracking.
  - Discussion thread with nested replies, reactions, and `@mentions`.
  - File attachment previews and drag-and-drop upload UI.
  - Full audit trail / activity timeline.

### 📁 Project & Team Hubs
- **Projects**: Project cards, category filters, progress indicators, detail pages with members & scope.
- **Teams**: Team workspace cards, member management, invite modal, role assignment (`Owner`, `Admin`, `Member`, `Viewer`).

### 🤖 AI Task Assistant
- Prompt-based AI generation UI for task descriptions, checklists, summaries, priority suggestions, and text enhancement.

### 🛡️ Admin Panel & System Pages
- **Admin Dashboard**: System user matrix, role editing, global stats, and productivity oversight.
- **Help Center**: Searchable FAQ accordion, live support options, and feedback form.
- **Error Pages**: 404 Not Found, 403 Forbidden, 500 Server Error, Maintenance, and Coming Soon pages.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System Tokens (Dark Mode support via `.dark` class)
- **State Management**: Redux Toolkit (Auth, UI, Tasks, Notifications)
- **Data Fetching**: TanStack Query (React Query v5) + Service Layer
- **Form Management**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Analytics**: Recharts
- **Toasts**: React Hot Toast

---

## 🔌 Connecting to Your Backend API

This project is built with a **decoupled service-oriented architecture**. All data interactions go through the `src/services/` directory, which currently uses `Promise`-based responses returning mock data.

To connect your real backend REST API:

1. **Configure Axios Base URL** in `src/services/api.js`:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com/v1',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   // Intercept requests to attach JWT token
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;
   ```

2. **Replace Mock Methods in Services**:
   Each service file contains comments showing where to swap mock Promises with real Axios HTTP calls:
   
   - `src/services/authService.js` $\rightarrow$ `POST /auth/login`, `POST /auth/register`, etc.
   - `src/services/taskService.js` $\rightarrow$ `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`.
   - `src/services/projectService.js` $\rightarrow$ `GET /projects`, `POST /projects`, etc.
   - `src/services/teamService.js` $\rightarrow$ `GET /teams`, `POST /teams`, etc.
   - `src/services/userService.js` $\rightarrow$ `GET /users`, `PUT /users/:id`, etc.
   - `src/services/commentService.js` $\rightarrow$ `GET /tasks/:id/comments`, `POST /comments`, etc.
   - `src/services/notificationService.js` $\rightarrow$ `GET /notifications`, `PUT /notifications/:id/read`.
   - `src/services/analyticsService.js` $\rightarrow$ `GET /analytics/dashboard`, `GET /analytics/weekly`.

---

## 📂 Directory Structure

```
src/
├── assets/          # Static images & graphics
├── components/      # UI & Layout components
│   ├── common/      # Notification dropdown, modals, etc.
│   ├── layout/      # Header, Sidebar, CommandPalette, Floating FAB
│   ├── tasks/       # KanbanBoard, CreateTaskModal
│   └── ui/          # Centralized UI kit (Avatar, Badge, Modal, StatCard, ProgressBar)
├── constants/       # App constants, role definitions, statuses, keyboard shortcuts
├── hooks/           # Custom utility hooks (useDebounce, useClickOutside, useLocalStorage)
├── layouts/         # AppLayout, AuthLayout
├── mock/            # Structured JSON mock data (Users, Tasks, Projects, Teams, Notifications)
├── pages/           # Application views
│   ├── admin/       # Admin Dashboard, User Management
│   ├── ai/          # AI Task Assistant
│   ├── analytics/   # Analytical charts and reporting
│   ├── auth/        # Login, Register, Forgot Password, Reset, OTP, Email Verification
│   ├── calendar/    # Deadline calendar
│   ├── dashboard/   # Main application dashboard
│   ├── errors/      # 404, 403, 500, Maintenance, Coming Soon
│   ├── help/        # FAQ and Support
│   ├── notifications/ # Full notification list page
│   ├── profile/     # Profile, Edit Profile, Change Password
│   ├── projects/    # Projects list & Detail page
│   ├── settings/    # Settings tabs (General, Appearance, Security, Account)
│   ├── tasks/       # Tasks list/kanban & Task Detail view
│   └── teams/       # Teams list & Detail page
├── services/        # Decoupled API service layer (ready for REST endpoints)
├── store/           # Redux Toolkit slices (auth, ui, tasks, notifications)
├── styles/          # Tailwind design tokens and custom CSS directives
└── utils/           # Helper functions (formatting, date-fns, validators, helpers)
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + K` / `Cmd + K` | Open Command Palette |
| `Ctrl + Shift + L` | Toggle Dark / Light Theme |
| `Esc` | Close Modals / Overlays |

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
