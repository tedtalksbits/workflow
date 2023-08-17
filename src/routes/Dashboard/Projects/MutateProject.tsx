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
import { DotsVerticalIcon } from '@radix-ui/react-icons';
export const MutateProjectDialog = ({ project }: { project: Project }) => {
  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            role='button'
            className='p-2 hover:bg-foreground/10 transition-colors duration-300 ease-in-out rounded-full'
          >
            <DotsVerticalIcon className='w-5 h-5' />
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
          <div className='border-destructive border bg-destructive/20 rounded-lg p-4'>
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
                      <Button variant='destructive'>Delete</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
