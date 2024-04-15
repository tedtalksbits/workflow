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
import { Separator } from '@/components/ui/separator';
import { ArrowRightIcon, CalendarIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { ITask, priorityColors, statusColors } from '@/types/task';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zone } from '@/components/zone/Zone';
import { useToast } from '@/components/ui/use-toast';
import Indicator from '@/components/ui/indicator';
import { TaskForm, TaskFormOnSubmit } from './TaskForm';
type TaskUpdateProps = {
  task: ITask;
  onMutate: (tasks: ITask[]) => void;
  projectId: string | null;
};
export const TaskUpdate = ({ task, onMutate, projectId }: TaskUpdateProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const handleUpdateTask: TaskFormOnSubmit = async (data) => {
    try {
      if (!projectId)
        return toast({
          title: 'Failed to update task',
          description: 'No project id',
          variant: 'destructive',
        });
      await window.electron.tasks.update(task.id, data.task);
      const updatedTasks = await window.electron.tasks.getByProjectId(
        projectId
      );
      console.log(updatedTasks);
      onMutate(updatedTasks.data);
      toast({
        title: 'Task updated',
        description: 'Task ' + task.title + ' has been updated',
        variant: 'success',
      });
      setOpen(false);
    } catch (e) {
      console.log(e);
      const err = e as Error;
      toast({
        title: 'Failed to update task',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  const handleDeleteTask = async () => {
    try {
      if (!projectId)
        return toast({ title: 'No project id', variant: 'destructive' });
      await window.electron.tasks.delete(task.id);
      const res = await window.electron.tasks.getByProjectId(projectId);
      onMutate(res.data);
      toast({
        title: 'Task deleted',
        description: 'Task ' + task.title + ' has been deleted',
        variant: 'success',
      });
    } catch (e) {
      const err = e as Error;
      toast({
        title: 'Failed to delete task',
        description: err.message,
        variant: 'destructive',
      });
    }
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
        <SheetContent className='min-w-[100%] md:min-w-[800px]'>
          <SheetHeader>
            <SheetTitle className='py-4'>
              <span className='text-xl font-bold'>Update Task</span>
            </SheetTitle>
          </SheetHeader>
          <Tabs defaultValue='view' className='my-4'>
            <TabsContent value='update' className='my-4'>
              <TaskForm onSubmit={handleUpdateTask} task={task} />
              <Separator className='my-20' />
              <h2 className='font-bold my-2'>Danger Zone</h2>
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
                          delete this task.
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
              <div className='flex flex-col gap-4'>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Status
                  </span>
                  <span className='text-foreground flex-1'>
                    <Indicator className={statusColors[task.status]} />
                    {task.status}
                  </span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Priority
                  </span>
                  <span className='text-foreground flex-1'>
                    <Indicator className={priorityColors[task.priority]} />
                    {task.priority}
                  </span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Due Date
                  </span>
                  <span className='text-foreground flex-1'>
                    <CalendarIcon className='inline-block w-4 h-4 mr-2 text-green-500' />
                    {task.dueDate?.toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Tags
                  </span>
                  <span className='text-foreground flex-1'>{task.tags}</span>
                </div>
                <div className='row flex justify-between'>
                  <span className='text-foreground/50 font-light w-[120px] min-w-fit'>
                    Created
                  </span>
                  <span className='text-foreground flex-1'>
                    {task.createdAt.toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      minute: 'numeric',
                      hour: 'numeric',
                      second: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-3 my-8'>
                <span className='text-foreground/50'>Description</span>
                {task.description}
              </div>
            </TabsContent>
            <TabsList className='mt-16'>
              <TabsTrigger value='update'>Update</TabsTrigger>
              <TabsTrigger value='view'>View</TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
