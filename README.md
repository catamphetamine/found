<div align="center">
<img src="https://4Catalyzer.github.io/found/img/f-logo-empty.svg" width="200">
<!---
Logo created by [Szymon Wiszczuk](https://www.github.com/golota60)
-->
<h1>Found</h1>
<p>
  Extensible route-based routing for React applications.
</p>
<br>

</div>

<p>
  This is a fork of the original <code>found</code> package with some changes:
</p>

<ul>
  <li>
    Replaced <code>redux</code> with a basic stubs of it. The rationale is that the <code>redux</code> that was used under the hood by this package would conflict with the redux used by the application itself.
  </li>
  <li>
    <code>farce</code> dependency was replaced with <a href="http://npmjs.com/package/navigation-stack"><code>navigation-stack</code></a> which is a fork of <code>farce</code> with some changes.
  </li>
  <li>
    Added a workaround for a bug when <code>found</code> router ignores any navigation actions that have been dispatched before its <code>componentDidMount()</code> has been called. Now it exports a client-side-only <code>onRouterReady()</code> function that could be used to execute code only after the router is ready to process navigation actions.
  </li>
  <li>
    Merged in <code>found-scroll</code> code and rewrote it in React hooks to fix a [bug](https://github.com/4Catalyzer/found-scroll/issues/382) in React strict mode.
  </li>
  <li>
    Removed <code>activeClassName</code>
  </li>
</ul>

<p>
  How <code>found</code> works in a nutshell:
</p>

<ul>
  <li>
    It listens to <code>navigation-stack</code>'s (or <code>farce</code>'s) <code>UPDATE</code> Redux action to get notified on the current location change.
  </li>
  <li>
    When the current location has changed, it matches the location against the routes configuration and finds a matching route. The matching route info is passed to the <code>&lt;Router/&gt;</code> React element as a <code>match</code> property.
  </li>
  <li>
    After that, <code>found</code> starts "resolving" the matched route, e.g. it will call <code>getData</code> function of each route segment and wait for those to finish. See <code>async resolveMatch()</code> method of <code>&lt;BaseRouter/&gt;</code> component in <code>createBaseRouter.tsx</code> file, which calls the code from <code>resolver.ts</code> file.
  </li>
  <li>
    After the matched route has been "resolved", a <code>resolvedMatch</code> property is passed to the <code>&lt;Router/&gt;</code> React element (similar to <code>match</code> property).
  </li>
  <li>
    The application (and the <code>&lt;Link/&gt;</code> React component) has access to <code>RouterContext</code> (via <code>useRouter()</code> hook) that provides <code>match</code> and <code>router</code> properties where <code>match</code> has the info on the matched route and <code>router</code> has a few utility functions such as <code>addBasePath()</code> (see <code>createStoreRouterObject.ts</code> file for the list of <code>router</code> properties).
  </li>
</ul>

<div>
  The source code is available at <a href="https://github.com/catamphetamine/farce">github.com</a> or <a href="https://gitlab.com/catamphetamine/farce">gitlab.com</a>.
</div>

<br>

[![Travis][build-badge]][build] [![npm][npm-badge]][npm]

Found is a router for [React](https://reactjs.org/) applications with a focus on power and extensibility. Found uses static route configurations. This enables efficient code splitting and data fetching with nested routes. Found also offers extensive control over indicating those loading states, even for routes with code bundles that have not yet been downloaded.

Found is designed to be extremely customizable. Most pieces of Found such as the path matching algorithm and the route element resolution can be fully replaced. This allows [extensions](#extensions) such as [Found Relay](https://github.com/4Catalyzer/found-relay) to provide first-class support for different use cases.

Found uses [Redux](https://redux.js.org/) for state management and [Farce](https://github.com/4Catalyzer/farce) for controlling browser navigation. It can integrate with your existing store and connected components.

[build-badge]: https://img.shields.io/travis/4Catalyzer/found/master.svg
[build]: https://travis-ci.org/4Catalyzer/found
[npm-badge]: https://img.shields.io/npm/v/found.svg
[npm]: https://www.npmjs.org/package/found
