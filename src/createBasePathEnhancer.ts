// // This "store enhancer" is currently not used.
// // Instead, `addBasePath` function is created directly in `createStoreRouterObject.ts` file.

// import { addBasePath } from 'navigation-stack';
//
// import { type StoreEnhancer } from 'redux';
//
// export default function createBasePathEnhancer(
//   basePath?: string,
// ): StoreEnhancer<{
//   addBasePath: (url: string) => string;
// }> {
//   return function basePathEnhancer(createStore) {
//     return (...args) => {
//       const store = createStore(...args);
//       return {
//         ...store,
//         addBasePath: (url: string) => addBasePath(url, basePath),
//       };
//     };
//   };
// }
