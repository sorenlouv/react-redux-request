import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import { ReactReduxRequestView } from './view';

// export reducer
export { reducer } from './reducer';

const mapStateToProps = (state, ownProps) => {
  const { args, id, selector } = ownProps;

  if (!state.reactReduxRequest) {
    throw new Error(
      'The key "reactReduxRequest" was not found in store. Did you setup your reducers?'
    );
  }

  const prevArgs = get(state.reactReduxRequest[id], 'args');
  const didArgsChange = !isEqual(args, prevArgs);

  let selectorResult;
  try {
    selectorResult = selector(state, { id });
  } catch (e) {
    console.error(`The selector for "Request#${id}" threw an error:\n`, e);
    throw new Error(e);
  }

  return {
    didArgsChange,
    selectorResult
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch
});

export const Request = connect(mapStateToProps, mapDispatchToProps)(
  ReactReduxRequestView
);

Request.propTypes = {
  args: PropTypes.array,
  fn: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  preventFetch: PropTypes.bool,
  render: PropTypes.func,
  selector: PropTypes.func
};

Request.defaultProps = {
  args: [],
  selector: (state, props) => state.reactReduxRequest[props.id]
};
