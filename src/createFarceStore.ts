import { type InputLocation, type Session } from 'navigation-stack';
import { Actions as FarceActions } from 'navigation-stack/redux';
import {
  createMiddlewares,
  type CreateMiddlewaresOptions,
} from 'navigation-stack/redux';
import {
  type Middleware,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';

import Matcher from './Matcher';
// import createBasePathEnhancer from './createBasePathEnhancer';
import createMatchEnhancer from './createMatchEnhancer';
import foundReducer from './foundReducer';
import { type RouteConfig } from './typeUtils';

interface Props {
  matcherOptions?: any;
  routeConfig: RouteConfig;
  initialLocation?: InputLocation;
  historyOptions?: CreateMiddlewaresOptions;
  historyMiddlewares?: Middleware[];
  historySession: Session;
}

// Originally, `found` router used `farce` library for web browser navigation.
// Later, I forked `farce` and published it as `navigation-stack` after some refactoring.
// I could rename this function (and this file) to something like `createNavigationStackStore()`
// but leaving it as `createFarceStore()` is easier in terms of potentially merging any future changes
// from the original `found` repository.
function createFarceStore({
  historySession,
  historyMiddlewares,
  historyOptions,
  initialLocation,
  routeConfig,
  matcherOptions,
}: Props) {
  if (historyMiddlewares) {
    throw new Error('`historyMiddlewares` parameter is not implemented');
  }
  const store = createStore(
    combineReducers({
      found: foundReducer,
    }),
    compose(
      applyMiddleware(...createMiddlewares(historySession, historyOptions)),
      // createBasePathEnhancer(historyOptions?.basePath),
      createMatchEnhancer(new Matcher(routeConfig, matcherOptions)),
    ),
  );

  store.dispatch(FarceActions.init(initialLocation));

  return store;
}

export default createFarceStore;
