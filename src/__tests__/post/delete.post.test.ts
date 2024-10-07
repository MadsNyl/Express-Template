import request from 'supertest';
import { getAccessToken } from '../../util/auth';
import disconnectServer from '../util/afterAll';
import { createPost } from '../util/post';
import { createUser, deleteAllUsers } from '../util/user';
import { app } from '../../server';
import { HTTPStatusCode } from '../../enums/http';
import { UserRole } from '@prisma/client';


afterAll(async () => await disconnectServer());
afterEach(async () => await deleteAllUsers());

describe('POST /posts/:id', () => {
    it('should return a 204 status code', async () => {
        const user = await createUser();
        const accessToken = getAccessToken(user);

        const post = await createPost(
            'test',
            'test',
            user
        );

        const response = await request(app)
            .delete(`/posts/${post.id}`)
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(HTTPStatusCode.NO_CONTENT_204);
    });

    it('should return a 403 status code if user is not the author', async () => {
        const author = await createUser('author');
        const user = await createUser('user');
        const accessToken = getAccessToken(user);

        const post = await createPost(
            'test',
            'test',
            author
        )

        const response = await request(app)
            .delete(`/posts/${post.id}`)
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(HTTPStatusCode.FORBIDDEN_403);
    });

    it('should return a 204 status code if user is an admin', async () => {
        const author = await createUser('author');
        const admin = await createUser('admin', UserRole.ADMIN);
        const accessToken = getAccessToken(admin);

        const post = await createPost(
            'test',
            'test',
            author
        );

        const response = await request(app)
            .delete(`/posts/${post.id}`)
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(HTTPStatusCode.NO_CONTENT_204);
    });
});