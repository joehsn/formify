# Formify

Formify is a modern web application designed to simplify form creation, management, and response collection. Built using the MERN stack, it provides an intuitive interface and powerful backend for seamless form workflows.

## Features

- **Dynamic Form Builder:** Create and customize forms with real-time previews.
- **Response Management:** View, search, and analyze responses efficiently.
- **User Authentication:** Role-based access control and secure authentication.
- **Field Validation:** Conditional validation based on field types.

## Project Structure

```
formify/
├── backend/          # Backend services
├── frontend/         # Frontend application
├── README.md         # Project documentation
├── TODO.md           # Task list and progress
```

---

## Backend

The backend is powered by **Node.js** and **Express.js**, providing RESTful APIs for form and user management.

### Features

- RESTful APIs for form and response handling.
- Secure authentication with Passport.js.
- Caching and session management.
- Logging with Winston.
- Rate limiting to prevent abuse.
- CORS and CSRF protection.

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```env
   PORT=YOUR_VALUE_GOES_HERE
   NODE_ENV=YOUR_VALUE_GOES_HERE
   MONGO_URI=YOUR_VALUE_GOES_HERE
   SESSION_SECRET=YOUR_VALUE_GOES_HERE
   CLIENT_URL=YOUR_VALUE_GOES_HERE
   ```

4. Start the server:
   ```bash
   npm start
   ```

The backend will be accessible at `http://localhost:5000`.

---

## Frontend

The frontend is built with **React.js**, providing a responsive and user-friendly interface.

### Features

- Customizable field components.
- Integration with backend APIs.

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:

   ```env
   VITE_API_URL=YOUR_VALUE_GOES_HERE
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The app will be accessible at `http://localhost:3000`.

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4 or higher)
- **Redis**

### Clone the Repository

```bash
git clone https://github.com/joehsn/formify.git
cd formify
```

### Run the Application

1. Start the backend server as described above.
2. Start the frontend application.

---

## Development

### Scripts

- **Backend**:
  - `npm start`: Start the backend server.
  - `npm run dev`: Start the backend server in development mode.
- **Frontend**:
  - `npm start`: Start the frontend development server.
  - `npm run build`: Build the frontend for production.

---

## Roadmap

1. **User Analytics Dashboard:** Provide insights into form responses.
2. **Mobile App:** Build native applications for iOS and Android.
3. **Third-party Integrations:** Google Sheets, Slack, and more.

---

## Contact

For questions or support, reach out at [joehsn@outlook.com](mailto:joehsn@outloo.com).
