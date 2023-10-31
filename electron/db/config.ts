import mysql from 'mysql2';
import fs from 'fs/promises';
import { localPath } from './connectionListener';
import path from 'node:path';
import { Connection } from './types/connection';

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
  // create db if dbconfig.shouldCreateDB is true

  if (dbConfig.shouldCreateDB) {
    const connection = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      port: dbConfig.port,
      password: dbConfig.password,
    });
    connection.connect();
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);
    connection.end();
  }

  const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    port: dbConfig.port,
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

export async function init() {
  const connection = await connect();
  const dbConfig = await getConfigFromLocal();
  if (!connection || !dbConfig) {
    return null;
  }
  try {
    // check if tables already exist

    const [rows] = await connection.query<never[]>(
      `
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = '${dbConfig.database}'
      AND TABLE_NAME = 'projects';
      `
    );
    console.log(rows);
    const isAlreadyInit = rows.length > 0;
    if (isAlreadyInit) {
      return {
        success: true,
        message: 'already initialized',
      };
    }
  } catch (e) {
    console.log(e);
    const error = e as Error;
    return {
      success: false,
      message: error.message,
    };
  }
  try {
    // await connection.query(`DROP TABLE IF EXISTS tasks;`);

    // await connection.query(`DROP TABLE IF EXISTS projects;`);

    // await connection.query(`DROP TABLE IF EXISTS users;`);

    await connection.query(
      `CREATE TABLE projects (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      icon varchar(255) DEFAULT NULL,
      description text,
      tags varchar(255) DEFAULT NULL,
      createdAt datetime DEFAULT CURRENT_TIMESTAMP,
      updatedAt datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      members varchar(255) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY id_UNIQUE (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;      
  `
    );

    await connection.query(
      `CREATE TABLE tasks (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      description text,
      priority enum('low','medium','high') DEFAULT 'low',
      status enum('todo','inProgress','done') DEFAULT 'todo',
      createdAt datetime DEFAULT CURRENT_TIMESTAMP,
      updatedAt datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      assignee varchar(255) DEFAULT NULL,
      projectId int NOT NULL,
      dueDate datetime DEFAULT NULL,
      tags varchar(255) DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY id_UNIQUE (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
    );

    // await connection.query(
    //   `CREATE TABLE users (
    //   id int NOT NULL AUTO_INCREMENT,
    //   name varchar(255) NOT NULL,
    //   email varchar(255) NOT NULL,
    //   photoURL varchar(255) DEFAULT NULL,
    //   createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    //   updatedAt datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //   PRIMARY KEY (id),
    //   UNIQUE KEY id_UNIQUE (id)
    // ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
    // );

    // await connection.query(
    //   `ALTER TABLE tasks
    //   ADD CONSTRAINT fk_tasks_users
    //   FOREIGN KEY (userId) REFERENCES users(id)
    //   ON DELETE CASCADE
    //   ON UPDATE CASCADE;`
    // );

    await connection.query(
      `ALTER TABLE tasks
      ADD CONSTRAINT fk_tasks_projects
      FOREIGN KEY (projectId) REFERENCES projects(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;`
    );

    // await connection.query(
    //   `ALTER TABLE projects
    //   ADD CONSTRAINT fk_projects_users
    //   FOREIGN KEY (userId) REFERENCES users(id)
    //   ON DELETE CASCADE
    //   ON UPDATE CASCADE;`
    // );

    return {
      success: true,
      message: 'success',
    };
  } catch (e) {
    console.log(e);
    const error = e as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}
