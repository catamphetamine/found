import { WebBrowserSession } from 'navigation-stack';

import createInitialFarceRouter from './createInitialFarceRouter';
import resolver from './resolver';
import {
  type BrowserRouter,
  type InitialBrowserRouterOptions,
} from './typeUtils';

export default function createInitialBrowserRouter(
  options: InitialBrowserRouterOptions,
): Promise<BrowserRouter> {
  return createInitialFarceRouter({
    ...options,
    historySession: new WebBrowserSession(),
    resolver,
  });
}
