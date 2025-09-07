import { ActionTypes as HistoryActionTypes } from 'navigation-stack/redux';
import {
  type Middleware,
  type Store,
  type StoreEnhancer,
  applyMiddleware,
} from 'redux';

import ActionTypes from './ActionTypes';
import Matcher from './Matcher';
import replaceRouteConfig_ from './replaceRouteConfig';
import {
  type FoundState,
  type FoundStoreExtension,
  type RouteConfig,
} from './typeUtils';

function createMatchMiddleware(
  matcher: Matcher,
  getFound: ({ found }: any) => FoundState,
): Middleware {
  return function matchMiddleware(store: Store) {
    return (next) => (action) => {
      const { type, payload } = action;
      if (type !== HistoryActionTypes.UPDATE) {
        return next(action);
      }

      let matchPayload;
      if (!payload.doNotRerunMatch) {
        matchPayload = {
          location: payload,
          ...matcher.match(payload),
        };
      } else {
        // HAX: this is terrible, but sometimes you need to update the location without updating the routing world
        // so we mutate the current match which will keep it referencially the same and pass checks but update the location
        // on it
        const { match } = getFound(store.getState());
        match.location = payload;
        matchPayload = match;
      }

      return next({
        type: ActionTypes.UPDATE_MATCH,
        payload: matchPayload,
      });
    };
  };
}

export default function createMatchEnhancer(
  matcher: Matcher,
  getFound = ({ found }: any) => found,
): StoreEnhancer<{ found: FoundStoreExtension }> {
  return function matchEnhancer(createStore) {
    return (...args) => {
      const middlewareEnhancer = applyMiddleware(
        createMatchMiddleware(matcher, getFound),
      );

      const store = middlewareEnhancer(createStore)(...args);

      function replaceRouteConfig(routeConfig: RouteConfig) {
        replaceRouteConfig_(routeConfig, matcher, store, getFound);
      }

      return {
        ...store,
        found: { matcher, replaceRouteConfig },
      };
    };
  };
}
