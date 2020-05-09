import { forward } from 'effector';
import { go } from './events';
import { Redirect } from './types';

export const redirect = (redirectCfg: Redirect) =>
{
    const { to, condition } = redirectCfg;

    forward({
        from: condition,
        to: go.prepend(() => to)
    })
}