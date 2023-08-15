import { db, signOutWithGoogle } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { EditForm } from './EditForm';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
type Project = {
  name: string;
  description: string;
  id: string;
};
export const Dashboard = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      throw new Error('User not found');
    }
    const getData = async () => {
      const projectsCol = collection(db, 'projects', user.uid, 'project');

      onSnapshot(projectsCol, (snapshot) => {
        const projectsList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Project[];
        console.log(projectsList);
        setProjects(projectsList);
      });
    };
    getData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      {/* <AddForm /> */}
      <EditForm />
      <Button onClick={async () => signOutWithGoogle()}>Logout</Button>
    </div>
  );
};
