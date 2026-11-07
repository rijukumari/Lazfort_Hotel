# Lazfort Hotel ERP

A hotel management ERP application intended to manage hotel operations
from one centralized system. It provides role-based areas for platform
administrators, hotel administrators, front-desk staff, housekeeping
teams, and customers.

> **Important:** This README is based on the project details currently
> available. Verify exact folder names, installed versions, API routes,
> environment-variable names, and deployment settings against the
> current repository before treating this as the definitive technical
> specification.

## Contents

-   [Overview](#overview)
-   [Technology Stack](#technology-stack)
-   [Modules](#modules)
-   [Room Booking Workflow](#room-booking-workflow)
-   [Application Architecture](#application-architecture)
-   [Database Design Guidelines](#database-design-guidelines)
-   [Installation and Setup](#installation-and-setup)
-   [Environment Variables](#environment-variables)
-   [Development Commands](#development-commands)
-   [API Integration](#api-integration)
-   [Security](#security)
-   [Deployment](#deployment)
-   [Troubleshooting](#troubleshooting)
-   [Development Standards](#development-standards)

## Overview

Lazfort Hotel ERP is designed to centralize hotel administration and
daily operations. The application aims to provide separate dashboards
and permissions for different user roles, while keeping operational data
synchronized through a Laravel API and MySQL database.

### Project objectives

-   Manage hotel properties, rooms, reservations, guests, and staff.
-   Provide role-based dashboards and access permissions.
-   Connect frontend pages to backend APIs.
-   Persist business data in MySQL.
-   Provide a responsive, professional interface for desktop, tablet,
    and mobile.
-   Keep data consistent across dashboards and avoid unnecessary
    duplicate API requests.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                               Technology
  ----------------------------------- -----------------------------------
  Frontend                            React.js

  Frontend files                      JavaScript / JSX or the convention
                                      already used in the repository

  Backend                             Laravel / PHP

  Database                            MySQL

  Build tool                          Vite, if configured in the frontend

  Version control                     Git and GitHub

  Deployment                          Render or Vercel for frontend;
                                      PHP-compatible hosting for backend
  -----------------------------------------------------------------------

Check `package.json`, `composer.json`, and the project configuration for
exact versions and dependencies.

## Modules

The following describes the intended functional areas. Exact menu labels
and available features depend on the current implementation and
permissions.

### Super Admin

-   Manage platform-level settings and access.
-   Manage hotels/properties and hotel administrator accounts.
-   View platform-wide operational information.
-   Manage roles and permissions where implemented.
-   View system-level reports and configuration.

### Hotel Admin

-   Manage hotel profile and operational settings.
-   Manage room types, rooms, rates, and availability.
-   View and manage reservations.
-   Manage guest records and staff access.
-   Review payments, invoices, and reports.
-   Monitor hotel operations from the dashboard.

### Front Desk / Staff

-   View reservations and guest details for the assigned hotel.
-   Handle guest arrivals and departures.
-   Assign rooms where permitted.
-   Update check-in and check-out status.
-   Coordinate guest requests with relevant teams.

### Housekeeping

-   View rooms requiring cleaning or preparation.
-   Track room-cleaning status.
-   Update room readiness.
-   View assigned housekeeping tasks and service requests.

### Customer

-   Browse available rooms where booking is enabled.
-   Submit a room reservation.
-   View personal booking details and status.
-   Access relevant profile and account information.

### Additional operational areas

Depending on the features enabled in the application, other areas may
include room service, restaurant/orders, inventory, billing, invoices,
notifications, global search, currency settings, analytics, and reports.

## Room Booking Workflow

A typical booking flow should work as follows:

1.  A customer selects an available room and submits a booking.
2.  React sends the booking details to the Laravel backend.
3.  Laravel validates the customer, hotel, room, dates, availability,
    and pricing.
4.  The backend saves the booking in MySQL and returns a booking
    reference and status.
5.  Hotel Admin sees the reservation under **Reservations / Bookings**.
6.  Front Desk staff see the relevant reservation under **Front Desk →
    Reservations**.
7.  Housekeeping receives a room-preparation task when the workflow
    requires it.
8.  The customer sees the reservation under **My Bookings**.

The booking should be stored once and then displayed through
role-appropriate API responses. Do not create separate, unrelated
booking records for each dashboard.

## Application Architecture

``` text
React Frontend
     |
     | HTTP requests (JSON)
     v
Laravel Backend / API
     |
     | Authentication, authorization,
     | validation and business logic
     v
MySQL Database
     |
     v
API response returned to React
```

-   **React:** pages, reusable UI components, navigation, and
    presentation of API data.
-   **Laravel:** business rules, validation, authentication,
    authorization, and database operations.
-   **MySQL:** persistent application data.
-   Production business data should not rely on hard-coded demo arrays
    or browser storage as a replacement for database persistence.

## Database Design Guidelines

Confirm the final schema from Laravel migrations and models. Potential
entities include:

-   Users
-   Roles and permissions
-   Hotels / properties
-   Hotel-user assignments
-   Room types
-   Rooms
-   Rate plans or room prices
-   Guests / customer profiles
-   Bookings / reservations
-   Booking-room details, if required
-   Payments
-   Invoices
-   Housekeeping tasks
-   Notifications
-   Audit records, where required

### Data rules

-   Use primary keys and foreign keys for relationships.
-   Associate hotel-owned records with the correct `hotel_id`.
-   Enforce hotel-level data isolation on the backend.
-   Validate room availability and booking dates on the server.
-   Use database transactions for operations that must succeed or fail
    together.
-   Store monetary values using an appropriate decimal database type.
-   Keep credentials and secrets out of source control.
-   Use Laravel migrations as the source of truth for schema changes.

## Installation and Setup

### Prerequisites

Install the tools required by the repository:

-   Node.js and npm
-   PHP version compatible with the Laravel application
-   Composer
-   MySQL
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/rijukumari/Lazfort_Hotel.git
cd Lazfort_Hotel
```

### 2. Install frontend dependencies

Run this in the directory containing the frontend `package.json`:

``` bash
npm install
```

### 3. Install backend dependencies

Open the Laravel backend directory (the directory containing `artisan`
and `composer.json`) and run:

``` bash
composer install
```

### 4. Configure Laravel

Create `.env` from `.env.example`. On Windows, copy the file and rename
the copy to `.env`.

``` bash
cp .env.example .env
php artisan key:generate
```

Update the database connection settings before running migrations.

### 5. Create and migrate the database

Create a MySQL database, then configure its name, username, and password
in Laravel's `.env` file.

``` bash
php artisan migrate
```

Run migrations only after confirming the database target. Do not use
destructive reset commands on a database containing data you need to
keep.

### 6. Start the backend

From the Laravel backend directory:

``` bash
php artisan serve
```

Use the local URL printed by Laravel. The default is commonly
`http://127.0.0.1:8000`.

### 7. Start the frontend

Configure the frontend API base URL using the variable name expected by
the existing API client. Then run this in the frontend directory:

``` bash
npm run dev
```

Open the local URL printed by Vite.

> The repository may keep frontend and backend in separate folders. Run
> commands from the correct folder and verify the actual repository
> structure first.

## Environment Variables

Never commit real credentials, tokens, or production secrets.

### Example Laravel `.env` settings

``` env
APP_NAME="Lazfort Hotel ERP"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

### Example frontend API URL

A Vite application commonly exposes frontend variables with the `VITE_`
prefix. For example:

``` env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

This is an example only. Verify the exact variable name and API prefix
in the frontend source code. Restart the development server after
changing environment variables.

## Development Commands

### Frontend

``` bash
npm install
npm run dev
npm run build
npm run preview
```

Run only scripts defined in the frontend `package.json`.

### Laravel backend

``` bash
php artisan serve
php artisan route:list
php artisan migrate:status
php artisan optimize:clear
```

Laravel log file:

``` text
storage/logs/laravel.log
```

## API Integration

-   Each page or feature should call the API belonging to that feature.
-   Use a shared API client for the base URL, authentication headers,
    and common error handling.
-   Display loading, empty, success, and error states.
-   Validate data on both frontend and backend; backend validation is
    authoritative.
-   Use appropriate HTTP methods and status codes.
-   Refresh or invalidate relevant cached data after create, update, or
    delete operations.
-   Use independent cache keys for independent pages/resources. One
    page's cache must not block another page from fetching its own data.
-   Avoid duplicate requests caused by unstable effect dependencies or
    unnecessary component remounts.
-   Do not show success messages when the API operation failed.
-   Do not mark bookings, payments, check-ins, or check-outs as
    successful until the backend confirms the operation.

## Security

-   Authenticate users through the configured Laravel authentication
    mechanism.
-   Enforce permissions on the backend, not only by hiding frontend menu
    items.
-   Verify role and hotel access using trusted server-side data.
-   Prevent users from accessing another hotel's records without
    explicit authorization.
-   Validate incoming data.
-   Protect sensitive routes and operations with authorization checks.
-   Keep secrets in environment variables.
-   Use HTTPS in production.
-   Never log passwords, access tokens, or other secrets.

## Deployment

### Frontend

The frontend may be deployed to Render Static Sites or Vercel, depending
on the repository configuration.

Typical Vite settings:

  Setting            Typical value
  ------------------ --------------------------------
  Build command      `npm install && npm run build`
  Output directory   `dist`

Confirm the correct root directory and build command from the
repository. For client-side routing, configure the hosting provider to
rewrite application routes to `index.html`.

### Backend

Deploy Laravel separately to PHP-compatible hosting. Configure:

-   Production `.env` values
-   MySQL connection
-   Application key
-   Laravel `public` directory as the web document root
-   Storage and cache permissions
-   Database migrations
-   Queue, scheduler, and mail settings if used
-   HTTPS and production error logging

Update the frontend API base URL to the deployed backend and configure
Laravel CORS for the deployed frontend domain.

## Troubleshooting

### 500 Internal Server Error

1.  Check `storage/logs/laravel.log`.
2.  Verify database connection values in `.env`.
3.  Confirm required tables and migrations exist.
4.  Inspect the backend exception and validation/business logic.
5.  Inspect the Network tab's Response body; do not assume the frontend
    is the cause.

### 404 Not Found

-   Confirm the endpoint exists in `php artisan route:list`.
-   Check the API prefix and HTTP method.
-   Verify that the frontend calls the correct backend URL.

### Connection refused

-   Confirm Laravel or the deployed backend is running.
-   Verify the frontend API base URL.
-   Check proxy and CORS configuration.

### Data is not appearing in MySQL

-   Inspect the request and response in the browser Network tab.
-   Confirm the frontend sends the expected payload.
-   Check Laravel validation and logs.
-   Verify the controller performs the database operation.
-   Confirm the record is saved to the intended database and table.

### Duplicate API requests

-   Inspect component effects and dependency arrays.
-   Check whether components mount more than once.
-   Review shared contexts and route/layout remounting.
-   Deduplicate in-flight requests by resource key where appropriate.
-   Do not disable React Strict Mode as a substitute for fixing request
    lifecycle issues.

### Frontend build fails

-   Read the first actual build error.
-   Confirm dependencies are installed.
-   Check imports, exports, and component names.
-   Run the same build command locally to reproduce the issue.

## Development Standards

-   Keep components small and reusable.
-   Separate page components from shared layouts and UI components.
-   Keep API calls in a dedicated service/API layer.
-   Organize Laravel controllers, models, requests, and services by
    feature.
-   Use consistent naming for routes, components, endpoints, and
    database fields.
-   Preserve the repository's existing JSX or TSX convention rather than
    mixing file types unnecessarily.
-   Ensure every sidebar item opens its intended page or feature.
-   Display data according to the authenticated user's role and hotel.
-   Test create, view, update, and delete flows against the real
    backend.
-   Test responsive layouts on desktop, tablet, and mobile.
-   Review logs and Network responses before marking a feature complete.

## License

Add the project's selected license and copyright details here before
public distribution.
