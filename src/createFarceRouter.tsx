import useIsomorphicEffect from '@restart/hooks/useIsomorphicEffect';
import { forwardRef, useImperativeHandle, useState } from 'react';

import createBaseRouter from './createBaseRouter';
import createFarceStore from './createFarceStore';
import {
  type FarceRouter,
  type FarceRouterOptions,
  type FoundState,
} from './typeUtils';

export default function createFarceRouter({
  store: userStore,
  historySession,
  historyMiddlewares,
  historyOptions,
  initialLocation,
  routeConfig,
  // @ts-expect-error TODO: matcher options should not accessible to end user
  matcherOptions,
  getFound = ({ found }: any) => found as FoundState,
  ...options
}: FarceRouterOptions): FarceRouter {
  const Router = createBaseRouter(options, {
    session: historySession,
    getFound,
  });

  const store =
    userStore ||
    createFarceStore({
      historySession,
      historyMiddlewares,
      historyOptions,
      initialLocation,
      routeConfig,
      matcherOptions,
    });

  const FarceRouterInstance: FarceRouter = forwardRef((props, ref) => {
    const [state, setState] = useState(() => {
      const { match, resolvedMatch } = getFound(store.getState());
      return { match, resolvedMatch };
    });

    // https://github.com/react-restart/hooks/blob/master/src/useIsomorphicEffect.ts
    useIsomorphicEffect(() => {
      return store.subscribe(() => {
        setState((prev) => {
          const { match, resolvedMatch } = getFound(store.getState());
          if (prev?.match === match && prev.resolvedMatch === resolvedMatch) {
            return prev;
          }
          return { match, resolvedMatch };
        });
      });
    }, []);

    useImperativeHandle(ref, () => store, []);

    return <Router {...props} {...state} store={store} />;
  });

  FarceRouterInstance.displayName = 'FarceRouter';

  return FarceRouterInstance;
}
