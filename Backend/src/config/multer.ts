import { FileFilterCallback } from "multer";

const multer = require('multer');
const moment = require('moment');

type DestinationCallback = (error: Error | null, destination: String) => void;
type FileNameCallback = (error: Error | null, filename: String) => void;

export const imageStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, process.env.UPLOADS_IMG_PATH + '');
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        const ext = file.mimetype.split("/")[1];
        const now = moment().format('DD-MM-YYYY HH-mm-ss');
        cb(null, `image ${now}.${ext}`);
    }
});

export const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const uploadImage = multer({storage: imageStorage, fileFilter: imageFilter});

export const pdfStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, process.env.UPLOADS_PATH +  '/pdf');
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        const ext = file.mimetype.split("/")[1];
        const now = moment().format('DD-MM-YYYY HH-mm-ss');
        cb(null, `report ${now}.${ext}`);
    }
});

export const pdfFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const uploadPdf = multer({storage: pdfStorage, fileFilter: pdfFilter});