import { go, replace, back } from './events';
import { router as baseRouter } from './router';
export { initializeRouter } from './initializeRouter';
import * as utils from './eventCreators';

export const router = {
  ...baseRouter,
  ...utils,
  go, replace, back
}