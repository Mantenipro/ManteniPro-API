
# MateniPro API

This API manages users, teams, technical reports, customer support, and subscriptions. It integrates authentication (OAuth2, JWT), payments with Stripe, file handling in AWS S3, and email notifications. Designed for technical support and maintenance systems, it offers task assignment, ticket tracking, and automated management of subscriptions and payments.

## Features

- **Maintenance Management:** Tracks equipment, reports, user profiles, and support requests for maintenance.
- **Secure Authentication:** Uses JWT, OAuth2, and bcryptjs for secure login and password management.
- **Cloud Integration:** Integrates AWS S3 for file handling and Stripe for payments and subscriptions.
- **Scalable Data Models:** Uses Mongoose for flexible schemas, including equipment, reports, and users.
- **Email Automation:** Automates notifications and communications with Nodemailer.

## Getting Started

To get started with the project, follow these steps:

1. Clone this repository to your Linux console:
   ```bash
   git clone git@github.com:Mantenipro/ManteniPro-API.git
   cd ManteniPro-API


2. Install dependencies:
   ```bash
   npm install


3. Start the development server:
   ```bash
    npm run dev


## How to Run

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Create an `.env` file**

    ```bash
    touch .env
    ```

    You can find the keys needed in the `example.env` file.

3. **Run in development mode**

    ```bash
    npm run dev
    ```

4. **Run in production mode**

    ```bash
    npm start
    ```

    ## Learn More

To learn more about Express, Mongoose, and using environment variables, check out the following resources:

- [Express Documentation](https://expressjs.com) - Learn about Express.js features.
- [Mongoose Documentation](https://mongoosejs.com) - Learn about Mongoose and MongoDB integration.
- [Dotenv Documentation](https://www.npmjs.com/package/dotenv) - Learn about managing environment variables in Node.js.

Your feedback and contributions to this project are welcome!

