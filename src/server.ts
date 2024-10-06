import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import credentials from './middleware/credentials';
import globalErrorHandler from './middleware/errors/global';
import { createApp } from './util/app';
import { createRoutes } from './routes';


export const app = createApp();
const port = process.env.PORT || 8000;

app.use(credentials);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

createRoutes(app);

app.use(globalErrorHandler);


if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}