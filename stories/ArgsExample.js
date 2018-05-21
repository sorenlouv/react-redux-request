import React, { Component } from 'react';
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

class ArgsExample extends Component {
  state = {
    postId: 1
  };
  render() {
    return (
      <Provider store={store}>
        <div>
          <input
            min={1}
            max={100}
            placeholder="Id"
            value={this.state.postId}
            type="number"
            onChange={e => this.setState({ postId: e.target.value })}
          />
          <Request
            fn={postId =>
              fetch(
                `https://jsonplaceholder.typicode.com/posts/${postId}`
              ).then(response => response.json())
            }
            id="post-1"
            args={[this.state.postId]}
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
}

export default ArgsExample;
