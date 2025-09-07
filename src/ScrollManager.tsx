// This code was forked from the original `found-scroll`
// https://github.com/4Catalyzer/found-scroll
// with a fix for React strict mode bug which included a complete rewrite
// of the React component using hooks:
// https://github.com/4Catalyzer/found-scroll/issues/382
//
// The code was also rewritten in TypeScript.
//
// The fork is up-to-date with the original `found-scroll` code changes as of Jul 2025.

import type { Session, Location } from 'navigation-stack';
import { ScrollPositionRestoration } from 'navigation-stack/scroll-position';

import {
  createElement,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  createContext,
} from 'react';

import type {
  RenderArgs,
  RenderReadyArgs,
  RenderErrorArgs,
} from './typeUtils';

export const ScrollContext = createContext<IContext | null>(null);

// Rewrote `<ScrollManager/>` from `found-scroll` in React hooks.
// Also fixed React strict mode bug.
// https://github.com/4Catalyzer/found-scroll/issues/382
export const ScrollManager: React.FC<Props> = ({
  session,
  renderArgs,
  // _shouldUpdateScrollPosition: shouldUpdateScrollPositionProperty,
  _onScrollPositionRestorationCreated,
  children,
}: Props) => {
  const { location } = renderArgs;

  const prevRenderArgs = useRef<RenderArgs>(null);
  const scrollPositionRestorationRef =
    useRef<ScrollPositionRestoration>(undefined);

  const scrollPositionRestoration = scrollPositionRestorationRef.current;

  const getCurrentLocation = useCallback(() => {
    return location;
  }, [location]);

  const getCurrentLocationRef = useRef<() => Location>(undefined);
  getCurrentLocationRef.current = getCurrentLocation;

  // `shouldUpdateScrollPosition` property was present in the original
  // `<ScrollManager/>` component from `found-scroll` package.
  // Here it's not used.
  //
  // const shouldUpdateScrollPositionProperty: (() => boolean) | undefined =
  //   undefined;
  //
  // const shouldUpdateScrollPosition = useCallback(() => {
  //   if (shouldUpdateScrollPositionProperty) {
  //     // A hack to allow access to `ScrollPositionRestoration` internals in tests.
  //     return shouldUpdateScrollPositionProperty();
  //   }
  //   return true;
  // }, [scrollPositionRestoration, shouldUpdateScrollPositionProperty]);

  const addScrollableContainer = useCallback(
    (key: string, element: HTMLElement) => {
      if (!scrollPositionRestoration) {
        throw new Error('`scrollPositionRestoration` is undefined');
      }
      return scrollPositionRestoration.addScrollableContainer(
        key,
        element,
        // {
        //   _shouldSetScrollPositionOnLocationChange: shouldUpdateScrollPosition
        // },
      );
    },
    [scrollPositionRestoration, renderArgs],
    // [shouldUpdateScrollPosition, scrollPositionRestoration, renderArgs],
  );

  const scrollContext = useMemo(
    () => ({
      addScrollableContainer,
    }),
    [addScrollableContainer],
  );

  useEffect(() => {
    const scrollPositionRestoration =
      new ScrollPositionRestoration<RenderArgs>(
        session,
        // {
        //   _shouldSetPageScrollPositionOnLocationChange: shouldUpdateScrollPosition,
        // }
      );
    // `_onScrollPositionRestorationCreated` is only used in tests.
    if (_onScrollPositionRestorationCreated) {
      _onScrollPositionRestorationCreated(scrollPositionRestoration);
    }
    scrollPositionRestorationRef.current = scrollPositionRestoration;
    return () => {
      scrollPositionRestoration.stop();
    };
  }, []);

  useEffect(() => {
    const scrollPositionRestoration = scrollPositionRestorationRef.current;
    const prevLocation =
      prevRenderArgs.current && prevRenderArgs.current.location;

    const isPageLoading = !(
      isRenderReadyArgs(renderArgs) || isRenderErrorArgs(renderArgs)
    );

    if (isPageLoading || renderArgs.location === prevLocation) {
      // If the location hasn't actually changed, or if we're in a global
      // pending state, don't update the scroll position.
      return;
    }

    if (!scrollPositionRestoration) {
      throw new Error('`scrollPositionRestoration` is undefined');
    }

    scrollPositionRestoration.locationRendered(renderArgs.location);
    prevRenderArgs.current = renderArgs;
  });

  return createElement(
    ScrollContext.Provider,
    { value: scrollContext },
    children,
  );
};

interface Props {
  session: Session;
  renderArgs: RenderArgs;
  _shouldUpdateScrollPosition?: (parameters: {
    _scrollPositionRestoration: ScrollPositionRestoration;
  }) => boolean;
  _onScrollPositionRestorationCreated?: (
    _scrollPositionRestoration: ScrollPositionRestoration,
  ) => void;
  children: React.ReactNode;
}

function isRenderReadyArgs(
  renderArgs: RenderArgs,
): renderArgs is RenderReadyArgs {
  return Boolean('elements' in renderArgs);
}

function isRenderErrorArgs(
  renderArgs: RenderArgs,
): renderArgs is RenderErrorArgs {
  return Boolean('error' in renderArgs);
}

interface IContext {
  addScrollableContainer: (key: string, element: HTMLElement) => () => void;
}
