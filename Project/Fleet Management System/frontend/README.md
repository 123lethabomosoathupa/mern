# Fleet Management System — Documentation Pack

> This documentation is based on a direct review of the actual frontend source files (`App.js`, `package.json`, and every page component — `Login`, `Register`, `Dashboard`, `Vehicles`, `Drivers`, `Orders`, `Maintenance`, `Costs`, `Communication`) rather than inferred from the repository name alone. The backend repository's folder structure (`config`, `controllers`, `middleware`, `models`, `routes`) was reviewed to confirm the API shape referenced throughout the frontend, though individual backend files were not inspected line-by-line — that distinction is stated plainly rather than smoothed over.

**Live demo:** https://fleet-frontend-q9r3.onrender.com/
**Frontend repo:** https://github.com/123lethabomosoathupa/fleet-frontend
**Backend repo:** https://github.com/123lethabomosoathupa/fleet-backend

---

## 1. Business Case

### Project Title
**Fleet Management System**

### Project Owner
Khutso Lethabo Mosoathupa

### Executive Summary
The Fleet Management System is a full-stack web application that lets a logistics or delivery business coordinate its vehicles, drivers, and delivery orders from a single dashboard. Dispatchers create delivery orders, assign an available vehicle and driver to each one, track the order through its lifecycle, and monitor the operating costs and maintenance schedule of every vehicle in the fleet. Drivers and dispatchers can also message each other directly from within the app.

It's built as a role-based, multi-user platform (admin, dispatcher, driver) with authenticated access, a REST API backend, and a real-time messaging layer — a meaningfully more complete system than a single-user front-end exercise, though it is still a portfolio-stage MVP rather than a commercial product.

### Business Problem
Small and mid-sized fleet operators managing deliveries without dedicated software typically run into:
- No central record of which vehicles and drivers are currently available versus assigned
- Manual, phone-call-based coordination between dispatchers and drivers
- No structured tracking of an order's status from creation through delivery
- Vehicle running costs (fuel, tolls, insurance) and maintenance history scattered across paper or spreadsheets, making it hard to see the true cost of operating each vehicle
- No easy way for dispatchers and drivers to communicate in one place

### Proposed Solution
A web application that allows a fleet operator to:
- Register and log in as an admin, dispatcher, or driver, with role-based access to features
- Maintain a fleet register (vehicles) and driver register, each with live status (available, in-use, on-duty, in maintenance, etc.)
- Create delivery orders with customer, pickup/delivery, and cargo details, then assign an available vehicle and driver to each one
- Track an order through its status lifecycle (pending → assigned → in-progress → completed)
- Log and categorize vehicle running costs (fuel, insurance, tolls, tax, parking, other) with an auto-calculated total from quantity × unit price
- Schedule and track vehicle maintenance (preventive, corrective, inspection, repair) by priority and status
- Message other users directly, with messages delivered in real time
- See fleet-wide KPIs (vehicle counts, driver counts, order counts, total costs) on a dashboard

### Business Objectives
- Replace ad hoc, phone-based dispatching with a structured, auditable order-assignment workflow
- Give dispatchers real-time visibility into which vehicles and drivers are actually free to take a job
- Centralize cost and maintenance records per vehicle so true operating cost is visible at a glance
- Provide a foundation that can be extended into a live-tracking, customer-facing logistics platform

### Target Users
**Fleet operators, dispatchers, and drivers** at small-to-mid-sized delivery, courier, or logistics businesses who need to coordinate vehicles, people, and orders without adopting a large enterprise TMS (transport management system).

### Business Benefits
- Instant visibility of fleet and driver availability
- Structured order lifecycle instead of informal tracking
- Cost breakdown by type per vehicle, without manual spreadsheet work
- Maintenance scheduling that reduces the risk of missed services
- Built-in messaging removes the need for a separate chat tool between office and drivers

### Success Criteria
The project is considered successful (at its current stage) if:
- A user can register, log in, and be routed to a dashboard reflecting their role
- Vehicles and drivers can be added, edited, and have their status tracked
- An order can be created, assigned to an available vehicle and driver, and moved through its status lifecycle
- Costs and maintenance records can be logged against a specific vehicle
- Two users can exchange messages and see them appear without a manual page refresh
- Every core screen (Dashboard, Vehicles, Drivers, Orders, Maintenance, Costs, Communication) is usable on both desktop and mobile widths

### Current Limitations (stated honestly)
- **No live GPS tracking** — `leaflet` / `react-leaflet` are installed as dependencies, but no map view was found wired into any current page; vehicle location is tracked as data (address fields), not live position
- **No automated tests** — the CRA test scaffolding is present, but no test suites were found in the reviewed files
- **Client-side role gating only** — buttons and actions are hidden based on `user.role` in the frontend; without having reviewed the backend controllers directly, whether every corresponding endpoint independently re-validates that role cannot be confirmed from the frontend code alone
- **No file/photo attachments** — messaging is text-only; no proof-of-delivery photo capture was found
- **Deployed on Render's free tier** (implied by the `.onrender.com` domain), which typically means the backend spins down after inactivity and the first request after idle time will be slow

### Future Enhancements
- Live GPS tracking on the map (the `leaflet`/`react-leaflet` dependencies suggest this was planned)
- Push/email notifications for order assignment and status changes
- Proof-of-delivery capture (signature or photo) on order completion
- Analytics dashboard using `recharts` (already a dependency) for cost and delivery trends over time
- Customer-facing order tracking page (no login required, order-number lookup)
- Automated maintenance reminders based on mileage or elapsed time, not just manually scheduled dates

---

## 2. Technical Specification

### Project Overview
A **full-stack, role-based web application**: a React single-page frontend consuming a REST API, with real-time messaging over WebSockets. The frontend is the artifact reviewed in detail; the backend's structure (Express-style `controllers` / `models` / `routes` / `middleware` / `config` folders, confirmed from the repository listing) matches the routes the frontend calls, but the backend's internal logic was not independently reviewed line-by-line.

### Architecture

```
Presentation Layer (reviewed directly)
──────────────────────────────────────
Browser
   ↓
App.js — React Router routes, MUI theme, AuthProvider
   ↓
Pages (Login, Register, Dashboard, Vehicles, Drivers, Orders,
        Maintenance, Costs, Communication)
   ↓
Shared services: api (axios instance), socket (socket.io-client),
                 AuthContext (useAuth hook)
   ↓
PrivateRoute wrapper — redirects unauthenticated users to /login

Backend (structure confirmed, internals not directly reviewed)
──────────────────────────────────────
Express server (server.js)
   ↓
routes/  →  controllers/  →  models/
   ↓
middleware/ (auth / role checks, inferred from JWT + role usage in frontend)
   ↓
config/ (database connection, inferred)
   ↓
Database (document-style IDs (`_id`) throughout — consistent with MongoDB/Mongoose)
```

Every page follows the same pattern: load data via `api.get()` in a `useEffect`, hold it in local component state, and mutate it through `api.post` / `api.put` / `api.delete` calls followed by a reload. There is no client-side global state manager (Redux, Zustand, etc.) — `AuthContext` is the only shared context, and each page otherwise manages its own state independently.

### Functional Requirements

**Authentication & Authorization**
- Register with name, email, password, phone, and a role (admin, dispatcher, or driver)
- Log in with email and password
- Session persisted via `AuthContext`, gating all routes except `/login` and `/register` through `PrivateRoute`
- UI elements (add/edit/delete buttons, "Schedule Maintenance", "Create Order", etc.) are conditionally rendered based on `user.role`, generally restricted to `admin` and `dispatcher`

**Vehicle Management**
- Add a vehicle with vehicle number, make, model, year, type (truck/van/car/motorcycle), capacity + unit, fuel type, fuel consumption, mileage, status, and notes
- Edit an existing vehicle's details
- Delete a vehicle (with confirmation)
- Assign an available driver to a vehicle, or unassign the current driver
- Vehicle status: available, in-use, maintenance, out-of-service

**Driver Management**
- View drivers with license number, license type, experience, rating, total trips, total distance, and currently assigned vehicle (if any)
- Edit a driver's license details, experience, status, and address
- Delete a driver (with confirmation)
- Driver status: available, on-duty, off-duty, on-leave

**Order Management**
- Create an order with customer details (name, phone, email, address), pickup and delivery addresses, cargo details (description, weight, quantity), priority, distance, estimated delivery time, cost, and notes
- Assign an order to an available vehicle and driver as a separate step after creation
- Update an order's status (pending → assigned → in-progress → completed, or cancelled)
- Delete an order (with confirmation)

**Maintenance Tracking**
- Schedule maintenance against a vehicle: type (preventive/corrective/inspection/repair), priority (low/medium/high/urgent), description, scheduled date, cost, and notes
- Edit or delete an existing maintenance record
- Track status through scheduled → in-progress → completed/cancelled

**Cost Tracking**
- Log a cost against a vehicle: type (fuel, maintenance, insurance, tax, toll, parking, other), date, description, quantity, unit price, payment method, and notes
- Total amount auto-calculates when both quantity and unit price are entered
- View a running total of all costs and a breakdown grouped by cost type
- Delete a cost record

**Communication**
- See a contact list built from all registered drivers (excluding yourself)
- Open a direct conversation with any contact and view message history
- Send a message, which appears immediately and is also delivered in real time over a socket connection (`newMessage` event)
- Delete your own sent messages

**Dashboard**
- At-a-glance counts: total/active vehicles, total/active drivers, pending/active orders, and total operating costs, computed client-side from the same `/vehicles`, `/drivers`, `/orders`, and `/costs` endpoints used elsewhere

### Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Data loads are parallelized with `Promise.all` on pages that need multiple resources (Dashboard, Orders, Communication) |
| **Reliability** | Every mutating action (create/update/delete) is wrapped in try/catch, surfacing the backend's error message via `alert()` on failure |
| **Real-time updates** | New direct messages are pushed via Socket.IO rather than requiring a manual refresh |
| **Usability** | Consistent MUI-based layout across pages; destructive actions (delete vehicle/driver/order/maintenance/cost/message) require a confirmation dialog |
| **Security** | Route-level gating via `PrivateRoute`; role-based conditional rendering of privileged actions in the UI (server-side enforcement not independently confirmed) |

### Technology Stack (verified from source)

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 |
| **Routing** | React Router DOM v6 |
| **UI Library** | MUI (Material UI) v5 + Emotion, MUI Icons |
| **HTTP Client** | Axios |
| **Real-time** | Socket.IO Client |
| **Mapping (installed, not yet wired up)** | Leaflet / React-Leaflet |
| **Charting (installed, not yet wired up)** | Recharts |
| **Build Tooling** | Create React App (`react-scripts` 5.0.1) |
| **Package Management** | npm (Node ≥ 18, npm ≥ 9 per `engines`) |
| **Testing (scaffolded, not confirmed as implemented)** | Jest / React Testing Library |
| **Deployment** | Render (`fleet-frontend-q9r3.onrender.com`) |
| **Backend (structure confirmed via repo, not line-reviewed)** | Node.js / Express — `controllers`, `models`, `routes`, `middleware`, `config` folders |
| **Database (inferred)** | MongoDB, based on consistent `_id`-style document identifiers used throughout every frontend page |
| **Auth (inferred)** | JWT-based session, based on `AuthContext`'s `login`/`register` pattern and role-based access checks |

### Data Model (as consumed by the frontend)

**Vehicle**
| Field | Notes |
|---|---|
| `vehicleNumber`, `make`, `model`, `year` | Identification |
| `type` | truck / van / car / motorcycle |
| `capacity`, `capacityUnit` | kg / tons / cubic_meters |
| `fuelType`, `fuelConsumption` | petrol / diesel / electric / hybrid |
| `mileage` | Current odometer reading (km) |
| `status` | available / in-use / maintenance / out-of-service |
| `assignedDriver` | Reference to a Driver, or null |

**Driver**
| Field | Notes |
|---|---|
| `user` | Reference to the underlying User account |
| `licenseNumber`, `licenseType`, `licenseExpiry` | Licensing details |
| `experience` | Years |
| `status` | available / on-duty / off-duty / on-leave |
| `rating`, `totalTrips`, `totalDistance` | Performance stats |
| `currentVehicle` | Reference to a Vehicle, or null |

**Order**
| Field | Notes |
|---|---|
| `orderNumber` | Generated identifier |
| `customer` | name, phone, email, address |
| `pickupLocation`, `deliveryLocation` | Each with an address |
| `cargoDetails` | description, weight, quantity |
| `priority` | low / medium / high / urgent |
| `distance`, `estimatedDeliveryTime`, `cost`, `notes` | |
| `status` | pending / assigned / in-progress / completed / cancelled |
| `assignedVehicle`, `assignedDriver` | Set via the separate assign step |

**Maintenance Record**
| Field | Notes |
|---|---|
| `vehicle` | Reference to a Vehicle |
| `type` | preventive / corrective / inspection / repair |
| `priority` | low / medium / high / urgent |
| `status` | scheduled / in-progress / completed / cancelled |
| `description`, `scheduledDate`, `completedDate`, `cost`, `notes` | |

**Cost Record**
| Field | Notes |
|---|---|
| `vehicle` | Reference to a Vehicle |
| `type` | fuel / maintenance / insurance / tax / toll / parking / other |
| `date`, `description` | |
| `quantity`, `unitPrice`, `amount` | `amount` auto-calculates from quantity × unitPrice when both are present |
| `paymentMethod` | cash / card / bank-transfer / other |
| `notes` | |

**Message**
| Field | Notes |
|---|---|
| `sender`, `recipient` | User references |
| `message`, `type` | `type` currently used as `'direct'` |
| `createdAt` | Timestamp, displayed in `en-ZA` locale |

### API Endpoints (as called from the frontend)
No OpenAPI/Swagger spec was found in the reviewed files, so this list reflects only the endpoints the frontend actually calls:

| Method | Endpoint | Used for |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Authenticate |
| GET | `/auth/me` | Current user info |
| GET / POST / PUT / DELETE | `/vehicles`, `/vehicles/:id` | Vehicle CRUD, incl. filtering by `?status=available` |
| GET / PUT / DELETE | `/drivers`, `/drivers/:id` | Driver management, incl. filtering by `?status=available` |
| GET / POST / PUT / DELETE | `/orders`, `/orders/:id` | Order CRUD |
| PUT | `/orders/:id/assign` | Assign vehicle + driver to an order |
| GET / POST / PUT / DELETE | `/maintenance`, `/maintenance/:id` | Maintenance CRUD |
| GET / POST / DELETE | `/costs`, `/costs/:id` | Cost record CRUD |
| GET | `/messages/conversation/:userId` | Load a conversation thread |
| POST / DELETE | `/messages`, `/messages/:id` | Send / delete a message |

### System Workflow

```
User registers or logs in
   ↓
Routed to Dashboard (role-aware summary of fleet, drivers, orders, costs)
   ↓
Dispatcher/Admin adds vehicles and drivers to the system
   ↓
Dispatcher/Admin creates a delivery order
   ↓
Dispatcher/Admin assigns an available vehicle + driver to the order
   ↓
Order status is updated as it progresses (assigned → in-progress → completed)
   ↓
Costs are logged against vehicles as they're incurred (fuel, tolls, etc.)
   ↓
Maintenance is scheduled and tracked against vehicles
   ↓
Dispatcher and drivers message each other directly, in real time, as needed
```

---

## 3. User Guide

### Introduction
The Fleet Management System helps a dispatcher coordinate vehicles, drivers, and delivery orders from one dashboard, while giving both dispatchers and drivers a shared messaging channel. Live demo: https://fleet-frontend-q9r3.onrender.com/

### Getting Started
1. Open the live site (or your local dev server).
2. If you don't have an account, click **Register here** on the login page.
3. Fill in your name, email, phone, choose a role (Admin, Dispatcher, or Driver), and set a password.
4. You'll be logged in automatically and taken to the **Dashboard**.
5. Returning users log in with their email and password from the **Fleet Management Login** page.

### Reading the Dashboard
The dashboard shows: total and active vehicles, total and active drivers, pending and in-progress orders, and total operating costs across the fleet — all pulled live from the current state of your data.

### Managing Vehicles
1. Go to **Vehicles**.
2. Click **Add Vehicle** (admin/dispatcher only) and fill in vehicle number, make, model, year, type, capacity, fuel type, mileage, and status.
3. Use the **pencil icon** to edit a vehicle, or the **trash icon** to delete one (you'll be asked to confirm).
4. If a vehicle has no driver, click **Assign Driver** and pick from the list of currently available drivers.
5. If a vehicle already has a driver, click **Unassign** to free up both the vehicle and the driver.

### Managing Drivers
1. Go to **Drivers** to see every driver's license info, experience, rating, trip history, and current vehicle assignment.
2. Admin/dispatcher can click the **pencil icon** to update a driver's license details, status, or address.
3. The **trash icon** deletes a driver record (with confirmation).

### Creating and Assigning Orders
1. Go to **Orders** and click **Create Order** (admin/dispatcher only).
2. Fill in customer info, pickup and delivery addresses, cargo details, priority, distance, estimated delivery time, and cost.
3. Once created, click **Assign** on the order card, then choose an available vehicle and driver.
4. Update the order's status as it moves through its lifecycle, or delete it if needed.

### Scheduling Maintenance
1. Go to **Maintenance** and click **Schedule Maintenance** (admin/dispatcher only).
2. Choose the vehicle, maintenance type, priority, description, scheduled date, and estimated cost.
3. Edit the record later to update its status or add the completed date and actual cost.

### Logging Costs
1. Go to **Costs** and click **Add Cost**.
2. Choose the vehicle, cost type, date, and description.
3. Enter either a total amount directly, or a quantity and unit price — the total will calculate automatically.
4. The page shows your total costs and a breakdown by cost type at the top.

### Messaging
1. Go to **Communication**.
2. Select a contact from the list on the left.
3. Type a message and press **Enter** (or click **Send**) — messages you send appear instantly, and new messages from others arrive in real time without refreshing.
4. You can delete any message you sent using the delete icon on that message bubble.

---

## Sources
This documentation was produced from direct inspection of the frontend's actual source files (`App.js`, `package.json`, `Login.js`, `Register.js`, `Dashboard.js`, `Vehicles.js`, `Drivers.js`, `Orders.js`, `Maintenance.js`, `Costs.js`, `Communication.js`). The backend repository's top-level folder structure was reviewed to confirm the API shape (`controllers`, `models`, `routes`, `middleware`, `config`), but individual backend source files were not opened or reviewed line-by-line — any backend-side detail in this document (auth mechanism, database engine, role enforcement) is marked as inferred rather than confirmed.
