import express from 'express';
import postRouter from './post';
import authRouter from './auth';
import notFound from '../controllers/notFound';


export const createRoutes = (app: express.Express) => {
    app.use('/posts', postRouter);
    app.use('/auth', authRouter);
    app.all('*', notFound);
};
