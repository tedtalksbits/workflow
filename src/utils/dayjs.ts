import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const timeFromNow = (date: string) => {
  return dayjs(date).fromNow();
};

export const dayjsUtils = {
  timeFromNow,
};

export function getLocalDateTime(date: Date | string | null | undefined) {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
