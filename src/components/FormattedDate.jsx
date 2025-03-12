import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);

export default function FormattedDate({ timestamp }) {
  const date = dayjs(timestamp);
  const currentYear = dayjs().year();

  let formattedDate;
  if (date.isToday()) {
    formattedDate = date.fromNow(); // "5m ago", "2h ago"
  } else if (dayjs().diff(date, 'day') < 7) {
    formattedDate = date.fromNow(); // "3d ago"
  } else if (date.year() === currentYear) {
    formattedDate = date.format('MMM D'); // "Feb 16"
  } else {
    formattedDate = date.format('MMM D, YYYY'); // "Feb 16, 2023"
  }

  return <span className="text-gray-500 hover:underline">{formattedDate}</span>;
}
