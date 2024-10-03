import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import credentials from './middleware/credentials';
import corsOptions from './config/cors';
import globalErrorHandler from './middleware/errors/global';
import notFound from './controllers/notFound';
import postRouter from './routes/post';
import authRouter from './routes/auth';


const app = express();
const port = process.env.PORT || 8000;

app.use(credentials);
// app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/posts", postRouter);
app.use("/auth", authRouter);

app.all('*', notFound);

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});