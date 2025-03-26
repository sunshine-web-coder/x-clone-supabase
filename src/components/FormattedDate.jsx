import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(utc);

export default function FormattedDate({ timestamp }) {
  const date = dayjs.utc(timestamp).local(); // Convert UTC to local time
  const now = dayjs();
  const diffInSeconds = now.diff(date, 'second');
  const diffInMinutes = now.diff(date, 'minute');
  const diffInHours = now.diff(date, 'hour');

  let formattedDate;

  if (diffInSeconds < 60) {
    formattedDate = `${diffInSeconds}s`; // Seconds
  } else if (diffInMinutes < 60) {
    formattedDate = `${diffInMinutes}m`; // Minutes
  } else if (diffInHours < 24) {
    formattedDate = `${diffInHours}h`; // Hours
  } else if (date.year() === now.year()) {
    formattedDate = date.format('MMM D'); // Same year: Mar 16
  } else {
    formattedDate = date.format('MMM D, YYYY'); // Older year: Mar 16, 2024
  }

  return <span className="text-gray-500 hover:underline">{formattedDate}</span>;
}