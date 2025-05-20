# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Hotel Reservation Admin Dashboard

A prototype for a hotel reservation administration dashboard built with SvelteKit. The dashboard connects to an existing API backend to manage hotel reservations with CRUD operations.

## Features

- **Reservation List Page**
  - View all reservations in a table format
  - Filter by reservation status, date range, and guest name
  - Sort by columns
  - Pagination for large datasets
  
- **Reservation Detail Page**
  - View comprehensive reservation details
  - Check-in/check-out functionality
  - Cancel reservation
  - View guest and room information
  
- **Reservation Edit Page**
  - Update reservation details
  - Modify stay information
  
- **Create New Reservation**
  - Add new guests
  - Select room types
  - Set check-in/check-out dates

## Project Structure

```
/src
  /lib
    /stores            # Svelte stores for state management
      reservationStore.ts
    /types             # TypeScript interfaces
      types.ts
    api.ts             # API client for backend communication
  /routes
    /reservations      # Reservation-related pages
      /[id]            # Individual reservation detail page
        /edit          # Edit reservation
      /new             # Create new reservation
    /frontend_api      # Mock API for development
```

## Mock API Endpoints

For development purposes, mock API endpoints have been implemented:

- `GET /frontend_api/reservations` - List all reservations
- `GET /frontend_api/reservations/:id` - Get reservation details
- `POST /frontend_api/reservations` - Create new reservation
- `PATCH /frontend_api/reservations/:id` - Update reservation
- `DELETE /frontend_api/reservations/:id` - Cancel reservation
- `POST /frontend_api/reservations/:id/check-in` - Check-in
- `POST /frontend_api/reservations/:id/check-out` - Check-out

## Technologies Used

- SvelteKit
- TypeScript
- TailwindCSS

## Getting Started

### Prerequisites

- Node.js (version 20.9.0 or later)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Navigate to `http://localhost:5173` to view the application

## Future Enhancements

- Advanced reporting and analytics
- Staff management features
- Inventory and room management
- Multi-property support
- Guest communication tools
