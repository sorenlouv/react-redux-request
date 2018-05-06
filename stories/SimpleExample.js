import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ReduxRequest, reduxRequestReducer } from '../src';

const store = createStore((state = {}, action) => {
  return {
    ...state,
    reduxRequest: reduxRequestReducer(state.reduxRequest, action)
  };
});

export default function SimpleExample() {
  return (
    <Provider store={store}>
      <ReduxRequest
        fn={() =>
          fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(response =>
            response.json()
          )
        }
        id="post-1"
        render={({ status, data, error }) => {
          console.log(status);
          return (
            <div>
              <div>Status: {status}</div>
              <pre>{JSON.stringify(data, null, 4)}</pre>
              <pre>{error && error.message}</pre>
            </div>
          );
        }}
      />
    </Provider>
  );
}
