import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js'; // Antigo carroRoutes.js
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';

const app = express();

// Security and Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes Definition
app.use('/api', userRoutes);
app.use('/api', addressRoutes);

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'MedConnect-REST-Architecture',
    message: 'Welcome to the Diagnostic Aid API'
  });
});

// Global Error Handler Middleware (Must be the last one)
app.use(errorHandlerMiddleware);

export default app;
