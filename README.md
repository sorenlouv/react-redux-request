[![Build Status](https://travis-ci.org/sqren/react-redux-request.svg?branch=master)](https://travis-ci.org/sqren/react-redux-request)
[![NPM version](https://img.shields.io/npm/v/react-redux-request.svg)](https://www.npmjs.com/package/react-redux-request)
[![dependencies Status](https://david-dm.org/sqren/react-redux-request/status.svg)](https://david-dm.org/sqren/react-redux-request)

Redux is great for handling application state but can result in a lot of boilerplate when it comes to data fetching. This component aims to reduce this boilerplate, and help you keep your components stateless.

[Demo on Codesandbox](https://codesandbox.io/s/64l7r47myn)

### Install

```
npm install react-redux-request
```

### Getting started

```js
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Request, reducer } from 'react-redux-request';

// Add reducer to your store
const reducers = combineReducers({ reactReduxRequest: reducer });
const store = createStore(reducers);

// `getData` must return a promise
function getData() {
  return fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(response =>
    response.json()
  );
}

const App = () => (
  <Provider store={store}>
    <Request
      fn={getData}
      id="post"
      render={({ status, data, error }) => <div>{status}</div>}
    />
  </Provider>
);
```

### Run examples locally

```
npm start
```

Open [localhost:6006](http://localhost:6006) in your browser

All examples are located in [https://github.com/sqren/react-redux-request/tree/master/stories](stories/)

### API

#### args: array

A list of arguments that will be applied to `fn`.

Example: `['a', 'b']`

#### fn: func

A function to fetch data. This must return a promise that resolves with the response. Arguments can be supplied with `args` prop. This will only be invoked on initial mount, and when `args` change.

#### id: string

The identifier used to store the data in redux. If `id` is `selected-user`, the data will be stored in `store.reactReduxRequest['selected-user']`.
This is useful if you have data you want to display different places in your application. By relying on redux as a cache, `reactReduxRequest` will only fetch the data once.

#### render: func

A so-called [render-prop](https://reactjs.org/docs/render-props.html) that will be called with the resolved or rejected value of `fn`. The render function is called with an object with these keys `{status, data, error}`

#### selector: func

This takes a selector (eg. from [re-select](https://github.com/reduxjs/reselect)) that will be called with `state, { id }`, where `state` is the entire store state, and `id` is the identifier supplied to the `Request` component.
