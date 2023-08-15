import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { addDoc, collection } from 'firebase/firestore';
import React from 'react';

export const EditForm = () => {
  const { user } = useAuth();
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) return console.log('no user');
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const project = {
      owner: user.uid,
      name: formData.get('name'),
    };

    try {
      await addDoc(collection(db, 'projects', user.uid, 'project'), project);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleAddProject} className='bg-card border p-4'>
        <Input type='text' name='name' placeholder='name' />
        <Button type='submit'>Add Project</Button>
      </form>
    </div>
  );
};
