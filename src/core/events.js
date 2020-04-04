import { createEvent } from 'effector';

export const go = createEvent('[route/go]');
export const replace = createEvent('[route/replace]');
export const back = createEvent('[route/back]');
/* set is like go, except it doesn't trigger pushState */
export const set = createEvent('[route/set]')
export const setDeps = createEvent();