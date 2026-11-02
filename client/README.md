# AURELIA — Luxury Hotel & Resort Management System

> **A state-of-the-art, high-end Luxury Hotel Management System Frontend UI** built with **React, TypeScript (TSX), Tailwind CSS**, and modular reusable components.

---

## 💎 1. Visual Identity & Luxury Design System

Designed specifically for five-star and palace-tier hotel chains (such as properties in Monaco, St. Moritz, Bora Bora, and Kyoto).

| Color Token | Hex Code | Description |
|---|---|---|
| **Primary** | `#101722` | Deep Navy midnight shade |
| **Secondary** | `#1B2432` | Refined Charcoal shade |
| **Accent** | `#C6A66B` | Champagne Gold |
| **Background** | `#F7F5F0` | Warm Ivory (light mode) / `#0B0F15` (dark mode) |
| **Surface** | `#FFFFFF` | Crisp White (light mode) / `#151D28` (dark mode) |
| **Text** | `#252A34` | Dark Charcoal |
| **Muted Text** | `#747B87` | Slate Grey |
| **Border** | `#E5E1D8` | Champagne Ivory Border |

- **Typography**: Editorial elegance with `Playfair Display` for suite headlines and serif titles, coupled with `Inter` for interface data and typography.
- **Glassmorphism**: Soft blur backdrop panels (`backdrop-blur-md`) with subtle gold-accent glows and 3D depth.
- **Themes**: Seamless light mode and dark mode switching, persisted automatically in `localStorage`.

---

## 👑 2. Six Role-Based Panels

The application includes an interactive **Frontend Role Simulator Bar** at the top of the viewport. Click any role to preview the dashboard, navigation, and permissions:

### 1. Super Admin Panel (`/super-admin/dashboard`)
- **Dashboard**: Global Portfolio Overview, gross platform revenue trajectory ($4.11M MTD), and 18-property status.
- **Hotel Management**: Onboard new hotels with modal dialog, manage subscriptions, filter by active/pending.
- **Finance & Subscriptions**: Palace Enterprise, Grand Luxury, and Boutique Elite tiers.

### 2. Hotel Admin (GM) Panel (`/hotel-admin/dashboard`)
- **Dashboard**: Occupancy analytics (91.4%), RevPAR index ($1,680), and suite tier distributions.
- **Room Management**: Comprehensive luxury suite catalog, status switcher (Available, Occupied, Cleaning, Maintenance), and Add Suite modal.
- **Booking Management**: Real-time folios, status tabs, and instant **Official Folio Invoice preview with Print and PDF export**.
- **Front Desk**: Interactive **Suite Availability Timeline Grid (CalendarView)** and walk-in reservation creator.
- **VIP Guest Registry**: VIP Tier badges (Diamond, Platinum, Gold), dossiers, lifetime spending, and preferences.
- **Executive Housekeeping**: Interactive sanitization checklists, turnover progress, and priority badges.
- **Michelin Dining**: In-suite dining orders, sommelier wine dispatch, and billing.
- **Staff Operations**: Roster, departments, shifts, and quality scores.

### 3. Front Desk / Concierge Panel (`/receptionist/dashboard`)
- **Arrivals & Departures**: Live check-in and check-out terminal with one-click status transitions.
- **Walk-in Bookings**: Fast-entry modal calculating nights, room rates, and issuing reservations.
- **Folio Billing**: View guest invoices and collect payments.

### 4. VIP Customer / Resident Suite (`/customer/dashboard`)
- **Current Residence**: Live stay countdown, suite photo, private butler contact (Sebastian Laurent), and itinerary.
- **Concierge Privileges**: On-demand in-suite Michelin dining, cellar sommelier tastings, and Riva yacht charters.
- **Browse Suites**: Interactive catalog to explore Presidential Penthouses and Villas with instant booking.

### 5. Housekeeping Panel (`/housekeeping/dashboard`)
- **Assigned Turnovers**: Live checklists for Frette linens, Bulgari amenities, and infinity pool inspection.
- **Hygiene Approvals**: Mark suites as Sanitized & Inspected for guest arrival.
- **Maintenance Reporting**: Immediate dispatch for engineering issues.

### 6. Staff Operations Panel (`/staff/dashboard`)
- **Interactive Clock-In/Clock-Out**: Live attendance status toggle with timestamp tracking.
- **Shift Schedule**: Rotational roster, rest days, and assigned concierge missions.
- **General Management Notices**: Announcements from the General Manager and sommelier team.

---

## 🛠️ 3. Project Structure

```
d:/Hotel/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── index.css
│   ├── types/
│   │   ├── navigation.ts
│   │   ├── hotel.ts
│   │   ├── user.ts
│   │   └── common.ts
│   ├── context/
│   │   ├── AuthContext.tsx        # Role switcher & mock demo users
│   │   ├── ThemeContext.tsx       # Dark & light luxury themes
│   │   └── ToastContext.tsx       # Interactive toast alert queue
│   ├── config/
│   │   └── navigation.ts          # Typed role navigation trees
│   ├── data/
│   │   ├── mockHotels.ts          # Portfolio properties
│   │   ├── mockRooms.ts           # Luxury suites & villas
│   │   ├── mockBookings.ts        # Reservations & folios
│   │   ├── mockGuests.ts          # VIP dossiers
│   │   ├── mockStaff.ts           # Department roster
│   │   ├── mockPayments.ts        # Payments & Michelin dining orders
│   │   ├── mockHousekeeping.ts    # Cleaning checklists & tasks
│   │   └── mockAnalytics.ts       # Revenue & occupancy datasets
│   ├── components/
│   │   ├── layout/                # Sidebar, Header, MobileSidebar, DashboardLayout
│   │   ├── navigation/            # GlobalSearchModal, ThemeToggle, NotificationDropdown
│   │   ├── ui/                    # StatCard, StatsGrid, StatusBadge, Modal, Drawer, Tabs
│   │   ├── data-display/          # DataTable, SimpleChart (SVG), CalendarView, InvoiceModal
│   │   ├── forms/                 # FormField, BookingModal
│   │   └── hotel/                 # RoomCard, BookingCard, CleaningTaskCard, HotelCard
│   └── pages/                     # Dedicated views for all 6 panels + 404 & Generic fallback
```

---

## 🚀 4. How to Run Locally

1. Open a terminal in `d:\Hotel`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
