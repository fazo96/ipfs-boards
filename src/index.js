import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from './store/configureStore';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

render(
  <AppContainer>
    <App store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

registerServiceWorker();

if (module.hot) {
    module.hot.accept('./components/App', () => {
      const NewApp = require('./components/App').default;
      render(
        <AppContainer>
          <NewApp store={store} history={history} />
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
