import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { ReduxRequest, reduxRequestReducer } from '../src';

const reducers = combineReducers({ reduxRequest: reduxRequestReducer });
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
        <ReduxRequest
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
        <ReduxRequest
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
