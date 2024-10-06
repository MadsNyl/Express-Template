import request from 'supertest';
import { app } from '../../server';
import { z } from 'zod';
import { registerUserSchema } from '../../schemas/user';
import { HTTPStatusCode } from '../../enums/http';
import disconnectServer from '../util/afterAll';
import { createUser, deleteAllUsers } from '../util/user';


afterAll(async () => await disconnectServer());
afterEach(async () => await deleteAllUsers());

describe('POST /auth/register', () => {
    it('should return a 201 status code', async () => {
        const newUser: z.infer<typeof registerUserSchema> = {
            username: 'test',
            firstName: 'test',
            lastName: 'test',
            email: 'test@test.com',
            password: 'password1234',
            rePassword: 'password1234',
        };

        const response = await request(app)
            .post('/auth/register')
            .send(newUser);
                
        expect(response.status).toBe(HTTPStatusCode.CREATED_201);
        expect(response.body).toHaveProperty('username', newUser.username);
        expect(response.body).toHaveProperty('firstName', newUser.firstName);
        expect(response.body).toHaveProperty('lastName', newUser.lastName);
        expect(response.body).toHaveProperty('email', newUser.email);
    });

    it('should return a 409 status code if user already exists', async () => {
        const user = await createUser();

        const newUser: z.infer<typeof registerUserSchema> = {
            ...user,
            rePassword: user.password
        };

        const response = await request(app)
            .post('/auth/register')
            .send(newUser);
        
        expect(response.status).toBe(HTTPStatusCode.CONFLICT_409);
    });
});
