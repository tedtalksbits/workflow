import { Button } from '@/components/ui/button';

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
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Task } from '@/types/task';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zone } from '@/components/zone/Zone';
import { DeleteTaskProps, taskApi } from './api/task';
import { useToast } from '@/components/ui/use-toast';
export const TaskUpdate = ({ task }: { task: Task }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    if (!user) return console.log('no user');

    const update: Partial<Task> = {
      title,
      description,
      updatedAt: new Date().toISOString(),
    };
    const taskUpdate = {
      id: task.id,
      update,
      user,
      onSuccess: () => {
        setOpen(false);
        toast({
          title: 'Task updated',
          description: 'Task was successfully updated.',
          variant: 'success',
        });
      },
      onError: () =>
        toast({
          title: 'Something went wrong',
          description: 'Task was not updated.',
          variant: 'destructive',
        }),
    };
    taskApi.updateTask(taskUpdate);
  };
  const handleDeleteTask = async () => {
    if (!user) return console.log('no user');
    const taskDelete: DeleteTaskProps = {
      id: task.id,
      user,
      onSuccess: () => {
        setOpen(false);
        toast({
          title: 'Task deleted',
          description: 'Task was successfully deleted.',
          variant: 'success',
        });
      },
      onError: () =>
        toast({
          title: 'Something went wrong',
          description: 'Task was not deleted.',
          variant: 'destructive',
        }),
    };
    taskApi.deleteTask(taskDelete);
  };
  return (
    <div>
      <Sheet open={open} onOpenChange={() => setOpen(!open)}>
        <SheetTrigger asChild>
          <div
            role='button'
            className='p-2 hover:bg-foreground/10 transition-colors duration-300 ease-in-out rounded-full'
          >
            <ArrowRightIcon />
          </div>
        </SheetTrigger>
        <SheetContent className='min-w-[600px]'>
          <SheetHeader>
            <SheetTitle>
              <span className='text-foreground/50'>Task:</span> {task.title}
            </SheetTitle>
            <SheetDescription>
              This will mutate the task and all its data. This action is
              irreversible.
            </SheetDescription>
          </SheetHeader>
          <Tabs defaultValue='view'>
            <TabsList>
              <TabsTrigger value='update'>Update</TabsTrigger>
              <TabsTrigger value='view'>View</TabsTrigger>
            </TabsList>
            <TabsContent value='update'>
              <form onSubmit={handleUpdateTask} className='flex flex-col gap-3'>
                <Input
                  type='text'
                  name='title'
                  placeholder='title'
                  autoFocus
                  required
                  defaultValue={task.title}
                />
                <Textarea
                  name='description'
                  placeholder='description'
                  rows={5}
                  defaultValue={task.description}
                />
                <Button type='submit'>Update</Button>
              </form>
              <Separator className='my-4' />
              <h2>Danger Zone</h2>
              <Zone variant='destructive'>
                <div className='flex item-center justify-between'>
                  <div>
                    <h3>Delete task</h3>
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
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          asChild
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/80'
                        >
                          <Button variant='outline' onClick={handleDeleteTask}>
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Zone>
            </TabsContent>
            <TabsContent value='view'>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-foreground/50'>Title:</h3>
                  <p>{task.title}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <h3 className='text-foreground/50'>Description:</h3>
                  <p>{task.description}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
