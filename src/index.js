export { initializeRouter } from './core/initializeRouter';
import { router as baseRouter } from './core/router';
import { createMountEvent, createUnmountEvent, createParamStore } from './core/eventCreators';

export const router = {
    ...baseRouter,
    createMountEvent,
    createUnmountEvent,
    createParamStore
}