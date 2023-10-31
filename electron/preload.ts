/* eslint-disable react-hooks/rules-of-hooks */
import { Project } from '@/types/projects';
import { Task } from '@/types/task';
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import { SystemInfo } from './db/app/appListeners';
import { Connection } from './db/types/connection';
export const ipcRendererWrappers = {
  invoke: async <T>(channel: string, ...args: unknown[]): Promise<T> => {
    return ipcRenderer.invoke(channel, ...args);
  },
};

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
  projects: {
    get: () => ipcRenderer.invoke('get:projects') as Promise<Project[]>,
    add: (project: Partial<Project>) =>
      ipcRenderer.invoke('add:project', project) as Promise<Project[]>,
    update: (id: number, project: Partial<Project>) =>
      ipcRenderer.invoke('update:project', id, project) as Promise<Project[]>,
    delete: (id: number) =>
      ipcRenderer.invoke('delete:project', id) as Promise<Project[]>,
    getById: (id: number) =>
      ipcRenderer.invoke('get:projectById', id) as Promise<Project>,
  },
  tasks: {
    get: () => ipcRenderer.invoke('get:tasks') as Promise<Task[]>,
    getByProjectId: (id: number) =>
      ipcRenderer.invoke('get:tasksByProjectId', id) as Promise<Task[]>,
    add: (projectId: number, task: Partial<Task>) =>
      ipcRenderer.invoke('add:task', projectId, task) as Promise<Task[]>,
    update: (id: number, task: Partial<Task>) =>
      ipcRenderer.invoke('update:task', id, task) as Promise<Task[]>,
    delete: (id: number) =>
      ipcRenderer.invoke('delete:task', id) as Promise<Task[]>,
    getById: (id: number) =>
      ipcRenderer.invoke('get:taskById', id) as Promise<Task>,
  },
  systemInfo: {
    get: () => ipcRenderer.invoke('get:systemInfo') as Promise<SystemInfo>,
  },
  db: {
    connect: (connection: Connection) =>
      ipcRenderer.invoke('connect', connection) as Promise<Connection>,
    disconnect: () => ipcRenderer.invoke('disconnect') as Promise<Connection>,
    getConnection: () =>
      ipcRenderer.invoke('get:connection') as Promise<Connection>,
    getConnectionSync: () =>
      ipcRenderer.invoke('get:connection:sync') as Promise<Connection>,
    getConnectionSyncReply: () =>
      ipcRenderer.invoke('get:connection:sync:reply') as Promise<Connection>,
    getDatabases: () =>
      ipcRendererWrappers.invoke<{ Database: string }[]>('get:databases'),
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);
export type Channels =
  | 'connect'
  | 'get:users'
  | 'disconnect'
  | 'get:connection'
  | 'get:connection:sync'
  | 'get:connection:sync:reply'
  | 'get:projects'
  | 'add:project'
  | 'update:project'
  | 'delete:project'
  | 'get:projectById'
  | 'get:tasks'
  | 'get:tasksByProjectId'
  | 'add:task'
  | 'update:task'
  | 'delete:task'
  | 'get:taskById'
  | 'get:systemInfo'
  | 'shortcut:newTask';

export type ElectronHandler = typeof electronHandler;
function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive']
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
