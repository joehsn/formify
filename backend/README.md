# RESTAPI for Formify

This folder contains the backend for the project, built using [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/), with Mongoose for object modeling. It handles the core functionality of the application, such as user authentication, data storage, and interaction with the database.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

Follow these steps to get the backend up and running on your local machine.

1. Clone the repository:

   ```bash
   git clone https://github.com/joehsn/formify.git
   ```

2. Navigate to the backend folder:

   ```bash
   cd formify/backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the `backend` folder (use `env.example` as a reference). You need to configure the following environment variables:

   ```env
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your_session_secret
   ```

   - `MONGODB_URI`: Your MongoDB connection string.
   - `PORT`: The port on which the server will run.
   - `NODE_ENV`: The environment in which the server is running (`development`, `production`, etc.).
   - `SESSION_SECRET`: A secret key for session management.

## Configuration

This backend is designed with scalability and modularity in mind. Key configuration and functionalities include:

- **Database connection**: MongoDB and Mongoose are used for data storage and querying.
- **Authentication**: username-based authentication for user login and secure API access.
- **API validation**: Express middleware for validating requests and ensuring proper data format.

## Running the Application in Development Mode

Once you've installed the necessary dependencies and configured your environment variables:

1. Start the development server:

   ```bash
   npm run dev
   ```

   This will start the server on the specified port (`PORT`) and watch for changes in the source files.

2. To start the server in production mode:
   ```bash
   npm start
   ```

## API Endpoints

The backend exposes several API endpoints for interacting with the application.

### User Routes

- **GET** `/users`: Retrieve the logged in user.
- **POST** `/users/register`: Registers a new user.
- **POST** `/users/login`: Logs in an existing user.
- **POST** `/users/logout`: Logs out the current user.

### Form routes

- **GET** `/forms`: Retrieves all forms.
- **POST** `/forms`: Creates a new form.
- **GET** `/forms/:id`: Retrieves a specific form by ID.
- **PUT** `/forms/:id`: Updates a specific form by ID.
- **DELETE** `/forms/:id`: Deletes a specific form by ID.

### Response Routes

- **GET** `/responses/:formId`: Retrieves all responses.
- **POST** `/responses/:formId`: Creates a new response.
- **GET** `/responses/:formId/:responseId`: Retrieves a specific response by ID.

Each endpoint is protected by username authentication (except the `register` and `login` routes).

### Example Request

To create a new response:

```js
fetch('/api/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formId: 'form_id',
    email: 'example@admin.com',
    answers: [
      { questionId: 'question_id', answer: 'answer' },
      { questionId: 'question_id', answer: 'answer' },
      // Add more answers as needed
    ],
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

## Database Structure

The following collections are defined in the MongoDB database:

### Users

- `_id` (ObjectId): Unique identifier for the user.
- `fullname` (String): User's full name.
- `email` (String): User's email address (unique).
- `password` (String): Hashed password of the user.

### Forms

- `_id` (ObjectId): Unique identifier for the form.
- `id` (UUID): Unique ID of the form (It's used in the URL).
- `userId` (String): ID of the user who created the form.
- `title` (String): Title of the form.
- `description` (String): Description of the form.
- `fields` (Array): Array of fields in the form.
- `status` (String): Status of the form (e.g., "draft", "published").

### Responses

- `_id` (ObjectId): Unique identifier for the response.
- `formId` (String): ID of the form the response is associated with.
- `email` (String): Email of the user who submitted the response.
- `answers` (Object): A key-value pairs of answers submitted by the user.

## Building and Deploying

To build the backend for production, run:

```bash
npm run build
```

This will compile the TypeScript files into JavaScript and output them in the `dist` folder. You can then deploy the `dist` folder to your server or cloud platform.

## Contact

For questions or suggestions, reach out at [joehsn@outlook.com](mailto:joehsn@outloo.com).
