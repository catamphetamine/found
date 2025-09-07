import {
  type Session,
  addNavigationBlocker,
  addBasePath,
} from 'navigation-stack';
import { Actions as HistoryActions } from 'navigation-stack/redux';
import { type Store, bindActionCreators } from 'redux';

import replaceRouteConfig from './replaceRouteConfig';

import { type Router, type FoundState } from './typeUtils';

const NAVIGATION_ACTION_CREATORS = {
  push: HistoryActions.push,
  replace: HistoryActions.replace,
  go: HistoryActions.shift,
};

export default function createStoreRouterObject(
  store: Store,
  {
    basePath,
    session,
    getFound,
  }: {
    basePath?: string;
    session: Session;
    getFound: ({ found }: any) => FoundState;
  },
): Router {
  // TODO: create an enhanced store type with found and farce maybe?
  const { found } = store as any;
  const { matcher } = found;

  return {
    ...bindActionCreators(NAVIGATION_ACTION_CREATORS, store.dispatch),

    matcher,

    replaceRouteConfig: (routeConfig) =>
      replaceRouteConfig(routeConfig, matcher, store, getFound),

    addBasePath: (url: string) => addBasePath(url, basePath),

    // addNavigationListener: (listener) =>
    //   addNavigationListener(session, listener),

    addNavigationBlocker: (blocker) => addNavigationBlocker(session, blocker),

    // Expose isActive from matcher directly for convenience. This pattern is
    // faster than using matcher.isActive.bind(matcher).
    isActive: (match, location, options) =>
      matcher.isActive(match, location, options),
  };
}
