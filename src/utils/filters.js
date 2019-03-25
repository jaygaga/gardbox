import moment from 'dayjs';

export const upper = s => s.toUpperCase();

export const formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss');
