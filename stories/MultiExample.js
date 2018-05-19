import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { Request, reducer } from '../src';

/*
 * This example demonstrates how you can render multiple Request on one page. They will render independently of each other
 * Please note that you should give them unique id's to avoid them writing to the same namespace in the redux store
 */

const reducers = combineReducers({ reactReduxRequest: reducer });
const store = createStore(reducers, applyMiddleware(logger));

function fetchPost(postId) {
  return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(
    response => response.json()
  );
}

export default function MultiExample() {
  return (
    <Provider store={store}>
      <div>
        <Request
          fn={fetchPost}
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
        <Request
          fn={fetchPost}
          id="post-2"
          args={[2]}
          render={({ status, data, error }) => (
            <div>
              <div>Status: {status}</div>
              <pre>{JSON.stringify(data, null, 4)}</pre>
              <pre>{error && error.message}</pre>
            </div>
          )}
        />
      </div>
    </Provider>
  );
}
