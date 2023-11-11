import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

export const RecurringTaskList = () => {
  return (
    <Table>
      <TableCaption>A list of your tasks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableCell>Schema</TableCell>
          <TableCell>Event</TableCell>
          <TableCell>Body Type</TableCell>
          <TableCell>Definition</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Execute At</TableCell>
          <TableCell>Frequency</TableCell>
          <TableCell>Starts</TableCell>
          <TableCell>Ends</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Updated At</TableCell>
          <TableCell>Last Executed</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Schema</TableCell>
          <TableCell>Event</TableCell>
          <TableCell>Body Type</TableCell>
          <TableCell>Definition</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Execute At</TableCell>
          <TableCell>Frequency</TableCell>
          <TableCell>Starts</TableCell>
          <TableCell>Ends</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Updated At</TableCell>
          <TableCell>Last Executed</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
