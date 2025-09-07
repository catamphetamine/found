import createStoreRouterObject from './createStoreRouterObject';
import getRenderArgs from './getRenderArgs';
import { type GetStoreRenderArgsOptions, type RenderArgs } from './typeUtils';

// This function returns a promise. It doesn't need to be an async function
// because it doesn't use the promise's value.
export default function getStoreRenderArgs({
  store,
  // TODO: check types of this
  getFound = ({ found }: any) => found,
  matchContext,
  resolver,
  session,
  basePath,
}: GetStoreRenderArgsOptions): Promise<RenderArgs> {
  const router = createStoreRouterObject(store, {
    getFound,
    session,
    basePath,
  });
  const match = getFound(store.getState()).resolvedMatch;

  return getRenderArgs(router, { match, matchContext, resolver });
}
