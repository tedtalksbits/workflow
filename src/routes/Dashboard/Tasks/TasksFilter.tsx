import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Task } from '@/types/task';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import React from 'react';

type TasksFilterProps = {
  filteredTasks: Task[];
  isFiltered: boolean;
  searchTerm: {
    key: string;
    value: string;
  };
  setSearchTerm: React.Dispatch<
    React.SetStateAction<{
      key: string;
      value: string;
    }>
  >;
};
export const TasksFilter = ({
  filteredTasks,
  isFiltered,
  searchTerm,
  setSearchTerm,
}: TasksFilterProps) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='secondary' disabled={filteredTasks.length === 0}>
            <MixerHorizontalIcon className='w-5 h-5 mr-2' />
            {isFiltered ? `${searchTerm.key}:${searchTerm.value}` : 'Filter'}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <header className='flex items-center justify-between mb-4 '>
            <h4 className='font-medium text-lg'>Filter</h4>
            <MixerHorizontalIcon className='w-5 h-5' />
          </header>
          <details open={searchTerm.key === 'priority'}>
            <summary className='text-sm font-bold'>Priority</summary>
            <div className='flex gap-4'>
              <input
                type='radio'
                id='lowRadio'
                name='priority'
                value='todo'
                checked={searchTerm.value === 'low'}
                onChange={() =>
                  setSearchTerm({
                    key: 'priority',
                    value: 'low',
                  })
                }
              />
              <Label htmlFor='lowRadio'>low</Label>
            </div>
            <div className='flex gap-4'>
              <input
                type='radio'
                id='mediumRadio'
                name='priority'
                value='medium'
                checked={searchTerm.value === 'medium'}
                onChange={() =>
                  setSearchTerm({
                    key: 'priority',
                    value: 'medium',
                  })
                }
              />
              <Label htmlFor='mediumRadio'>medium</Label>
            </div>
            <div className='flex gap-4'>
              <input
                type='radio'
                id='highRadio'
                name='priority'
                value='high'
                checked={searchTerm.value === 'high'}
                onChange={() =>
                  setSearchTerm({
                    key: 'priority',
                    value: 'high',
                  })
                }
              />
              <Label htmlFor='highRadio'>high</Label>
            </div>
          </details>
          <details open={searchTerm.key === 'status'}>
            <summary className='text-sm font-bold'>Status</summary>
            <div className='flex gap-4'>
              <input
                type='radio'
                id='todoRadio'
                name='status'
                value='todo'
                checked={searchTerm.value === 'todo'}
                onChange={() =>
                  setSearchTerm({
                    key: 'status',
                    value: 'todo',
                  })
                }
              />
              <Label htmlFor='todoRadio'>todo</Label>
            </div>
            <div className='flex gap-4'>
              <input
                type='radio'
                id='inProgressRadio'
                name='status'
                value='inProgress'
                checked={searchTerm.value === 'inProgress'}
                onChange={() =>
                  setSearchTerm({
                    key: 'status',
                    value: 'inProgress',
                  })
                }
              />
              <Label htmlFor='inProgressRadio'>in progress</Label>
            </div>
            <div className='flex gap-4'>
              <input
                type='radio'
                id='doneRadio'
                name='status'
                value='done'
                checked={searchTerm.value === 'done'}
                onChange={() =>
                  setSearchTerm({
                    key: 'status',
                    value: 'done',
                  })
                }
              />
              <Label htmlFor='doneRadio'>done</Label>
            </div>
          </details>
        </PopoverContent>
      </Popover>
      {isFiltered && (
        <Button
          onClick={() =>
            setSearchTerm({
              key: '',
              value: '',
            })
          }
        >
          Clear
        </Button>
      )}
    </>
  );
};
