import { BrowserProtocol } from '@catamphetamine/farce';
import createConnectedRouter from 'found/createConnectedRouter';
import getStoreRenderArgs from 'found/getStoreRenderArgs';
import resolver from 'found/resolver';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './configureStore';
import render from './render';

const store = configureStore(
  new BrowserProtocol(),
  window.__PRELOADED_STATE__, // eslint-disable-line no-underscore-dangle
);
const matchContext = { store };
const ConnectedRouter = createConnectedRouter({ render });

(async () => {
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolver,
  });

  ReactDOM.hydrate(
    <Provider store={store}>
      <ConnectedRouter
        matchContext={matchContext}
        resolver={resolver}
        initialRenderArgs={initialRenderArgs}
      />
    </Provider>,
    document.getElementById('root'),
  );
})();
