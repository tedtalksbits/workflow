import { connect } from './config';

const respository = {
  async selectAll() {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query('SELECT * FROM `users`');
    return rows;
  },
  async insert(name: string) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query(
      'INSERT INTO `users` (`name`) VALUES (?)',
      [name]
    );
    return rows;
  },
  async update(id: number, name: string) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query(
      'UPDATE `users` SET `name` = ? WHERE `id` = ?',
      [name, id]
    );
    return rows;
  },
  async delete(id: number) {
    const connection = await connect();
    if (!connection) {
      return null;
    }
    const [rows] = await connection.query(
      'DELETE FROM `users` WHERE `id` = ?',
      [id]
    );
    return rows;
  },
};

export default respository;
