import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollManager } from '../src/ScrollManager';
import { InMemorySession } from 'navigation-stack';

const CustomComponent = () => <div />;

const location = {};

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  createHref: vi.fn(),
  createLocation: vi.fn(),
  isActive: vi.fn(),
  matcher: {
    match: vi.fn(),
    getRoutes: vi.fn(),
    isActive: vi.fn(),
    format: vi.fn(),
  },
  // addNavigationListener: vi.fn(),
};

const initialRenderArgs = {
  location,
  router,
};

describe('ScrollManager', () => {
  let session;

  beforeEach(() => {
    session = new InMemorySession();
    session.start('/');
  });

  afterEach(() => {
    // Even if a test case throws an error,
    // session should still be stopped.
    session.stop();
  });

  it('should render children (<div/>)', () => {
    const { container } = render(
      <ScrollManager session={session} renderArgs={initialRenderArgs}>
        <div />
      </ScrollManager>,
    );
    expect(container.querySelectorAll('div')).toHaveLength(1);
  });

  it('should render children (custom component)', () => {
    const { container } = render(
      <ScrollManager session={session} renderArgs={initialRenderArgs}>
        <CustomComponent />
      </ScrollManager>,
    );
    expect(container.querySelectorAll('div')).toHaveLength(1);
  });

  it('should notify `ScrollPositionRestoration` when location has changed', () => {
    let scrollPositionRestoration;

    const onScrollPositionRestorationCreated = (_) => {
      scrollPositionRestoration = _;
    };

    const { rerender } = render(
      <ScrollManager
        session={session}
        renderArgs={initialRenderArgs}
        _onScrollPositionRestorationCreated={
          onScrollPositionRestorationCreated
        }
      >
        <div />
      </ScrollManager>,
    );

    expect(scrollPositionRestoration).toBeDefined();

    scrollPositionRestoration.locationRendered = vi.fn();

    const newLocation = {};

    rerender(
      <ScrollManager
        session={session}
        renderArgs={{
          location: newLocation,
          router,
          elements: [React.createElement('div')],
        }}
        _onScrollPositionRestorationCreated={
          onScrollPositionRestorationCreated
        }
      >
        <div />
      </ScrollManager>,
    );

    expect(scrollPositionRestoration.locationRendered).toBeCalled();
  });

  it('should not notify `ScrollPositionRestoration` when properties changes but location did not change', () => {
    let scrollPositionRestoration;

    const onScrollPositionRestorationCreated = (_) => {
      scrollPositionRestoration = _;
    };

    const { rerender } = render(
      <ScrollManager
        session={session}
        renderArgs={initialRenderArgs}
        _onScrollPositionRestorationCreated={
          onScrollPositionRestorationCreated
        }
      >
        <div />
      </ScrollManager>,
    );

    expect(scrollPositionRestoration).toBeDefined();

    scrollPositionRestoration._setScrollPosition = vi.fn();

    rerender(
      <ScrollManager
        session={session}
        renderArgs={initialRenderArgs}
        _onScrollPositionRestorationCreated={
          onScrollPositionRestorationCreated
        }
      >
        <div />
      </ScrollManager>,
    );

    expect(scrollPositionRestoration._setScrollPosition).not.toBeCalled();
  });

  it('should stop `ScrollPositionRestoration` when the component is going to be unmounted', () => {
    let scrollPositionRestoration;

    const onScrollPositionRestorationCreated = (_) => {
      scrollPositionRestoration = _;
    };

    const { unmount } = render(
      <ScrollManager
        session={session}
        renderArgs={initialRenderArgs}
        _onScrollPositionRestorationCreated={
          onScrollPositionRestorationCreated
        }
      >
        <div />
      </ScrollManager>,
    );

    expect(scrollPositionRestoration).toBeDefined();

    scrollPositionRestoration.stop = vi.fn();

    unmount();

    expect(scrollPositionRestoration.stop).toBeCalled();
  });
});

// describe('#shouldUpdateScrollPosition', () => {
//   let session;
//
//   beforeEach(() => {
//     session = new InMemorySession();
//     session.start('/');
//   });
//
//   afterEach(() => {
//     // Even if a test case throws an error,
//     // session should still be stopped.
//     session.stop();
//   });
//
//   it('always return true when `shouldUpdateScrollPosition` is not present in props', () => {
//     let scrollPositionRestoration;
//
//     const onScrollPositionRestorationCreated = (_) => {
//       scrollPositionRestoration = _;
//     };
//
//     render(
//       <ScrollManager
//         session={session}
//         renderArgs={initialRenderArgs}
//         _onScrollPositionRestorationCreated={
//           onScrollPositionRestorationCreated
//         }
//       >
//         <div />
//       </ScrollManager>,
//     );
//
//     expect(scrollPositionRestoration).toBeDefined();
//
//     // There's no such instance method in `ScrollPositionRestoration` class.
//     expect(scrollPositionRestoration.shouldUpdateScrollPosition()).toBe(true);
//   });
//
//   it('should handle custom `shouldUpdateScrollPosition` property', () => {
//     let scrollPositionRestoration;
//
//     const onScrollPositionRestorationCreated = (_) => {
//       scrollPositionRestoration = _;
//     };
//
//     let returnValue = false;
//     const shouldUpdateScrollPosition = () => returnValue;
//
//     render(
//       <ScrollManager
//         session={session}
//         renderArgs={initialRenderArgs}
//         shouldUpdateScrollPosition={shouldUpdateScrollPosition}
//         _onScrollPositionRestorationCreated={
//           onScrollPositionRestorationCreated
//         }
//       >
//         <div />
//       </ScrollManager>,
//     );
//
//     expect(scrollPositionRestoration).toBeDefined();
//
//     expect(scrollPositionRestoration.shouldUpdateScrollPosition()).toBe(false);
//
//     returnValue = true;
//
//     expect(scrollPositionRestoration.shouldUpdateScrollPosition()).toBe(true);
//   });
// });
