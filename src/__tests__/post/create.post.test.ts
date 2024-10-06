import request from 'supertest';
import disconnectServer from '../util/afterAll';
import { createUser, deleteAllUsers } from '../util/user';
import { z } from 'zod';
import { createPostSchema } from '../../schemas/post';
import { app } from '../../server';
import { getAccessToken } from '../../util/auth';
import { HTTPStatusCode } from '../../enums/http';


afterAll(async () => await disconnectServer());
afterEach(async () => await deleteAllUsers());

describe('POST /posts', () => {
    it('should return a 201 status code', async () => {
        const user = await createUser();
        const accessToken = getAccessToken(user);

        const post: z.infer<typeof createPostSchema> = {
            title: 'test',
            content: 'test',
        };

        const response = await request(app)
            .post('/posts')
            .send(post)
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(HTTPStatusCode.CREATED_201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', post.title);
        expect(response.body).toHaveProperty('content', post.content);
    });
});