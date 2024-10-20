import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import credentials from './middleware/credentials';
import globalErrorHandler from './middleware/errors/global';
import { createApp } from './util/app';
import { createRoutes } from './routes';
import { NODE_ENV, PORT } from './config/constants';


export const app = createApp();

app.use(credentials);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

createRoutes(app);

// @ts-ignore
app.use(globalErrorHandler); 


if (NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}