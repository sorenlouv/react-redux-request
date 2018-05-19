import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { Request, reducer } from '../src';

/*
 * This example demonstrates how the component behaves when being unmounted/mounted
 * One might expect that re-mounting the component will re-fetch data - but this is not the case.
 *  The component will compare the passed args with those of the last result in the store.
 *  If they match it will omit re-fetching but still re-render
 *  If they don't match the component will re-fetch data by calling `fn` prop with new args and re-render by calling `render` prop with the result
 */

const reducers = combineReducers({ reactReduxRequest: reducer });
const store = createStore(reducers, applyMiddleware(logger));

class UnmountExample extends Component {
  state = { show: true };

  onClick = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <Provider store={store}>
        <div>
          <p>
            <button onClick={this.onClick}>Toggle</button>
          </p>
          {this.state.show && <Example />}
        </div>
      </Provider>
    );
  }
}

function Example() {
  return (
    <Request
      fn={() =>
        fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(response =>
          response.json()
        )
      }
      id="post-1"
      render={({ status, data, error }) => (
        <div>
          <div>Status: {status}</div>
          <pre>{JSON.stringify(data, null, 4)}</pre>
          <pre>{error && error.message}</pre>
        </div>
      )}
    />
  );
}

export default UnmountExample;
