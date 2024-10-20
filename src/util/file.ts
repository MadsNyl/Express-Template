import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (_req, file, cb) => {
        const fileName = `${file.filename}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

export const upload = multer({ storage });