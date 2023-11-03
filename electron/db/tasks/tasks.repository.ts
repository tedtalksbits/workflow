import { connect } from '../config';
import { Task } from '../../../src/types/task';
import { Pool } from 'mysql2';
const TASKS_TABLE = 'tasks';
export const repository = {
  async selectAll() {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query(`SELECT * FROM ${TASKS_TABLE}`);
    return rows;
  },
  async select<T extends Record<string, unknown>>(fields: string[], where: T) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const keys = Object.keys(where);
    const values = Object.values(where);

    const [rows] = await connection.query(
      `SELECT ${fields.join(', ')} FROM ${TASKS_TABLE} WHERE ${keys.join(
        ' = ? AND '
      )} = ?`,
      values
    );
    return rows;
  },
  async insert(data: Record<string, unknown>) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    const [rows] = await connection.query(
      `INSERT INTO ${TASKS_TABLE} (${keys.join(', ')}) VALUES (${keys
        .map(() => '?')
        .join(', ')})`,
      values
    );

    return rows;
  },
  async update(id: number, data: Record<string, unknown>) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    const [rows] = await connection.query(
      `UPDATE ${TASKS_TABLE} SET ${keys
        .map((key) => `${key} = ?`)
        .join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return rows;
  },
  async delete(id: number) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query(
      `DELETE FROM ${TASKS_TABLE} WHERE id = ?`,
      [id]
    );
    return rows;
  },
  async insertDaily(data: Task, frequency: string) {
    const connection = await connect();
    if (!connection) {
      return null;
    }

    // create sp_taskInsertDaily
    await connection.query('DROP PROCEDURE IF EXISTS sp_taskInsertDaily;');
    await connection.query(`
      CREATE PROCEDURE sp_taskInsert(
        IN projectId INT,
        IN title VARCHAR(255),
        IN description VARCHAR(255),
        IN priority enum('low','medium','high'),
        IN assignee VARCHAR(255),
        IN dueDate DATETIME,
        IN tags VARCHAR(255)
      )
      BEGIN
        INSERT INTO tasks (projectId, title, description, priority, assignee, dueDate, tags)
        VALUES (projectId, title, description, priority, assignee, dueDate, tags);
      END
    `);
    // create event calling sp_taskInsertDaily

    const eventName = `taskInsertDaily_${data.title}`;
    const [rows] = await connection.query(
      `CREATE EVENT IF NOT EXISTS ${eventName} ON SCHEDULE EVERY 1 DAY STARTS CURRENT_TIMESTAMP DO CALL sp_taskInsertDaily(?, ?, ?, ?, ?, ?, ?)`,
      [
        data.projectId,
        data.title,
        data.description,
        data.priority,
        data.assignee,
        data.dueDate,
        data.tags,
      ]
    );
    console.log('create event res', rows);
    await connection.query(`SET GLOBAL event_scheduler = ON;`);

    console.log('after set global event_scheduler');

    return rows;
  },
};
