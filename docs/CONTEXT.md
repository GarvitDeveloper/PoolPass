 # 🏊‍♂️ PoolPass - Community Pool Kiosk App Overview

This app will run on a dedicated device located at the pool. It is designed for use by residents, lifeguards, and administrators. It does not require personal devices and is entirely kiosk-based.

---

## 📋 Features

### ✅ 1. Check-In System
- Residents can check in using a simple on-screen interface.
- Option to type in name or select from a resident list.
- Option to enter guest count.
- Each check-in increases the occupancy counter automatically.

---

### 📢 2. Rules & Notices Display
- A scrollable view of pool rules for all users.
- Displays current notices or announcements.
- Notices can be updated by admin.

---

### 👥 3. Occupancy Counter
- Automatically updates when users check in.
- Clearly displayed on the home screen.
- Optional manual adjustment (admin-only).

---

### 🚧 4. Closure & Warning Markers
- Admin can mark the pool as **Closed** or post a **Warning**.
- Examples:
  - "Closed for cleaning"
  - "Storm warning"
  - "Slippery deck - caution"
- Status is reflected prominently on the home screen.
- Access protected by an admin PIN.

---

### 📝 5. Incident Logging
- Admins can log incidents via a secure form.
- Fields:
  - Date and time
  - Description
  - Optional name or initials
- Stored securely for later review.
- Only accessible to admin.

---

### 🚪 6. Self-Service Check-Out
- Residents can check themselves out using their Pool Pass ID.
- No admin intervention required for check-out.
- Automatic occupancy adjustment when residents leave.
- Clear feedback and confirmation messages.

---

## 🧭 Navigation Summary

| Screen               | Description                                         |
|----------------------|-----------------------------------------------------|
| **Home**             | Live occupancy, pool status, quick access buttons   |
| **Check-In**         | Input form for name + guests                        |
| **Rules & Notices**  | View current rules and admin-updated notices        |
| **Admin Panel**      | Access closure tools, incident log, occupancy management    |

---

## 🔒 Admin Access
- Secure areas (closures, logging, occupancy management) require PIN entry.
- PIN entry can time out after a few minutes of inactivity.

---

## 🧼 Designed For
- Use on-site at the pool
- Touchscreen-friendly interface
- Clear visibility even in outdoor settings

## Tech Stack
- Frontend: Web App with HTML, CSS, and JavaScript
- Backend: Local JSON file

---

## 📁 Recommended Folder Structure

```
Buzzly/
├── index.html                 # Main entry point
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   ├── components.css    # Component-specific styles
│   │   └── responsive.css    # Mobile/touchscreen optimizations
│   ├── js/
│   │   ├── app.js           # Main application logic
│   │   ├── checkin.js       # Check-in functionality
│   │   ├── admin.js         # Admin panel functionality
│   │   ├── qr-generator.js  # QR code generation (removed)
│   │   ├── storage.js       # Local storage management
│   │   └── utils.js         # Utility functions
│   ├── images/
│   │   ├── icons/           # UI icons and symbols
│   │   ├── backgrounds/     # Background images
│   │   └── qr-codes/        # Generated QR code storage
│   └── fonts/               # Custom fonts (if needed)
├── data/
│   ├── residents.json       # Resident list data
│   ├── incidents.json       # Incident log data
│   ├── notices.json         # Current notices and rules
│   ├── occupancy.json       # Current occupancy data
│   └── settings.json        # App configuration and admin PIN
├── components/
│   ├── checkin-form.html    # Check-in form component
│   ├── admin-panel.html     # Admin panel component
│   ├── rules-display.html   # Rules and notices component
│   └── occupancy-counter.html # Occupancy display component
├── docs/
│   ├── CONTEXT.md           # This file
│   ├── SETUP.md             # Installation and setup guide
│   └── API.md               # Data structure documentation
├── backup/                  # Backup storage for data files
├── logs/                    # Application logs (if needed)
└── README.md                # Project overview and quick start
```

### 📂 Key Directories Explained

**`assets/`** - All static resources
- `css/` - Stylesheets organized by purpose
- `js/` - JavaScript modules for different features
- `images/` - Visual assets and generated content

**`data/`** - Local JSON data storage
- Separate files for different data types
- Easy backup and restore capabilities

**`components/`** - Reusable HTML components
- Modular structure for maintainability
- Can be loaded dynamically or included statically

**`docs/`** - Project documentation
- Setup guides and technical documentation
- Data structure specifications

**`backup/`** - Data backup location
- Automatic or manual backups of JSON files
- Version control for data integrity

---

