import { createEvent } from 'effector';

export const go = createEvent('[route/go]');
export const push = createEvent('[route/push]');
export const replace = createEvent('[route/replace]');
export const pushReplace = createEvent('[route/pushReplace]');
export const back = createEvent('[route/back]');
export const modifyRoute = createEvent('[route/modifyRoute]');

export const pushLast = createEvent('[route/pushLast]');
export const pushLastReplace = createEvent('[route/pushLastReplace]');