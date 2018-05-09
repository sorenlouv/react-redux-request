import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { ReduxRequest, reduxRequestReducer } from '../src';

/*
 * This example demonstrates how you can nest ReduxRequest components, and render values from both
 * A timeout is added to the first component to demonstrate how they will re-render regardless of which renders first
 */

const reducers = combineReducers({ reduxRequest: reduxRequestReducer });
const store = createStore(reducers, applyMiddleware(logger));

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPost(postId, ms = 0) {
  await delay(ms);
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  return res.json();
}

export default function MultiExample() {
  return (
    <Provider store={store}>
      <div>
        <ReduxRequest
          fn={postId => fetchPost(postId, 2000)}
          id="post-1"
          args={[1]}
          render={post1 => (
            <ReduxRequest
              fn={fetchPost}
              id="post-2"
              args={[2]}
              render={post2 => (
                <div>
                  <pre>{JSON.stringify(post1, null, 4)}</pre>
                  <pre>{JSON.stringify(post2, null, 4)}</pre>
                </div>
              )}
            />
          )}
        />
      </div>
    </Provider>
  );
}
