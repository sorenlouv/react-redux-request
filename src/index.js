import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import hash from 'object-hash/index';
import get from 'lodash.get';
import { ReactReduxRequestView } from './view';

// export reducer
export { reducer } from './reducer';

const mapStateToProps = (state, ownProps) => {
  const { args, id, selector } = ownProps;
  const hashedArgs = hash(args);
  let selectorResult;
  try {
    selectorResult = selector(state, { id });
  } catch (e) {
    console.error(`The selector for "Request#${id}" threw an error:\n`, e);
    return {
      hashedArgs,
      hasError: true
    };
  }

  return {
    prevHashedArgs: get(state.reactReduxRequest[id], 'hashedArgs'),
    hashedArgs,
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
