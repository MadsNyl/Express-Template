import 'dotenv/config';


// Pagination
export const pageSize = 20;

// JWT tokens
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const refreshTokenCookieName = 'express-template-refresh-token';

export const accessTokenDuration = '10m';
export const refreshTokenDuration = '7d';

// SMTP
export const smtpService = process.env.SMTP_SERVICE;
export const smtpUser = process.env.SMTP_USER;
export const smtpPassword = process.env.SMTP_PASSWORD;

// API
export const PORT = process.env.PORT || 8000;

// Environment
export const NODE_ENV = process.env.NODE_ENV;