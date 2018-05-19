import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { Request, reducer } from '../src';

/*
 * This example demonstrates how you can nest Request components, and render values from both
 * A timeout is added to the first component to demonstrate how they will re-render regardless of which renders first
 */

const reducers = combineReducers({ reactReduxRequest: reducer });
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
      <Request
        fn={postId => fetchPost(postId, 2000)}
        id="post-1"
        args={[1]}
        render={post1 => (
          <Request
            fn={fetchPost}
            id="post-2"
            args={[2]}
            render={post2 => (
              <div>
                <div>Status: {post1.status}</div>
                <pre>{JSON.stringify(post1.data, null, 4)}</pre>
                <div>Status: {post2.status}</div>
                <pre>{JSON.stringify(post2.data, null, 4)}</pre>
              </div>
            )}
          />
        )}
      />
    </Provider>
  );
}
