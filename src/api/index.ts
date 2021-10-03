import config from './config';
import app from './server';

app.listen(config.server.port, () => console.log('app is running'));
