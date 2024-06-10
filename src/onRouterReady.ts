let foundRouterIsReady = false;
const onFoundRouterReadyListeners: (() => any)[] = [];

// Fixes a bug when `found` ignores all navigation actions until its `componentDidMount()` is called.
//
// The code here is the first half of the workaround.
// The second half of the workaround is the added code in `found`'s `src/createBaseRouter.tsx` file:
//
// componentDidMount() {
//   if (typeof window !== 'undefined') {
//     if (window.onFoundRouterIsReady) {
//       window.onFoundRouterIsReady()
//     }
//   }
// }
//
// https://github.com/catamphetamine/found/commit/be416e3bc0715207f861fb5466ed666e9d7c016c
//
if (typeof window !== 'undefined') {
  window.onFoundRouterIsReady = () => {
    if (!foundRouterIsReady) {
      foundRouterIsReady = true;
      for (const onFoundRouterReadyListener of onFoundRouterReadyListeners) {
        onFoundRouterReadyListener();
      }
    }
  };
}

export default function onRouterReady<Result = any>(
  listener: () => Result,
): Result extends Promise ? Result : Promise<Result> {
  if (foundRouterIsReady) {
    return Promise.resolve(listener());
  }
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      onFoundRouterReadyListeners.push(() => resolve(listener()));
    }
  });
}
