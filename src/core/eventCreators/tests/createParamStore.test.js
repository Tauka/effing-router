import { createStore, createEvent } from 'effector';

import { handleString } from '../createParamStoreFactory';

let $router;

const initialRouteObject =
{
    routes: ['main', 'dashboard'],
    params: { userId: 5 }
};

const go = createEvent();

beforeEach(() =>
{
    $router = createStore(initialRouteObject)
        .on(go, (prev, nextMerge) => (
            {
                routes: [...prev.routes, ...(nextMerge.path ?? [])],
                params: { ...prev.params, ...(nextMerge.params ?? {}) }
            }));
})

test('[string] return param value', () =>
{
    const evWhen = handleString($router, 'when');
    const watchMock = jest.fn();
    evWhen.watch(watchMock)

    go({ params: { otherParam: 'positive' }});
    expect(watchMock.mock.calls.length).toBe(1);
    expect(watchMock.mock.calls[0][0]).toBe(undefined);

    go({ params: { when: 'tomorrow' }});
    expect(watchMock.mock.calls.length).toBe(2);
    expect(watchMock.mock.calls[1][0]).toBe('tomorrow');
})

test('[string] does not fire on other updates', () =>
{
    const evWhen = handleString($router, 'userId');
    const watchMock = jest.fn();
    evWhen.watch(watchMock)

    expect(watchMock.mock.calls.length).toBe(1);

    go({ routes: [], params: { otherParam: 'positive' }});
    expect(watchMock.mock.calls.length).toBe(1);
})