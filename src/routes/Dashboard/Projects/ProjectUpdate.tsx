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
import { Project } from '@/types/projects';
import { GearIcon } from '@radix-ui/react-icons';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Zone } from '@/components/zone/Zone';
export const ProjectUpdate = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    if (!user) return console.log('no user');
    const projectUpdate: Partial<Project> = {
      name,
      description,
    };
    // update project
    try {
      const projectRef = doc(db, 'projects', user.uid, 'project', project.id);
      await updateDoc(projectRef, projectUpdate);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteProject = async () => {
    if (!user) return console.log('no user');
    try {
      const projectRef = doc(db, 'projects', user.uid, 'project', project.id);
      await deleteDoc(projectRef);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>
          <div
            role='button'
            className='p-2 hover:bg-foreground/10 transition-colors duration-300 ease-in-out rounded-full'
          >
            <GearIcon className='w-5 h-5' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className='text-foreground/50'>Project:</span>{' '}
              {project.name}
            </DialogTitle>
            <DialogDescription>
              This will mutate the project and all its data. This action is
              irreversible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProject} className='flex flex-col gap-3'>
            <Input
              type='text'
              name='name'
              placeholder='name'
              autoFocus
              required
              defaultValue={project.name}
            />
            <Textarea
              name='description'
              placeholder='description'
              rows={5}
              defaultValue={project.description}
            />
            <Button type='submit'>Update</Button>
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
                      your account and remove your data from our servers.
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
