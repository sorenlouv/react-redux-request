### Install

```
npm install @sqren/redux-request
```

### Getting started

```js
import { ReduxRequest, reduxRequestReducer } from '@sqren/redux-request';

// Add reduxRequestReducer to your store
const store = createStore((state = {}, action) => {
  return {
    ...state,
    reduxRequest: reduxRequestReducer(state.reduxRequest, action)
  };
});

// this method must return a promise
function getData() {
  return fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(response =>
    response.json()
  );
}

// Render ReduxRequest
return (
  <ReduxRequest
    fn={getData}
    id="my-request-id"
    render={({ status, data, error }) => <div>{status}</div>}
  />
);
```

### Run examples locally
```
npm run storybook
```
Open [localhost:6006](http://localhost:6006) in your browser

All examples are located in [https://github.com/sqren/redux-request/tree/master/stories](stories/)
