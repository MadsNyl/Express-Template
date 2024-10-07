import request from 'supertest';
import { z } from 'zod';
import disconnectServer from '../util/afterAll';
import { createUser, deleteAllUsers } from '../util/user';
import { updateUserRoleSchema } from '../../schemas/user';
import { UserRole } from '@prisma/client';
import { app } from '../../server';
import { getAccessToken } from '../../util/auth';
import { HTTPStatusCode } from '../../enums/http';


afterAll(async () => disconnectServer());
afterEach(async () => await deleteAllUsers());

describe('PUT /users/role', () => {
    it('should return a 200 status code for a role update by an admin', async () => {
        const user = await createUser();
        const admin = await createUser(
            'admin',
            UserRole.ADMIN
        );
        const accessToken = getAccessToken(admin);

        const data: z.infer<typeof updateUserRoleSchema> = {
            role: UserRole.EDITOR
        };

        const response = await request(app)
            .put(`/users/role/${user.username}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data);
        
        expect(response.status).toBe(HTTPStatusCode.OK_200);
        expect(response.body).toHaveProperty('role', UserRole.EDITOR);
    });

    it('should return a 403 status code for a role update by a non-admin', async () => {
        const user = await createUser();
        const editor = await createUser(
            'editor',
            UserRole.EDITOR
        );

        const accessToken = getAccessToken(editor);

        const data: z.infer<typeof updateUserRoleSchema> = {
            role: UserRole.ADMIN
        };

        const response = await request(app)
            .put(`/users/role/${user.username}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data);
        
        expect(response.status).toBe(HTTPStatusCode.FORBIDDEN_403);
    });
});