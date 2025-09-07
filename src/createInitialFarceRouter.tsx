import createFarceRouter from './createFarceRouter';
import createFarceStore from './createFarceStore';
import getStoreRenderArgs from './getStoreRenderArgs';
import {
  FarceRouterProps,
  type FarceRouter,
  type InitialFarceRouterOptions,
} from './typeUtils';

export default async function createInitialFarceRouter({
  historySession,
  historyMiddlewares,
  historyOptions,
  initialLocation,
  routeConfig,
  matchContext,
  resolver,
  ...options
}: InitialFarceRouterOptions): Promise<FarceRouter> {
  const store = createFarceStore({
    historySession,
    historyMiddlewares,
    historyOptions,
    initialLocation,
    routeConfig,
  });

  const FarceRouter = createFarceRouter({ ...options, store } as any);

  // This intentionally doesn't handle RedirectExceptions, because those
  // shouldn't happen here anyway.
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolver,
    session: historySession,
    basePath: historyOptions?.basePath,
  });

  function InitialFarceRouter(props: FarceRouterProps) {
    return (
      <FarceRouter
        {...props}
        initialRenderArgs={props.initialRenderArgs ?? initialRenderArgs}
        matchContext={props.matchContext ?? matchContext}
        resolver={props.resolver ?? resolver}
      />
    );
  }
  // We own this FarceRouter, so it's safe to replace its default props.

  return InitialFarceRouter;
}
