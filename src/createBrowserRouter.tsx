import { WebBrowserSession } from 'navigation-stack';

import createFarceRouter from './createFarceRouter';
import resolver from './resolver';
import {
  type BrowserRouter,
  type BrowserRouterOptions,
  type FarceRouterProps,
} from './typeUtils';

export default function createBrowserRouter(
  options: BrowserRouterOptions,
): BrowserRouter {
  const Router = createFarceRouter({
    ...options,
    historySession: new WebBrowserSession(),
  });

  function BrowserRouterInstance(props: FarceRouterProps) {
    // @ts-expect-error TODO: resolver will be always overwritten
    return <Router resolver={resolver} {...props} />;
  }

  return BrowserRouterInstance;
}
