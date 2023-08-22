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
import { Task, priorityColors, statusColors } from '@/types/task';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zone } from '@/components/zone/Zone';
import { DeleteTaskProps, taskApi } from './api/task';
import { useToast } from '@/components/ui/use-toast';
import Indicator from '@/components/ui/indicator';
import { Label } from '@/components/ui/label';
import { CustomTagSelect } from '@/components/customSelects/CustomTagSelect';
export const TaskUpdate = ({ task }: { task: Task }) => {
  const [tags, setTags] = useState<string>(task.tags);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Partial<Task>;
    data.dueDate && new Date(data.dueDate).toISOString();
    if (!user) return console.log('no user');
    const update: Partial<Task> = {
      ...data,
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
          <Tabs defaultValue='view' className='my-4'>
            <TabsList>
              <TabsTrigger value='update'>Update</TabsTrigger>
              <TabsTrigger value='view'>View</TabsTrigger>
            </TabsList>
            <TabsContent value='update' className='my-4'>
              <form onSubmit={handleUpdateTask} className='flex flex-col gap-3'>
                <div className='form-group'>
                  <Label htmlFor={task.id + 'title'}>Title</Label>
                  <Input
                    type='text'
                    name='title'
                    placeholder='title'
                    id={task.id + 'title'}
                    autoFocus
                    required
                    defaultValue={task.title}
                  />
                </div>
                <div className='form-group'>
                  <Label htmlFor={`${task.id}description`}>Description</Label>
                  <Textarea
                    name='description'
                    placeholder='description'
                    rows={5}
                    id={`${task.id}description`}
                    defaultValue={task.description}
                  />
                </div>
                <div className='form-group'>
                  <Label htmlFor={task.id + 'status'}>Status</Label>
                  <Select name='status' defaultValue={task.status}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <>
                            <Indicator
                              className={`${
                                task.status === 'todo'
                                  ? statusColors.todo
                                  : task.status === 'inProgress'
                                  ? statusColors.inProgress
                                  : `${statusColors.done}`
                              }`}
                            />
                            {task.status}
                          </>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent id={task.id + 'status'}>
                      <SelectItem value='todo'>
                        <Indicator className={statusColors.todo} />
                        Todo
                      </SelectItem>
                      <SelectItem value='inProgress'>
                        <Indicator className={statusColors.inProgress} />
                        In Progress
                      </SelectItem>
                      <SelectItem value='done'>
                        <Indicator className={statusColors.done} />
                        Done
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='form-group'>
                  <Label htmlFor={task.id + 'priority'}>Priority</Label>
                  <Select name='priority' defaultValue={task.priority}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          <>
                            {' '}
                            <Indicator
                              className={`${
                                task.priority === 'low'
                                  ? priorityColors.low
                                  : task.priority === 'medium'
                                  ? priorityColors.medium
                                  : priorityColors.high
                              }`}
                            />
                            {task.priority}
                          </>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent id={task.id + 'priority'}>
                      <SelectItem value='low' defaultValue={task.priority}>
                        <Indicator className={priorityColors.low} />
                        Low
                      </SelectItem>
                      <SelectItem defaultValue={task.priority} value='medium'>
                        <Indicator className={priorityColors.medium} />
                        Medium
                      </SelectItem>
                      <SelectItem defaultValue={task.priority} value='high'>
                        <Indicator className={priorityColors.high} />
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='form-group'>
                  <Label htmlFor='newTaskDueDate'>Due Date</Label>
                  <Input
                    id='newTaskDueDate'
                    type='datetime-local'
                    name='dueDate'
                    placeholder='due date'
                    defaultValue={task.dueDate}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className='form-group'>
                  <CustomTagSelect setTags={setTags} tags={tags} />
                </div>
                <div className='form-footer'>
                  <Button type='submit'>Update</Button>
                </div>
              </form>
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
