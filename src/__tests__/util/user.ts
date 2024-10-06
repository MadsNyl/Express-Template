import bcrypt from 'bcrypt';
import { db } from "../../util/db";
import { UserRole } from '@prisma/client';


export const createUser = async (
    username: string = 'test',
    role: UserRole = UserRole.USER,
    password: string = 'password1234'
) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            username,
            firstName: `${username}_first`,
            lastName: `${username}_last`,
            email: `${username}@test.com`,
            password: hashedPassword,
            role
        }
    });

    return user;
};

export const deleteAllUsers = async () => await db.user.deleteMany();