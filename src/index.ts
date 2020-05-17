export { initializeRouter } from '@core';
import { createMountEvent, createUnmountEvent, createParamStore, router as baseRouter } from '@core';
export * from './dom';
export * from './view';

export const router = {
    ...baseRouter,
    createMountEvent,
    createUnmountEvent,
    createParamStore
}