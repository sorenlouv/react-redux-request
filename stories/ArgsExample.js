import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { Request, reducer } from '../src';

/*
 * This example demonstrates how you can pass arguments to th fn callback
 * The component will re-render whenever the arguments change.
 */

const reducers = combineReducers({ reactReduxRequest: reducer });
const store = createStore(reducers, applyMiddleware(logger));

export default function ArgsExample() {
  return (
    <Provider store={store}>
      <Request
        fn={postId =>
          fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(
            response => response.json()
          )
        }
        id="post-1"
        args={[1]}
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
