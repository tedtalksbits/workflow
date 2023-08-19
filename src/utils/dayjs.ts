import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const timeFromNow = (date: string) => {
  return dayjs(date).fromNow();
};

export const dayjsUtils = {
  timeFromNow,
};
