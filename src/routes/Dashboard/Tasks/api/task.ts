import { db } from '@/firebase';
import { GoogleCredentials } from '@/providers/authProvider';
import { Task } from '@/types/task';
export const TASKS_COLLECTION = 'tasks';
export const TASKS_SUBCOLLECTION = 'task';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

const addTask = async ({
  task,
  user,
  projectId,
  onSuccess,
  onError,
}: AddTaskProps) => {
  if (!user) return console.log('no user');
  if (!projectId) return console.log('no project id');

  try {
    await addDoc(
      collection(db, TASKS_COLLECTION, user.uid, TASKS_SUBCOLLECTION),
      task
    );
    onSuccess();
  } catch (error) {
    console.log(error);
    onError();
  }
};

const deleteTask = async ({
  id,
  user,
  onSuccess,
  onError,
}: DeleteTaskProps) => {
  if (!user) return console.log('no user');
  try {
    const taskRef = doc(
      db,
      TASKS_COLLECTION,
      user.uid,
      TASKS_SUBCOLLECTION,
      id
    );
    await deleteDoc(taskRef);
    onSuccess();
  } catch (error) {
    console.log(error);
    onError();
  }
};

const updateTask = async ({
  id,
  update,
  user,
  onSuccess,
  onError,
}: UpdateTaskProps) => {
  if (!user) {
    onError();
    throw new Error('No user');
  }

  try {
    const taskRef = doc(
      db,
      TASKS_COLLECTION,
      user.uid,
      TASKS_SUBCOLLECTION,
      id
    );
    await updateDoc(taskRef, update);
    onSuccess();
  } catch (error) {
    console.log(error);
    onError();
  }
};

const getTasks = async ({
  projectId,
  user,
  onSuccess,
  onError,
}: GetTasksProps) => {
  if (!user) {
    onError();
    throw new Error('No user');
  }
  const tasksCol = collection(
    db,
    TASKS_COLLECTION,
    user.uid,
    TASKS_SUBCOLLECTION
  );
  onSnapshot(tasksCol, (snapshot) => {
    const tasksData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
    const filteredTasks = tasksData.filter(
      (task) => task.projectId === projectId
    );
    onSuccess(filteredTasks);
  });
};

export const taskApi = {
  deleteTask,
  updateTask,
  getTasks,
  addTask,
};
export interface DeleteTaskProps {
  id: string;
  user: GoogleCredentials | null;
  onSuccess: () => void;
  onError: () => void;
}
export interface UpdateTaskProps {
  id: string;
  update: Partial<Task>;
  user: GoogleCredentials | null;
  onSuccess: () => void;
  onError: () => void;
}
export interface GetTasksProps {
  projectId: string;
  user: GoogleCredentials | null;
  onSuccess: (task: Task[]) => void;
  onError: () => void;
}

export interface AddTaskProps {
  task: Partial<Task>;
  user: GoogleCredentials | null;
  projectId: string;
  onSuccess: () => void;
  onError: () => void;
}
