import 'dotenv/config';


// Pagination
export const pageSize = 20;

// JWT tokens
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const refreshTokenCookieName = 'express-template-refresh-token';

export const accessTokenDuration = '10m';
export const refreshTokenDuration = '7d';