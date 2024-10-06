import request from 'supertest';
import disconnectServer from '../util/afterAll';
import { app } from '../../server';
import { z } from 'zod';
import { loginUserSchema } from '../../schemas/user';
import { createUser, deleteAllUsers } from '../util/user';
import { HTTPStatusCode } from '../../enums/http';


afterAll(async () => await disconnectServer());
afterEach(async () => await deleteAllUsers());

describe('POST /auth/cookie/login', () => {
    it('should return a 200 status code', async () => {
        const user = await createUser(
            'test',
            'test',
            'test',
            'test@test.com',
            'password1234'
        );

        const credentials: z.infer<typeof loginUserSchema> = {
            username: user.username,
            password: 'password1234'
        }

        const response = await request(app)
            .post('/auth/cookie/login')
            .send(credentials);

        expect(response.status).toBe(HTTPStatusCode.OK_200);
        expect(response.body).toHaveProperty('accessToken');
    });

    it('should return a 401 status code if user does not exists', async () => {
        const credentials: z.infer<typeof loginUserSchema> = {
            username: 'test',
            password: 'password1234'
        }

        const response = await request(app)
            .post('/auth/cookie/login')
            .send(credentials);

        expect(response.status).toBe(HTTPStatusCode.UNAUTHORIZED_401);
    });

    it('should return a 401 status code if password is incorrect', async () => {
        const user = await createUser(
            'test',
            'test',
            'test',
            'test@test.com',
            'password1234'
        );

        const credentials: z.infer<typeof loginUserSchema> = {
            username: user.username,
            password: 'password12345'
        }

        const response = await request(app)
            .post('/auth/cookie/login')
            .send(credentials);

        expect(response.status).toBe(HTTPStatusCode.UNAUTHORIZED_401);
    });
});