import { db } from '@/firebase';
import { GoogleCredentials } from '@/providers/authProvider';
import { Project } from '@/types/projects';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

export const PROJECTS_COLLECTION = 'projects';
export const PROJECTS_SUBCOLLECTION = 'project';

const addProject = async ({
  project,
  user,
  onSuccess,
  onError,
}: AddProjectProps) => {
  if (!user) return console.log('no user');

  try {
    await addDoc(
      collection(db, PROJECTS_COLLECTION, user.uid, PROJECTS_SUBCOLLECTION),
      project
    );
    onSuccess();
  } catch (error) {
    console.log(error);
    onError();
  }
};

const updateProject = async ({
  id,
  update,
  user,
  onSuccess,
  onError,
}: UpdateProjectProps) => {
  if (!user) {
    onError();
    throw new Error('no user');
  }

  try {
    const projectRef = doc(
      db,
      PROJECTS_COLLECTION,
      user.uid,
      PROJECTS_SUBCOLLECTION,
      id
    );
    await updateDoc(projectRef, update);
    onSuccess();
  } catch (error) {
    console.log(error);
    onError();
  }
};

const deleteProject = async ({
  id,
  user,
  onSuccess,
  onError,
}: DeleteProjectProps) => {
  if (!user) {
    onError();
    throw new Error('no user');
  }
  try {
    const projectRef = doc(
      db,
      PROJECTS_COLLECTION,
      user.uid,
      PROJECTS_SUBCOLLECTION,
      id
    );
    await deleteDoc(projectRef);
    onSuccess();
  } catch (error) {
    console.log(error);
    onError();
  }
};

const getProjects = async ({ user, onSuccess, onError }: GetProjectsProps) => {
  if (!user) {
    onError();
    throw new Error('no user');
  }
  try {
    const projectsCol = collection(
      db,
      PROJECTS_COLLECTION,
      user.uid,
      PROJECTS_SUBCOLLECTION
    );

    onSnapshot(projectsCol, (snapshot) => {
      const projectsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Project[];
      const sortedProjects = projectsList.sort((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
          ? -1
          : 1
      );
      onSuccess(sortedProjects);
    });
  } catch (error) {
    console.log(error);
    onError();
  }
};

export const projectApi = {
  addProject,
  updateProject,
  deleteProject,
  getProjects,
};

export interface AddProjectProps {
  project: Partial<Project>;
  user: GoogleCredentials;
  onSuccess: () => void;
  onError: () => void;
}

export interface UpdateProjectProps {
  id: string;
  update: Partial<Project>;
  user: GoogleCredentials;
  onSuccess: () => void;
  onError: () => void;
}

export interface DeleteProjectProps {
  id: string;
  user: GoogleCredentials;
  onSuccess: () => void;
  onError: () => void;
}

export interface GetProjectsProps {
  user: GoogleCredentials;
  onSuccess: (projects: Project[]) => void;
  onError: () => void;
}
