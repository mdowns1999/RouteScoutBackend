// This file starts the port listening
// and connects to MongoDb
const source = require("./source");
const mongodb = require("./db/connect");
const port = process.env.PORT || 8080;

async function start() {
  try {
    await mongodb.initDb();

    const server = source.listen(port);
    console.log(`Connected to Database and listening on port ${port}`);

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log("Shutting down gracefully...");
      await mongodb.closeDb();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
