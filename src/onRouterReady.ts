// Fixes a bug when `found` ignores any dispatched navigation actions
// until its `componentDidMount()` has been called.
// I.e. without this fix calling `dispatch(goto(...))` before `componentDidMount()` has been called
// simply wouldn't do anything.

let routerIsReady = false;
let onRouterReadyListeners: (() => any)[] = [];

export function notifyRouterIsReady() {
  if (typeof window === 'undefined') {
    throw new Error('This function should only be called on client side');
  }
  if (!routerIsReady) {
    routerIsReady = true;
    for (const onFoundRouterReadyListener of onRouterReadyListeners) {
      onFoundRouterReadyListener();
    }
    onRouterReadyListeners = [];
  }
}

export default function onRouterReady<Result>(
  listener: () => Result,
): Promise<Result> {
  if (typeof window === 'undefined') {
    throw new Error('This function should only be called on client side');
  }
  if (routerIsReady) {
    return Promise.resolve(listener());
  }
  return new Promise((resolve) => {
    onRouterReadyListeners.push(() => resolve(listener()));
  });
}
