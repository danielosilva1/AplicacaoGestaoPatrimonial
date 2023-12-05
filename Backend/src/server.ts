import express from 'express';
import { router } from './routes';
import cors from 'cors';

const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000'
}

app.use('/uploads', express.static('uploads'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(8000, () => {console.log("Server is running on port 8000...")})