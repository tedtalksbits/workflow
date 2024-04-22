/* eslint-disable react-hooks/rules-of-hooks */
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import { SystemInfo } from './app/appListeners';
import { userChannels } from './user/user.channels';
import { userServices } from './user/user.services';

import { projectServices } from './project/project.services';
import { projectChannels } from './project/project.channels';
import { themeServices } from './theme/theme.services';
import { themeChannels } from './theme/theme.channels';
import { taskServices } from './task/task.services';
import { taskChannels } from './task/task.channels';
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
  theme: {
    toggle: (...args: Parameters<typeof themeServices.toggleTheme>) =>
      ipcRenderer.invoke<ReturnType<typeof themeServices.toggleTheme>>(
        themeChannels.toggleTheme,
        ...args
      ),
    system: (...args: Parameters<typeof themeServices.setSystemTheme>) =>
      ipcRenderer.invoke<ReturnType<typeof themeServices.setSystemTheme>>(
        'dark-mode:system',
        ...args
      ),
  },
  user: {
    logIn: async (...args: Parameters<typeof userServices.login>) =>
      ipcRenderer.invoke<ReturnType<typeof userServices.login>>(
        userChannels.login,
        ...args
      ),
    signUp: async (...args: Parameters<typeof userServices.register>) =>
      ipcRenderer.invoke<ReturnType<typeof userServices.register>>(
        userChannels.register,
        ...args
      ),
    loginLocal: async (...args: Parameters<typeof userServices.loginLocal>) =>
      ipcRenderer.invoke<ReturnType<typeof userServices.loginLocal>>(
        userChannels.loginLocal,
        ...args
      ),
    logOut: async (...args: Parameters<typeof userServices.logOut>) =>
      ipcRenderer.invoke<ReturnType<typeof userServices.logOut>>(
        userChannels.logOut,
        ...args
      ),
  },
  projects: {
    get: async (...args: Parameters<typeof projectServices.getProjects>) =>
      ipcRenderer.invoke<ReturnType<typeof projectServices.getProjects>>(
        projectChannels.getProjects,
        ...args
      ),
    add: async (...args: Parameters<typeof projectServices.addProject>) =>
      ipcRenderer.invoke<ReturnType<typeof projectServices.addProject>>(
        projectChannels.addProject,
        ...args
      ),
    update: async (...args: Parameters<typeof projectServices.updateProject>) =>
      ipcRenderer.invoke<ReturnType<typeof projectServices.updateProject>>(
        projectChannels.updateProject,
        ...args
      ),
    delete: async (...args: Parameters<typeof projectServices.deleteProject>) =>
      ipcRenderer.invoke<ReturnType<typeof projectServices.deleteProject>>(
        projectChannels.deleteProject,
        ...args
      ),
    getById: async (
      ...args: Parameters<typeof projectServices.getProjectById>
    ) =>
      ipcRenderer.invoke<ReturnType<typeof projectServices.getProjectById>>(
        projectChannels.getProjectById,
        ...args
      ),
  },
  tasks: {
    getByProjectId: async (
      ...args: Parameters<typeof taskServices.getTasksByProjectId>
    ) =>
      ipcRenderer.invoke<ReturnType<typeof taskServices.getTasksByProjectId>>(
        taskChannels.getTasksByProjectId,
        ...args
      ),
    add: async (...args: Parameters<typeof taskServices.createTask>) =>
      ipcRenderer.invoke<ReturnType<typeof taskServices.createTask>>(
        taskChannels.createTask,
        ...args
      ),

    update: async (...args: Parameters<typeof taskServices.updateTask>) =>
      ipcRenderer.invoke<ReturnType<typeof taskServices.updateTask>>(
        taskChannels.updateTask,
        ...args
      ),
    delete: async (...args: Parameters<typeof taskServices.deleteTask>) =>
      ipcRenderer.invoke<ReturnType<typeof taskServices.deleteTask>>(
        taskChannels.deleteTask,
        ...args
      ),

    addRecurring: async (
      ...args: Parameters<typeof taskServices.addRecurringTask>
    ) =>
      ipcRenderer.invoke<ReturnType<typeof taskServices.addRecurringTask>>(
        taskChannels.addRecurringTask,
        ...args
      ),
  },
  systemInfo: {
    get: () => ipcRenderer.invoke('get:systemInfo') as Promise<SystemInfo>,
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
export type AddRecurringTask = typeof electronHandler.tasks.addRecurring;
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
