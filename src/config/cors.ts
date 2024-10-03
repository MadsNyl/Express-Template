

export const allowedOrigins = [
    'http://localhost:3000',
];

type CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    optionsSuccessStatus: number;
};

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            callback(new Error('Not allowed by CORS'));
            return;
        }

        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

export default corsOptions;