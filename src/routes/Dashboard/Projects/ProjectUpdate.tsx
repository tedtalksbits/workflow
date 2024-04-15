import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { IProject } from '@/types/projects';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Zone } from '@/components/zone/Zone';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
type ProjectUpdateProps = {
  project: IProject;
  onMutate: (projects: IProject[]) => void;
  onSelectProjectId: (projectId: string) => void;
};
export const ProjectUpdate = ({
  project,
  onMutate,
  onSelectProjectId,
}: ProjectUpdateProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const update: Partial<IProject> = {
      name,
      description,
    };
    try {
      const updatedProjects = await window.electron.projects.update(
        project.id,
        update
      );
      console.log(updatedProjects);
      onMutate(updatedProjects.data);

      toast({
        title: 'Project updated',
        description: 'Project ' + project.name + ' has been updated',
        variant: 'success',
      });
      setOpen(false);
    } catch (e) {
      const err = e as Error;
      toast({
        title: 'Failed to update project',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  const handleDeleteProject = async () => {
    try {
      const res = await window.electron.projects.delete(project.id);
      onMutate(res.data);
      // res could be empty if there are no projects after deletion
      onSelectProjectId(res.data[0]?.id);
      toast({
        title: 'Project deleted',
        description: 'Project ' + project.name + ' has been deleted',
        variant: 'success',
      });
      setOpen(false);
    } catch (e) {
      console.log('delete catch', e);
      const err = e as Error;
      toast({
        title: 'Failed to delete project',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>
          <div
            role='button'
            className='p-2 hover:bg-foreground/10 transition-colors duration-300 ease-in-out rounded-full group'
          >
            <Pencil2Icon className='w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300 ease-in-out' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span>Update Project</span>
            </DialogTitle>
            <DialogDescription>
              This will mutate the project and all its data. This action is
              irreversible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProject} className='flex flex-col gap-3'>
            <div className='form-group'>
              <Label htmlFor='name'>Name</Label>
              <Input
                type='text'
                name='name'
                placeholder='name'
                id='name'
                autoFocus
                required
                defaultValue={project.name}
              />
            </div>
            <div className='form-group'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                name='description'
                placeholder='description'
                rows={5}
                defaultValue={project.description}
              />
            </div>
            <div className='form-footer'>
              <Button type='submit'>Update</Button>
            </div>
          </form>
          <Separator className='my-4' />
          <h2>Danger Zone</h2>
          <Zone variant='destructive'>
            <div className='flex item-center justify-between'>
              <div>
                <h3>Delete Project</h3>
                <p className='text-foreground/80 text-xs'>
                  This action is irreversible.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your this project and all its tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant='destructive'
                        onClick={handleDeleteProject}
                      >
                        Delete
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Zone>
        </DialogContent>
      </Dialog>
    </div>
  );
};
