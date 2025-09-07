import {
  ServerSideRenderSession,
  addBasePath,
  getLocationUrl,
} from 'navigation-stack';
import { Actions as HistoryActions } from 'navigation-stack/redux';
import React, { useMemo } from 'react';

import RouterContext from './RouterContext';
import createFarceStore from './createFarceStore';
import createRender from './createRender';
import getStoreRenderArgs from './getStoreRenderArgs';
import defaultResolver from './resolver';
import { FarceRouterOptions, RenderArgs, Resolver } from './typeUtils';

interface RouterProviderProps {
  renderArgs: RenderArgs;
  children: React.ReactNode;
}

function RouterProvider({ renderArgs, children }: RouterProviderProps) {
  return (
    <RouterContext.Provider
      value={useMemo(
        () => ({
          router: renderArgs.router,
          match: renderArgs,
        }),
        [renderArgs],
      )}
    >
      {children}
    </RouterContext.Provider>
  );
}

export { RouterProvider };

export interface GetFarceResultOptions
  extends Omit<FarceRouterOptions, 'store' | 'historySession'> {
  url: string;
  resolver?: Resolver;
  matchContext?: any;
}

interface FarceResult {
  status: number;
  element?: any;
  redirect?: any;
}

export async function getFarceResult({
  url,
  historyMiddlewares,
  historyOptions,
  routeConfig,
  matchContext,
  resolver = defaultResolver,
  renderPending,
  renderReady,
  renderError,
  render = createRender({
    renderPending,
    renderReady,
    renderError,
  }),
}: GetFarceResultOptions): Promise<FarceResult> {
  const store = createFarceStore({
    historySession: new ServerSideRenderSession(),
    historyMiddlewares,
    historyOptions,
    initialLocation: url,
    routeConfig,
  });

  let renderArgs: RenderArgs;

  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolver,
      basePath: historyOptions?.basePath,
    });
  } catch (e: any) {
    if (e.isFoundRedirectException) {
      // The store is not exposed to the user, so we need to build the redirect
      // URL here.
      return {
        status: e.status,
        redirect: {
          url:
            typeof e.location === 'string'
              ? e.location
              : addBasePath(
                  getLocationUrl(e.location),
                  historyOptions?.basePath,
                ),
        },
      };
    }

    /* istanbul ignore next: paranoid guard */
    throw e;
  } finally {
    // This is a no-op with ServerProtocol, but it doesn't hurt.
    store.dispatch(HistoryActions.stop());
  }

  return {
    status:
      'error' in renderArgs && renderArgs.error
        ? renderArgs.error.status
        : 200,
    element: (
      <RouterProvider renderArgs={renderArgs}>
        {render(renderArgs)}
      </RouterProvider>
    ),
  };
}
