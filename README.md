# Authentication Service

This is a simple authentication service built using Express.

## Routes

### POST /register
Registers a new user.

### POST /login
Logs in a user and returns an authentication token.

### POST /reset-password/:token
Resets the user's password using the provided token.

### POST /forgot-password
Sends a password reset email with a token to the user’s email address.

### GET /profile
Retrieves the authenticated user's profile.

## How to Run the App

1. Clone the repository:
   ```bash
   git clone https://github.com/mdrhnyc/auth-service.git

2. Navigate to the project folder:
    ```bash
    cd auth-service

3. Install dependencies:
    ```bash
    npm install

4. Run the app
    ```bash
    npm start

The app will now be running on http://localhost:3000 by default.

