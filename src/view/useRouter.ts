import { useStore } from 'effector-react';

import { router } from '@dist';

export const useRouter = () => {
  return useStore(router.$);
}