import mysql from 'mysql2';
import fs from 'fs/promises';
import { localPath } from './connectionListener';
import path from 'node:path';
import { Connection } from './connection';

async function getConfigFromLocal() {
  const dbConfigPath = path.join(localPath, 'dbConfig.json');
  try {
    const dbConfig = await fs.readFile(dbConfigPath, 'utf-8');

    return JSON.parse(dbConfig) as Connection;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function connect() {
  const dbConfig = await getConfigFromLocal();
  if (!dbConfig) {
    return null;
  }
  const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = pool.promise();

  connection.on('connection', (conn) => {
    console.log('connection');
    conn.on('error', (err) => {
      console.log('error', err);
    });
    conn.on('close', (err) => {
      console.log('close', err);
    });
    conn.on('end', (err) => {
      console.log('end', err);
    });
  });

  return connection;
}
