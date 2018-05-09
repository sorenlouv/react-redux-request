import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { ACTION_TYPES } from './reducer';

async function maybeFetchData(
  {
    args,
    dispatch,
    hasError,
    fn,
    hashedArgs,
    id,
    prevHashedArgs,
    shouldInvoke
  },
  ctx = {}
) {
  const shouldFetchData =
    shouldInvoke && prevHashedArgs !== hashedArgs && !hasError;

  if (!shouldFetchData) {
    return;
  }

  dispatch({
    id,
    hashedArgs,
    type: ACTION_TYPES.LOADING
  });
  const fetchId = uniqueId();
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
  componentWillMount() {
    maybeFetchData(this.props, this);
  }

  componentWillReceiveProps(nextProps) {
    maybeFetchData(nextProps, this);
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
  prevHashedArgs: PropTypes.string,
  render: PropTypes.func,
  selectorResult: PropTypes.any,
  shouldInvoke: PropTypes.bool.isRequired
};

ReduxRequestView.defaultProps = {
  args: [],
  hasError: false,
  render: () => {},
  selectorResult: {},
  shouldInvoke: true
};
