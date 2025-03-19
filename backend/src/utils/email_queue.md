# Handling queue worker

Run the Worker as a Separate Process
This is the best practice because:

The worker runs in its own process, preventing it from slowing down the API.
The server only queues jobs, and the worker handles them asynchronously.
Even if the server crashes or restarts, the worker continues processing jobs from Redis.

### Start the Worker Separately
Instead of importing the worker inside `index.ts`, run `email.ts` in its own process.

Run these in separate terminals:

```sh
# Start the Express API
npm run dev
# Start the Worker
npm run worker:email
```

Alternative: Using a Process Manager (PM2)
If you want the worker to automatically restart and run in the background, use PM2.

1. Install PM2
    ```sh
    npm install -g pm2
    ```

2. Start the Server and Worker
    ```sh
    pm2 start index.ts --name "express-api"
    pm2 start email.ts --name "email-worker"
    ```

3. Check Running Processes
    ```sh
    pm2 list
    ```

4. Keep Them Running After Reboot
    ```sh
    pm2 save
    pm2 startup
    ```

This ensures your API and worker restart automatically if the server reboots.
