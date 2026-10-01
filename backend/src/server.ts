import app from "./app.js";
import { config } from "./config/config.js";
import { connectMongo } from "./config/mongodb.js";
connectMongo()
  .then(() =>
    app.listen(config.port, () =>
      console.log(`API listening on http://localhost:${config.port}`),
    ),
  )
  .catch((error: unknown) => {
    console.error("Unable to start API.", error);
    process.exit(1);
  });
