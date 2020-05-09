import { createEvent } from 'effector';
import { Query } from './types';

export const go = createEvent<Query>('[route/go]');
export const replace = createEvent<Query>('[route/replace]');
export const back = createEvent('[route/back]');
/* set is like go, except it doesn't trigger pushState */
export const set = createEvent<Query>(('[route/set]'));