import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import createSagaMiddleware from 'redux-saga';
import saga from '../sagas';
import createHistory from 'history/createHashHistory';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();

export const history = createHistory();

function configureStoreProd(initialState) {
  const middlewares = [
    routerMiddleware(history),
    sagaMiddleware,
  ];

  const store = createStore(createRootReducer(history), initialState, compose(
    applyMiddleware(...middlewares)
    )
  );

  sagaMiddleware.run(saga);

  return store;
}

function configureStoreDev(initialState) {
  const middlewares = [
    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),
    routerMiddleware(history),
    sagaMiddleware,
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(createRootReducer(history), initialState, composeEnhancers(
    applyMiddleware(...middlewares)
    )
  );

  let sagaTask = sagaMiddleware.run(saga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
    // Enable Webpack hot module replacement for sagas
    module.hot.accept('../sagas', () => {
      const newSaga = require('../sagas').default;
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(newSaga);
      });
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
