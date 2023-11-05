import { connect } from '../config';
const PROJECT_TABLE = 'projects';
export const repository = {
  async selectAll() {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query(
      `SELECT * FROM ${PROJECT_TABLE} ORDER BY createdAt DESC`
    );
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
      `SELECT ${fields.join(', ')} FROM ${PROJECT_TABLE} WHERE ${keys.join(
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
      `INSERT INTO ${PROJECT_TABLE} (${keys.join(', ')}) VALUES (${keys
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
      `UPDATE ${PROJECT_TABLE} SET ${keys
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
      `DELETE FROM ${PROJECT_TABLE} WHERE id = ?`,
      [id]
    );
    return rows;
  },
};
