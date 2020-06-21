import { useStore } from 'effector-react';

import { router } from '9yua0xKsSi';

export const useRouter = () => {
  return useStore(router.$);
}