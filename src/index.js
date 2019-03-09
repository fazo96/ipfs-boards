import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import configureStore, { history } from './store/configureStore'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { start } from './orbitdb'

const store = configureStore();

render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NewApp = require('./components/App').default
    render(
      <AppContainer>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <NewApp />
          </ConnectedRouter>
        </Provider>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

registerServiceWorker()
start(store.dispatch)