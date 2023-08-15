import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React from 'react';

export const AddForm = () => {
  const { user } = useAuth();
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    if (!auth.currentUser) return console.log('no user');

    const project = {
      owner: user?.uid,
      avatar: user?.photoURL,
      name: formData.get('name'),
      timestamp: serverTimestamp(),
    };

    try {
      const projectCollection = collection(db, 'projects');
      await addDoc(projectCollection, project);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleAddProject}>
        <Input type='text' name='name' />
        <Button type='submit'>Add Project</Button>
        {user?.uid}
      </form>
    </div>
  );
};
