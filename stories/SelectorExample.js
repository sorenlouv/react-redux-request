import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { get } from 'lodash';
import { ReduxRequest, reduxRequestReducer } from '../src';

const reducers = combineReducers({ reduxRequest: reduxRequestReducer });
const store = createStore(reducers, applyMiddleware(logger));

export default function SelectorExample() {
  return (
    <Provider store={store}>
      <ReduxRequest
        fn={() =>
          fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(response =>
            response.json()
          )
        }
        id="post-1"
        selector={(state, props) => get(state.reduxRequest[props.id], 'data')}
        render={({ status, data, error }) => (
          <div>
            <div>Status: {status}</div>
            <pre>{JSON.stringify(data, null, 4)}</pre>
            <pre>{error && error.message}</pre>
          </div>
        )}
      />
    </Provider>
  );
}
