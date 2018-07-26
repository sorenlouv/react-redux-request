import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactReduxRequestView } from './view';
import { STATE_KEY } from './helpers';

export function getRequestState(state, id) {
  if (id) {
    return state[STATE_KEY][id];
  }

  return state[STATE_KEY];
}

// export reducer
export { reducer } from './reducer';

const mapStateToProps = (state, ownProps) => {
  const { id, selector } = ownProps;

  if (!state[STATE_KEY]) {
    throw new Error(
      `The key "${STATE_KEY}" was not found in store. Did you setup your reducers?`
    );
  }

  let selectorResult;
  try {
    selectorResult = selector(state, { id });
  } catch (e) {
    console.error(`The selector for "Request#${id}" threw an error:\n`, e);
    throw new Error(e);
  }

  return {
    selectorResult
  };
};

export const Request = connect(mapStateToProps)(ReactReduxRequestView);

Request.propTypes /* remove-proptypes */ = {
  args: PropTypes.array,
  fn: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  preventFetch: PropTypes.bool,
  render: PropTypes.func,
  selector: PropTypes.func
};

Request.defaultProps = {
  args: [],
  selector: (state, props) => state[STATE_KEY][props.id]
};
