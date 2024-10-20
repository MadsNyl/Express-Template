import { Request, Response } from 'express';
import { db } from '../util/db';
import { getPaginationData, getSearchQuery, paginate } from '../util/query';
import { UserRequest } from '../types/request';
import { HTTPStatusCode } from '../enums/http';
import { UserRole } from '@prisma/client';
import APIError from '../middleware/errors/error';
import asyncHandler from 'express-async-handler';


export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
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
    
    res.status(HTTPStatusCode.OK_200).json({
        ...getPaginationData(totalPosts, parseInt(pageQuery)),
        data: posts
    });
});

export const createPost = asyncHandler(async (req: UserRequest, res: Response) => {
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

    res.status(HTTPStatusCode.CREATED_201).json(post);
});

export const deletePost = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const { username, role } = req;

    const post = await db.post.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!post) {
        res.status(HTTPStatusCode.BAD_REQUEST_400).json({ message: 'Post not found' });
        return;
    }

    if (post.authorId !== username && role !== UserRole.ADMIN) {
        res.status(HTTPStatusCode.FORBIDDEN_403).json({ message: 'Unauthorized' });
        return;
    }

    await db.post.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.status(HTTPStatusCode.NO_CONTENT_204).json();
});