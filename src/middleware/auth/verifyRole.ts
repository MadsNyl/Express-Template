import { UserRole } from "@prisma/client";
import { NextFunction, Response } from "express";
import { UserRequest } from "../../types/request";
import APIError from "../errors/error";
import { HTTPStatusCode } from "../../enums/http";


const verifyRole = (...allowedRoles: UserRole[]) => {
    return (req: UserRequest, _res: Response, next: NextFunction) => {
        if (!req?.role) throw new APIError(
            "Du har ikke tilgang til denne ressursen",
            HTTPStatusCode.FORBIDDEN
        )

        const rolesArray = [...allowedRoles, UserRole.ADMIN];
        
        const result = rolesArray.includes(req.role as UserRole);

        if (!result) throw new APIError(
            "Du har ikke tilgang til denne ressursen",
            HTTPStatusCode.FORBIDDEN
        )

        next();
    };
}


export default verifyRole;