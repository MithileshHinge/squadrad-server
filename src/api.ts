import express from 'express';
import config from './api/config';

const app = express();
app.listen(config.server.port, () => console.log('app is running'));
