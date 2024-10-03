import { Request, Response } from "express";
import asyncErrorHandler from "../middleware/errors/errorHandler";
import { db } from "../util/db";
import { getPaginationData, getSearchQuery, paginate } from "../util/query";
import { UserRequest } from "../types/request";


export const getAllPosts = asyncErrorHandler(async (req: Request, res: Response) => {
    const {
        search,
        page
    } = req.query;

    const pageQuery = page as string || "1";

    const query = {
        where: {
            ...getSearchQuery(search as string, ["title", "content"])
        },
        ...paginate(pageQuery)
    };

    const totalPosts = await db.post.count();
    const posts = await db.post.findMany(query);
    
    return res.status(200).json({
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

    return res.status(201).json(post);
});