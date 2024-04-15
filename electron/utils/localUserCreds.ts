import { UserCredentials } from '@/types/user';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
const LOCALDIR = path.join(app.getPath('userData'), 'local');
const LOCALFILE = path.join(LOCALDIR, 'local.json');
export function storeUserCreds(credentials: UserCredentials) {
  if (!fs.existsSync(LOCALDIR)) {
    fs.mkdirSync(LOCALDIR);
  }
  try {
    const date = new Date();
    const localUserCredentials = {
      ...credentials,
      lastLogin: date,
    };
    fs.writeFileSync(LOCALFILE, JSON.stringify(localUserCredentials));
  } catch (err) {
    console.error(err);
  }
}

export function getUserCreds() {
  try {
    const data = fs.readFileSync(LOCALFILE, 'utf8');
    return JSON.parse(data) as UserCredentials & { lastLogin: Date };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function removeUserCreds() {
  try {
    fs.unlinkSync(LOCALFILE);
  } catch (err) {
    console.error(err);
  }
}
