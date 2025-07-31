import express from "express";
import path from "path";
import { setRoutes } from "./routes/index";
import { logger } from "./middleware/index";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Routes
setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
