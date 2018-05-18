import React from 'react';
import PropTypes from 'prop-types';
import { ACTION_TYPES } from './reducer';

let uniqueId = 0;
function getUniqueId() {
  uniqueId += 1;
  return uniqueId;
}

async function maybeFetchData(
  {
    args,
    dispatch,
    fn,
    hasError,
    hashedArgs,
    id,
    preventFetch,
    prevHashedArgs
  },
  ctx = {}
) {
  const shouldFetchData =
    !preventFetch && prevHashedArgs !== hashedArgs && !hasError;

  if (!shouldFetchData) {
    return;
  }

  dispatch({
    id,
    hashedArgs,
    type: ACTION_TYPES.LOADING
  });
  const fetchId = getUniqueId();
  ctx.fetchId = fetchId;
  try {
    const data = await fn(...args);
    if (fetchId === ctx.fetchId) {
      dispatch({
        data,
        hashedArgs,
        id,
        type: ACTION_TYPES.SUCCESS
      });
    }
  } catch (error) {
    if (fetchId === ctx.fetchId) {
      console.error(error);
      dispatch({
        error,
        hashedArgs,
        id,
        type: ACTION_TYPES.FAILURE
      });
    }
  }
}

export class ReduxRequestView extends React.Component {
  componentDidMount() {
    maybeFetchData(this.props, this);
  }

  componentDidUpdate() {
    maybeFetchData(this.props, this);
  }

  componentWillUnmount() {
    const { dispatch, id } = this.props;
    dispatch({
      id,
      type: ACTION_TYPES.UNMOUNT
    });
    this.fetchId = null;
  }

  render() {
    const { hasError, render, selectorResult } = this.props;
    if (hasError) {
      return null;
    }

    try {
      return render(selectorResult);
    } catch (e) {
      console.error(
        `The render method of "ReduxRequest#${
          this.props.id
        }" threw an error:\n`,
        e
      );
      return null;
    }
  }
}

ReduxRequestView.propTypes = {
  args: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  fn: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  hashedArgs: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  preventFetch: PropTypes.bool.isRequired,
  prevHashedArgs: PropTypes.string,
  render: PropTypes.func,
  selectorResult: PropTypes.any
};

ReduxRequestView.defaultProps = {
  args: [],
  hasError: false,
  preventFetch: false,
  render: () => {},
  selectorResult: {}
};
