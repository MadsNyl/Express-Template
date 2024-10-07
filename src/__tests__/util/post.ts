import { User } from '@prisma/client';
import { db } from '../../util/db';


export const createPost = async (
    title: string = 'test',
    content: string = 'test',
    author: User
) => {
    return await db.post.create({
        data: {
            title,
            content,
            author: {
                connect: {
                    username: author.username
                }
            }
        }
    });
};