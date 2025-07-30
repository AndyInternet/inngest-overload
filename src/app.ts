import express from 'express';
import { setRoutes } from './routes/index';
import { logger } from './middleware/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);

// Routes
setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});