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
import { Project } from '@/types/projects';
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FileTextIcon } from '@radix-ui/react-icons';
type NewProjectDialogProps = {
  projects: Project[];
  onMutate: (projects: Project[]) => void;
};
export const NewProjectDialog = ({ onMutate }: NewProjectDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const project: Partial<Project> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    try {
      const res = await window.electron.projects.add(project);
      onMutate(res);
      toast({
        title: 'Project added',
        description: 'Project ' + project.name + ' has been added',
        variant: 'success',
      });
      setOpen(false);
    } catch (e) {
      console.log(e);
      const err = e as Error;
      toast({
        title: 'Failed to add project',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  return (
    <div>
      <header className='border-b  h-[5rem] flex flex-col justify-center'>
        <div className='flex item-center justify-between px-4'>
          <h2 className='text-xl font-bold  flex items-center gap-2'>
            <FileTextIcon className='w-5 h-5' />
            Projects
          </h2>
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
      </header>
    </div>
  );
};
