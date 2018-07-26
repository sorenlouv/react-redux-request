import React from 'react';
import PropTypes from 'prop-types';
import { ACTION_TYPES } from './reducer';
import { getDidArgsChange } from './helpers';

let uniqueId = 0;
function getUniqueId() {
  uniqueId += 1;
  return uniqueId;
}

export class ReactReduxRequestView extends React.Component {
  async maybeFetchData() {
    const { args, dispatch, fn, id, preventFetch } = this.props;
    // it is necessary to check whether args changed from the latest state,
    // in case another component simultanously initiated a request
    const state = (this.context.store || this.props.store).getState();
    const didArgsChange = getDidArgsChange(state, args, id);

    const shouldFetchData = !preventFetch && didArgsChange;
    if (!shouldFetchData) {
      return;
    }

    dispatch({
      args,
      id,
      type: ACTION_TYPES.DID_INIT_REQUEST
    });
    const fetchId = getUniqueId();
    this.fetchId = fetchId;
    try {
      const data = await fn(...args);
      if (fetchId === this.fetchId) {
        dispatch({
          args,
          data,
          id,
          type: ACTION_TYPES.DID_SUCCEED
        });
      }
    } catch (error) {
      if (fetchId === this.fetchId) {
        console.error(error);
        dispatch({
          args,
          error,
          id,
          type: ACTION_TYPES.DID_FAIL
        });
      }
    }
  }

  async componentDidMount() {
    try {
      await this.maybeFetchData();
    } catch (e) {
      console.error('An error occured', e);
    }
  }

  async componentDidUpdate() {
    try {
      await this.maybeFetchData();
    } catch (e) {
      console.error('An error occured', e);
    }
  }

  componentWillUnmount() {
    const { dispatch, id } = this.props;
    dispatch({
      id,
      type: ACTION_TYPES.DID_UNMOUNT
    });
    this.fetchId = null;
  }

  render() {
    try {
      return this.props.render(this.props.selectorResult);
    } catch (e) {
      console.error(
        `The render method of "Request#${this.props.id}" threw an error:\n`,
        e
      );
      return null;
    }
  }
}

ReactReduxRequestView.contextTypes = {
  store: PropTypes.object
};

ReactReduxRequestView.propTypes = {
  args: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  fn: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  preventFetch: PropTypes.bool.isRequired,
  render: PropTypes.func,
  selectorResult: PropTypes.any,
  store: PropTypes.object // only for testing purposes
};

ReactReduxRequestView.defaultProps = {
  args: [],
  preventFetch: false,
  render: () => null,
  selectorResult: {}
};
