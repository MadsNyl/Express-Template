import { Request, Response } from 'express';
import asyncErrorHandler from '../middleware/errors/errorHandler';
import { db } from '../util/db';
import { getPaginationData, getSearchQuery, paginate } from '../util/query';
import { UserRequest } from '../types/request';
import { HTTPStatusCode } from '../enums/http';
import { UserRole } from '@prisma/client';


export const getAllPosts = asyncErrorHandler(async (req: Request, res: Response) => {
    const {
        search,
        page
    } = req.query;

    const pageQuery = page as string || '1';

    const query = {
        where: {
            ...getSearchQuery(search as string, ['title', 'content'])
        },
        ...paginate(pageQuery)
    };

    const totalPosts = await db.post.count();
    const posts = await db.post.findMany(query);
    
    return res.status(HTTPStatusCode.OK_200).json({
        ...getPaginationData(totalPosts, parseInt(pageQuery)),
        data: posts
    });
});

export const createPost = asyncErrorHandler(async (req: UserRequest, res: Response) => {
    const { title, content } = req.body;
    const { username } = req;

    const post = await db.post.create({
        data: {
            title,
            content,
            author: {
                connect: {
                    username
                }
            }
        }
    });

    return res.status(HTTPStatusCode.CREATED_201).json(post);
});

export const deletePost = asyncErrorHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const { username, role } = req;

    const post = await db.post.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!post) {
        return res.status(HTTPStatusCode.BAD_REQUEST_400).json({ message: 'Post not found' });
    }

    if (post.authorId !== username && role !== UserRole.ADMIN) {
        return res.status(HTTPStatusCode.FORBIDDEN_403).json({ message: 'Unauthorized' });
    }

    await db.post.delete({
        where: {
            id: parseInt(id)
        }
    });

    return res.status(HTTPStatusCode.NO_CONTENT_204).json();
});