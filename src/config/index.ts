import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'squadrad';

const DATABASE = {
  uri: MONGODB_URI,
  dbName: DB_NAME,
};

const config = {
  server: SERVER,
  database: DATABASE,
};

export default config;
