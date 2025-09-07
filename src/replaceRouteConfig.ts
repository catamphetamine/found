import { ActionTypes as HistoryActionTypes } from 'navigation-stack/redux';

import type { Store } from 'redux';
import type Matcher from './Matcher';

import { type FoundState, type RouteConfig } from './typeUtils';

export default function replaceRouteConfig(
  routeConfig: RouteConfig,
  matcher: Matcher,
  store: Store,
  getFound: ({ found }: any) => FoundState,
) {
  matcher.replaceRouteConfig(routeConfig);

  store.dispatch<any>({
    type: HistoryActionTypes.UPDATE,
    payload: getFound(store.getState()).match.location,
  });
}
