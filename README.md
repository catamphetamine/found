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
    In <code>package.json</code>, moved <code>redux</code> and <code>react-redux</code> from <code>dependencies</code> to <code>peerDependencies</code>. This fixed a version conflict bug in cases when <code>found</code> and the application itself used different versions of those two packages.
  </li>
  <li>
    <code>farce</code> dependency was replaced with <code>@catamphetamine/farce</code> fork.
  </li>
  <li>
    Added a workaround (<a href="https://github.com/catamphetamine/found/commit/be416e3bc0715207f861fb5466ed666e9d7c016c">part 1</a>, <a href="https://github.com/catamphetamine/found/commit/e63e8902cb1ea686086d7656a5c1732f818218c1">part 2</a>) for a bug when <code>found</code> router ignores any navigation actions that have been dispatched before its <code>componentDidMount()</code> was called. Now it exports a client-side-only <code>onRouterReady()</code> function that could be used to execute code only after the router is ready to process navigation actions.
  </li>
</ul>
<br>

[![Travis][build-badge]][build] [![npm][npm-badge]][npm]

Found is a router for [React](https://reactjs.org/) applications with a focus on power and extensibility. Found uses static route configurations. This enables efficient code splitting and data fetching with nested routes. Found also offers extensive control over indicating those loading states, even for routes with code bundles that have not yet been downloaded.

Found is designed to be extremely customizable. Most pieces of Found such as the path matching algorithm and the route element resolution can be fully replaced. This allows [extensions](#extensions) such as [Found Relay](https://github.com/4Catalyzer/found-relay) to provide first-class support for different use cases.

Found uses [Redux](https://redux.js.org/) for state management and [Farce](https://github.com/4Catalyzer/farce) for controlling browser navigation. It can integrate with your existing store and connected components.

[build-badge]: https://img.shields.io/travis/4Catalyzer/found/master.svg
[build]: https://travis-ci.org/4Catalyzer/found
[npm-badge]: https://img.shields.io/npm/v/found.svg
[npm]: https://www.npmjs.org/package/found
