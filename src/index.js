import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import hash from 'object-hash/index';
import { get } from 'lodash';
import { ReduxRequestView } from './view';

export { reduxRequestReducer } from './reducer';

const mapStateToProps = (state, ownProps) => {
  const { args, id, selector } = ownProps;
  const hashedArgs = hash(args);
  let data;
  try {
    data = selector(state, { id });
  } catch (e) {
    console.error(`The selector for "ReduxRequest#${id}" threw an error:\n`, e);
    return {
      hashedArgs,
      hasError: true
    };
  }

  const result = {
    ...state.reduxRequest[id],
    data
  };

  return {
    prevHashedArgs: result.hashedArgs,
    hashedArgs,
    result
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch
});

export const ReduxRequest = connect(mapStateToProps, mapDispatchToProps)(
  ReduxRequestView
);

ReduxRequest.propTypes = {
  args: PropTypes.array,
  id: PropTypes.string.isRequired,
  selector: PropTypes.func
};

ReduxRequest.defaultProps = {
  args: [],
  selector: (state, props) => get(state.reduxRequest[props.id], 'data')
};
