import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/projects';
import { PlusIcon } from '@radix-ui/react-icons';
import { addDoc, collection } from 'firebase/firestore';
import React from 'react';

export const NewProjectDialog = () => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) return console.log('no user');
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const project: Partial<Project> = {
      owner: user.uid,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'projects', user.uid, 'project'), project);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>
          <Button variant='default' className='w-fit h-fit p-2'>
            <PlusIcon className='mr-2 w-5 h-5' />
            New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize your tasks.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject} className='flex flex-col gap-3'>
            <Input
              type='text'
              name='name'
              placeholder='name'
              autoFocus
              required
            />
            <Textarea name='description' placeholder='description' rows={5} />
            <Button type='submit'>Add Project</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
