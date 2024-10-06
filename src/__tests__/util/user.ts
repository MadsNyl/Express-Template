import bcrypt from 'bcrypt';
import { db } from "../../util/db";


export const createUser = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
    });

    return user;
};

export const deleteAllUsers = async () => await db.user.deleteMany();