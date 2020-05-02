import { createMountEventFactory } from './createMountEventFactory';
import { createUnmountEventFactory } from './createUnmountEventFactory';
import { createParamStoreFactory } from './createParamStoreFactory';
import { $router } from '../router';

export const createMountEvent = createMountEventFactory($router);
export const createUnmountEvent = createUnmountEventFactory($router);
export const createParamStore = createParamStoreFactory($router);