import { IpcMainEvent } from 'electron';

export type ConnectionListener = (event: IpcMainEvent, arg: Connection) => void;
export type Connection = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};
