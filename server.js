import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileUpload';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import uploadRouter from './routes/upload.js';
import productRouter from './routes/productRouter.js';
import paymentRouter from './routes/paymentRouter.js';
import path from 'path';

dotenv.config();

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// connect to mongoDB and start express server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}
const URI = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

//routes
app.use('/user', userRouter);
app.use('/api', categoryRouter);
app.use('/api', uploadRouter);
app.use('/api', productRouter);
app.use('/api', paymentRouter);
