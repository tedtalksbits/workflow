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
import { IProject } from '@/types/projects';
import React, { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import { useShortcuts } from '@/hooks/useShortcuts';
import { Dialogs } from '../Dashboard';
type NewProjectDialogProps = {
  projects: IProject[];
  setProjects: (projects: IProject[]) => void;
  dialogs: Dialogs;
  setDialogs: (dialogs: Dialogs) => void;
  onSelectProjectId: (projectId: string) => void;
  selectedProjectId: string | null;
};
export const NewProjectDialog = ({
  setProjects,
  dialogs,
  setDialogs,
  onSelectProjectId,
}: NewProjectDialogProps) => {
  const { toast } = useToast();

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const project: Partial<IProject> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    try {
      const res = await window.electron.projects.add(project);
      setProjects(res.data);
      onSelectProjectId(res.data[0].id);
      toast({
        title: 'Project added',
        description: 'Project ' + project.name + ' has been added',
        variant: 'success',
      });
      setDialogs({ ...dialogs, newProject: false });
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

  const handleNewProjectShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'p' && e.ctrlKey) {
        setDialogs({ ...dialogs, newProject: true });
      }
    },
    [setDialogs, dialogs]
  );

  useShortcuts(handleNewProjectShortcut);
  return (
    <div>
      <header className='border-b  h-[5rem] flex flex-col justify-center'>
        <div className='flex item-center justify-between px-4'>
          <h2 className='text-xl font-bold  flex items-center gap-2'>
            <FileTextIcon className='w-5 h-5' />
            Projects
          </h2>
          <Dialog
            open={dialogs.newProject}
            onOpenChange={() =>
              setDialogs({ ...dialogs, newProject: !dialogs.newProject })
            }
          >
            <DialogTrigger asChild>
              <Button
                variant='default'
                className='w-fit h-fit p-2 whitespace-nowrap'
              >
                <span>Project</span>
                <PlusIcon className='w-5 h-5 ml-2' />
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
