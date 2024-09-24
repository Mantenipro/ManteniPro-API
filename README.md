
# MateniPro API

This is the API for managing maintenance operations in the MateniPro system.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` with your browser to test the API locally.

### API Routes

You can start testing the API by editing `index.js` or adding routes in the `routes` directory. The server will auto-reload when you modify the files.

## Deployment on Render

To deploy this API on Render, follow these steps:

1. Push your code to a Git repository (e.g., GitHub or GitLab).
2. Sign in to [Render](https://render.com) and create a new Web Service.
3. Connect your Git repository.
4. Select `Node.js` as the environment and use the default settings.
5. Set the build command to:

   ```bash
   npm install
   ```

6. Set the start command to:

   ```bash
   npm start
   ```

7. Add any required environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, etc.).
8. Click "Create Web Service" and wait for Render to deploy your API.

Once deployed, your API will be accessible at the URL provided by Render.

## Learn More

To learn more about Express, Mongoose, and using environment variables, check out the following resources:

- [Express Documentation](https://expressjs.com) - Learn about Express.js features.
- [Mongoose Documentation](https://mongoosejs.com) - Learn about Mongoose and MongoDB integration.
- [Dotenv Documentation](https://www.npmjs.com/package/dotenv) - Learn about managing environment variables in Node.js.

Your feedback and contributions to this project are welcome!

