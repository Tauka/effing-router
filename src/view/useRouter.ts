import { useStore } from 'effector-react';

import { $router } from '@core';

export const useRouter = () => {
  return useStore($router);
}