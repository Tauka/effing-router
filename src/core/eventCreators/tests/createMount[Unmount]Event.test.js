import { createEvent, createStore } from 'effector';

import { createMountEventFactory } from '../createMountEventFactory';
import { createUnmountEventFactory } from '../createUnmountEventFactory';

let $router;
let createMountEvent;
let createUnmountEvent;

const initialRouteObject =
{
    path: ['main', 'dashboard'],
    params: { userId: 5 }
};

const go = createEvent();
const goAbs = createEvent();

beforeEach(() =>
{
    $router = createStore(initialRouteObject)
        .on(go, (prev, nextMerge) => (
            {
                path: [...prev.path, ...(nextMerge.path ?? [])],
                params: { ...prev.params, ...(nextMerge.params ?? {}) }
            }))
        .on(goAbs, (prev, nextMerge) => (
            {
                path: nextMerge.path ?? prev.path,
                params: nextMerge.params ?? prev.params
            }));

    createMountEvent = createMountEventFactory($router);
    createUnmountEvent = createUnmountEventFactory($router);
})

test('[createMountEvent] does not fire if route is already present', () =>
{
    const evDashsboardMount = createMountEvent('dashboard');
    const watchMock = jest.fn();
    evDashsboardMount.watch(watchMock)

    expect(watchMock).toHaveBeenCalledTimes(0);
})

test('[createMountEvent] [] => [route]', () =>
{
    const evSchoolMount = createMountEvent('school');
    const watchMock = jest.fn();
    evSchoolMount.watch(watchMock)

    go({ path: ['school'] });
    expect(watchMock).toHaveBeenCalledTimes(1);
    expect(watchMock).toHaveBeenLastCalledWith(
    {
        path: ['main', 'dashboard', 'school'],
        params: { userId: 5 }
    });
})

test('[createMountEvent] { path }', () =>
{
    const evMainMount = createMountEvent({
        path: ['walterWhite'],
        params: { userId: 5 }
    });

    const mountWatch = jest.fn();
    evMainMount.watch(mountWatch);

    expect(mountWatch).toHaveBeenCalledTimes(0);

    go({ path: ['walterWhite'] });
    expect(mountWatch).toHaveBeenCalledTimes(1);
})

test('[createMountEvent] { params }', () =>
{
    const evMainMount = createMountEvent({
        params: {
            meth: false,
            jpinkman: true
        }
    });

    const mountWatch = jest.fn();
    evMainMount.watch(mountWatch);

    expect(mountWatch).toHaveBeenCalledTimes(0);

    goAbs({ params: { meth: false } });
    expect(mountWatch).toHaveBeenCalledTimes(0);
    go({ params: { jpinkman: true } });
    expect(mountWatch).toHaveBeenCalledTimes(1);
})

test('[createMountEvent] { path, params }', () =>
{
    const evMainMount = createMountEvent({
        path: ['walterWhite', 'gusFring'],
        params: {
            meth: false,
            jpinkman: true
        }
    });

    const mountWatch = jest.fn();
    evMainMount.watch(mountWatch);

    expect(mountWatch).toHaveBeenCalledTimes(0);

    go({ params: { meth: false } });
    expect(mountWatch).toHaveBeenCalledTimes(0);
    go({ params: { jpinkman: true } });
    expect(mountWatch).toHaveBeenCalledTimes(0);
    go({ path: ['walterWhite'] });
    expect(mountWatch).toHaveBeenCalledTimes(0);
    go({ path: ['gusFring'] });
    expect(mountWatch).toHaveBeenCalledTimes(1);
})

test('[createMountEvent] move path index', () =>
{
    const evMainMount = createMountEvent({
        path: ['walterWhite', 'gusFring']
    });

    const mountWatch = jest.fn();
    evMainMount.watch(mountWatch);

    expect(mountWatch).toHaveBeenCalledTimes(0);

    go({ path: ['walterWhite', 'gusFring'] });
    expect(mountWatch).toHaveBeenCalledTimes(1);
    go({ path: ['lalo'] });
    expect(mountWatch).toHaveBeenCalledTimes(1);
})

test('[createUnmountEvent] [route] => []', () =>
{
    const evMainMount = createUnmountEvent('main');
    const watchMock = jest.fn();
    evMainMount.watch(watchMock)

    expect(watchMock).toHaveBeenCalledTimes(0);

    goAbs({ path: ['school'] });
    expect(watchMock).toHaveBeenCalledTimes(1);
    expect(watchMock).toHaveBeenLastCalledWith(
    {
        path: ['school'],
        params: { userId: 5 }
    });
})

test('[createUnmountEvent] [route1, route2] => [route2, route1]', () =>
{
    const evMainMount = createMountEvent('main');
    const evMainUnmount = createUnmountEvent('main');
    const mountWatch = jest.fn();
    const unmountWatch = jest.fn();
    evMainMount.watch(mountWatch);
    evMainUnmount.watch(unmountWatch);

    expect(mountWatch).toHaveBeenCalledTimes(0);
    expect(unmountWatch).toHaveBeenCalledTimes(0);

    goAbs({ path: ['dashboard', 'main'] });
    expect(mountWatch).toHaveBeenCalledTimes(1);
    expect(unmountWatch).toHaveBeenCalledTimes(1);
})

test('[createUnmountEvent] removing one of the path tokens', () =>
{
    const evMainUnmount = createUnmountEvent({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });

    const unmountWatch = jest.fn();
    evMainUnmount.watch(unmountWatch);

    expect(unmountWatch).toHaveBeenCalledTimes(0);

    goAbs({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(0);
    goAbs({
      path: ['monica'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(1);
    goAbs({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: false,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(1);
    goAbs({ path: ['joey'] })
    expect(unmountWatch).toHaveBeenCalledTimes(1);
})

test('[createUnmountEvent] removing/changing one of the params', () =>
{
    const evMainUnmount = createUnmountEvent({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });

    const unmountWatch = jest.fn();
    evMainUnmount.watch(unmountWatch);

    expect(unmountWatch).toHaveBeenCalledTimes(0);

    goAbs({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(0);
    goAbs({
      path: ['monica', 'chandler'],
      params: {
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(1);
    // mount
    goAbs({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });
    //unmount
    goAbs({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: false,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(2);
    goAbs({ path: ['joey'] })
    expect(unmountWatch).toHaveBeenCalledTimes(2);
})

test('[createUnmountEvent] moving path', () =>
{
    const evMainUnmount = createUnmountEvent({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });

    const unmountWatch = jest.fn();
    evMainUnmount.watch(unmountWatch);

    expect(unmountWatch).toHaveBeenCalledTimes(0);
    goAbs({
      path: ['monica', 'chandler'],
      params: {
        centralPerk: true,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(0);
    go({
      path: ['ross', 'monica', 'chandler'],
      params: {
        centralPerk: false,
        mclarens: false
      }
    });
    expect(unmountWatch).toHaveBeenCalledTimes(1);
})