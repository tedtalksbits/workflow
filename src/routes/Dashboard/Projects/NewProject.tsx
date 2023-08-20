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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/projects';
import React from 'react';
import { AddProjectProps, projectApi } from './api/project';
import { useToast } from '@/components/ui/use-toast';

export const NewProjectDialog = () => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
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
    const newProjectRequest: AddProjectProps = {
      project,
      user,
      onError: () => console.log('error'),
      onSuccess: () => {
        setOpen(false);
        toast({
          title: 'Project created',
          description: 'Your project has been created successfully',
          variant: 'success',
        });
      },
    };
    projectApi.addProject(newProjectRequest);
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>
          <Button variant='default' className='w-fit h-fit p-2'>
            New Project
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
            <div className='form-group'>
              <Label htmlFor='newProjectName'>Name</Label>
              <Input
                id='newProjectName'
                type='text'
                name='name'
                placeholder='name'
                autoFocus
                required
              />
            </div>
            <div className='form-group'>
              <Label htmlFor='newProjectDescription'>Description</Label>
              <Textarea
                name='description'
                placeholder='description'
                rows={5}
                id='newProjectDescription'
              />
            </div>
            <div className='form-footer'>
              <Button type='submit'>Add Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
