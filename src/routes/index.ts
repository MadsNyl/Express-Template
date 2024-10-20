import express from 'express';
import postRouter from './post';
import authRouter from './auth';
import userRouter from './user';
import uploadRouter from './upload';
import notFound from '../controllers/notFound';


export const createRoutes = (app: express.Express) => {
    app.use('/posts', postRouter);
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/uploads', uploadRouter);
    app.all('*', notFound);
};
