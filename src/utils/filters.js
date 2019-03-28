import moment from 'dayjs';
import { gardplorerDomain } from '@/constants';

export const upper = s => s.toUpperCase();

export const gardAddr = s => s.slice(0, 8) + '......' + s.slice(s.length - 8);

export const explorerUrl = s => `${gardplorerDomain}${s}`;

export const formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss');
