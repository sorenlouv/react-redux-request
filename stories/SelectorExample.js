import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { Request, reducer, getRequestState } from '../src';

/*
 * This example demonstrates how you can use selectors to return a custom response to the render callback
 * The selector will be called with the entire store state, which allows you to return any part of the state you want
 */

const reducers = combineReducers({ reactReduxRequest: reducer });
const store = createStore(reducers, applyMiddleware(logger));

export default function SelectorExample() {
  return (
    <Provider store={store}>
      <Request
        fn={() =>
          fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(response =>
            response.json()
          )
        }
        id="post-1"
        selector={(state, props) => getRequestState(state, props.id)}
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
