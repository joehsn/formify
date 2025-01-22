# Formify 

The frontend of **Formify** is a responsive, user-friendly interface for creating, managing, and analyzing forms. Built with React.js, it offers seamless interaction and dynamic features for an optimal user experience.

## Features

- **Dynamic Form Builder:** Drag-and-drop interface for creating forms with live previews.
- **Pagination and Search:** Efficient navigation and management of forms and responses.
- **Custom Field Components:** Includes fields like date pickers, dropdowns, and text fields.

## Tech Stack

- **React.js**: Core framework for building UI components.
- **Zustand**: State management for predictable and scalable application state.
- **Tailwind CSS**: Utility-first CSS framework for fast styling.
- **Axios**: HTTP client for seamless API communication.
- **React Router**: Navigation and routing.
- **React Datepicker**: User-friendly date selection.
- **And many more...**

## Installation

To get started with the Formify frontend:

1. Clone the repository:
   ```bash
   git clone https://github.com/joehsn/formify.git
   cd formify/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `frontend` directory with the following keys:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   The app will be accessible at [http://localhost:3000](http://localhost:3000).

## Directory Structure

```plaintext
frontend/
├── public/            # Static assets
├── src/
│   └ components/      # Reusable UI components
│     └── u/           # Shadcn UI components (e.g., Button, Input, Modal)
│   ├── pages/         # Application pages (e.g., Home, Dashboard, FormBuilder)
│   ├── hooks/         # Custom hooks
│   └── lib/           # Utility functions and constants
│       ├── schemas/   # Form and response schemas
│       └── stores/    # Zustand store configuration
│   ├── types/         # TypeScript types
│   ├── App.js         # Main application component
│   ├── main.js        # Entry point
│   ├── Router.js      # Application routing configuration
├── .env.local         # Environment variables
└── package.json       # Project configuration and dependencies
```

## Available Scripts

In the `frontend` directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder. It bundles React in production mode for optimized performance.

### `npm run lint`
Checks the codebase for linting errors.

### `npm run lint:fix`
Fixes linting errors automatically.

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `build` directory to your preferred hosting service (e.g., AWS S3, Vercel, Netlify).

## Contact

For questions or suggestions, reach out at [joehsn@outlook.com](mailto:joehsn@outloo.com).

